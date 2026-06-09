"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { LAYER_COLORS, LAYER_COLOR_FALLBACK } from "@/data/colors";

interface Node {
  id: string;
  label: string;
  layer: string;
}

interface Edge {
  source: string;
  target: string;
}

interface Props {
  nodes: Node[];
  edges: Edge[];
  width?: number;
  height?: number;
}

function hexToRGB(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

export default function DependencyGraph({
  nodes,
  edges,
  width = 700,
  height = 400,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: width, h: height });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const result: Record<string, { x: number; y: number }> = {};
    const padding = 60;

    const byLayer: Record<string, Node[]> = {};
    nodes.forEach((n) => {
      if (!byLayer[n.layer]) byLayer[n.layer] = [];
      byLayer[n.layer].push(n);
    });

    const layerOrder = ["L1", "L2", "L3", "L4", "L5"];
    const activeLayers = layerOrder.filter((l) => byLayer[l]);
    const layerHeight =
      (height - 2 * padding) / Math.max(activeLayers.length, 1);

    activeLayers.forEach((layerId, li) => {
      const layerNodes = byLayer[layerId];
      const y = padding + li * layerHeight + layerHeight / 2;
      const nodeSpacing =
        (width - 2 * padding) / Math.max(layerNodes.length, 1);

      layerNodes.forEach((node, ni) => {
        const x = padding + ni * nodeSpacing + nodeSpacing / 2;
        result[node.id] = { x, y };
      });
    });

    return result;
  }, [nodes, width, height]);

  // Compute the set of node IDs that are directly connected by an edge to the hovered node.
  // These nodes get a "related" highlight so users can see which nodes the glowing edges lead to.
  const connectedNodeIds = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const connected = new Set<string>();
    edges.forEach((edge) => {
      if (edge.source === hoveredNode) connected.add(edge.target);
      if (edge.target === hoveredNode) connected.add(edge.source);
    });
    return connected;
  }, [hoveredNode, edges]);

  // Non-passive wheel listener for scroll lock + pinch-to-zoom detection
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const scaleFactor = e.ctrlKey
        ? 1 + e.deltaY * 0.005
        : e.deltaY > 0
          ? 1.15
          : 0.85;

      setViewBox((vb) => {
        const newW = vb.w * scaleFactor;
        const newH = vb.h * scaleFactor;
        const clampedW = Math.min(Math.max(newW, 200), width * 3);
        const clampedH = Math.min(Math.max(newH, 150), height * 3);
        return {
          x: vb.x + (vb.w - clampedW) / 2,
          y: vb.y + (vb.h - clampedH) / 2,
          w: clampedW,
          h: clampedH,
        };
      });
    };

    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [viewBox.w, viewBox.h, width, height]);

  // Cleanup hover timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // Debounced hover handlers — a brief delay on leave prevents flicker when
  // the cursor moves between adjacent nodes, since the next node's enter will
  // cancel the pending leave timeout before it fires.
  const handleNodeEnter = useCallback((nodeId: string) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHoveredNode(nodeId);
  }, []);

  const handleNodeLeave = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => {
      setHoveredNode(null);
    }, 80);
  }, []);

  const getEdgeColor = useCallback(
    (isActive: boolean) => (isActive ? "#60A5FA" : "#2A2A2A"),
    [],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - viewBox.x, y: e.clientY - viewBox.y });
      }
    },
    [viewBox],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;
      setViewBox((vb) => ({
        ...vb,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      }));
    },
    [isPanning, panStart],
  );

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const resetZoom = useCallback(
    () => setViewBox({ x: 0, y: 0, w: width, h: height }),
    [width, height],
  );

  const isZoomed = viewBox.w !== width;

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full rounded-2xl border border-border-subtle bg-surface-elevated"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
      >
        <defs>
          <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          <filter id="node-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3"
              floodColor="#FFFFFF"
              floodOpacity="0.25"
            />
          </filter>
        </defs>

        {/* Edges — highlight when either endpoint is the hovered node */}
        {edges.map((edge, i) => {
          const source = positions[edge.source];
          const target = positions[edge.target];
          if (!source || !target) return null;
          const isActive =
            hoveredNode === edge.source || hoveredNode === edge.target;
          return (
            <line
              key={`e-${i}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={getEdgeColor(isActive)}
              strokeWidth={isActive ? 2 : 1}
              filter={isActive ? "url(#edge-glow)" : undefined}
              className="transition-all duration-150"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;
          const color = LAYER_COLORS[node.layer] || LAYER_COLOR_FALLBACK;
          const { r, g, b } = hexToRGB(color);
          const labelLen = node.label.length;
          const labelWidth = Math.min(labelLen * 7.5 + 18, 150);
          const labelHeight = 22;
          const isHovered = hoveredNode === node.id;
          const isConnected = connectedNodeIds.has(node.id);

          // Visual state precedence: hovered > connected > idle
          const labelFill = isHovered
            ? "#1A1A1A"
            : isConnected
              ? "#252525"
              : "#1A1A1A";
          const labelStroke = isHovered
            ? `rgba(${r}, ${g}, ${b}, 0.9)`
            : isConnected
              ? `rgba(${r}, ${g}, ${b}, 0.5)`
              : `rgba(${r}, ${g}, ${b}, 0.25)`;
          const textFill = isHovered
            ? "#FAFAFA"
            : isConnected
              ? "#D4D4D4"
              : "#A3A3A3";
          const circleStroke = isHovered
            ? "#FFFFFF"
            : isConnected
              ? `rgba(${r}, ${g}, ${b}, 0.7)`
              : "none";
          const circleStrokeWidth = isHovered ? 2.5 : isConnected ? 1.5 : 0;

          return (
            <g
              key={node.id}
              onMouseEnter={() => handleNodeEnter(node.id)}
              onMouseLeave={handleNodeLeave}
              className="cursor-pointer"
            >
              <a href={`/module/${node.id}`}>
                {/* Invisible hit-area rect — covers the full node (circle +
                    label) so there are no gaps that cause spurious
                    mouseleave events when moving between elements. */}
                <rect
                  x={pos.x - labelWidth / 2 - 4}
                  y={pos.y - labelHeight - 16 - 4}
                  width={labelWidth + 8}
                  height={labelHeight + 16 + 8 + 4}
                  rx={10}
                  fill="transparent"
                  stroke="none"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={8}
                  fill={color}
                  stroke={circleStroke}
                  strokeWidth={circleStrokeWidth}
                  filter={isHovered ? "url(#node-shadow)" : undefined}
                  className="transition-all duration-150"
                />
                <rect
                  x={pos.x - labelWidth / 2}
                  y={pos.y - labelHeight - 16}
                  width={labelWidth}
                  height={labelHeight}
                  rx={8}
                  fill={labelFill}
                  stroke={labelStroke}
                  strokeWidth={1}
                  className="transition-all duration-150"
                />
                <text
                  x={pos.x}
                  y={pos.y - labelHeight / 2 - 16 + 0.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={textFill}
                  fontSize="12"
                  fontFamily="DM Sans, Noto Sans SC, sans-serif"
                  className="pointer-events-none transition-all duration-150"
                >
                  {node.label}
                </text>
              </a>
            </g>
          );
        })}
      </svg>

      {isZoomed && (
        <button
          onClick={resetZoom}
          className="absolute top-3 right-3 rounded-xl bg-surface-highlight/90 backdrop-blur-sm border border-border-subtle px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200"
        >
          重置
        </button>
      )}
    </div>
  );
}
