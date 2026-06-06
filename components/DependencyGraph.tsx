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

  // Non-passive wheel listener for scroll lock + pinch-to-zoom detection
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Horizontal swipe on trackpad — skip so the page can still pan horizontally when desired
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Detect trackpad pinch-to-zoom (ctrlKey === true on macOS Safari/Chrome pinch)
      const scaleFactor = e.ctrlKey
        ? (1 - e.deltaY * 0.005)
        : (e.deltaY > 0 ? 1.15 : 0.85);

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

  const getEdgeColor = useCallback(
    (isActive: boolean) => (isActive ? "#60A5FA" : "#2A2A2A"),
    [],
  );

  const getNodeLabelColor = useCallback(
    (isHovered: boolean) => (isHovered ? "#FAFAFA" : "#A3A3A3"),
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
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FFFFFF" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Edges */}
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
              className="transition-all duration-300"
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

          return (
            <g key={node.id}>
              <a href={`/module/${node.id}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={8}
                  fill={color}
                  stroke={isHovered ? "#FFFFFF" : "none"}
                  strokeWidth={isHovered ? 2.5 : 0}
                  filter={isHovered ? "url(#node-shadow)" : undefined}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
                <rect
                  x={pos.x - labelWidth / 2}
                  y={pos.y - labelHeight - 16}
                  width={labelWidth}
                  height={labelHeight}
                  rx={8}
                  fill="#1A1A1A"
                  stroke={`rgba(${r}, ${g}, ${b}, 0.5)`}
                  strokeWidth={1}
                  className="transition-all duration-200"
                />
                <text
                  x={pos.x}
                  y={pos.y - labelHeight / 2 - 16 + 0.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={getNodeLabelColor(isHovered)}
                  fontSize="12"
                  fontFamily="DM Sans, Noto Sans SC, sans-serif"
                  className="pointer-events-none transition-all duration-200"
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
