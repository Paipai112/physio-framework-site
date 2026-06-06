"use client";

import { useState, useMemo, useCallback } from "react";
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

export default function DependencyGraph({
  nodes,
  edges,
  width = 700,
  height = 400,
}: Props) {
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

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const scale = e.deltaY > 0 ? 1.15 : 0.85;
      const newW = viewBox.w * scale;
      const newH = viewBox.h * scale;
      const clampedW = Math.min(Math.max(newW, 200), width * 3);
      const clampedH = Math.min(Math.max(newH, 150), height * 3);
      setViewBox((vb) => ({
        x: vb.x + (vb.w - clampedW) / 2,
        y: vb.y + (vb.h - clampedH) / 2,
        w: clampedW,
        h: clampedH,
      }));
    },
    [viewBox, width, height]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - viewBox.x, y: e.clientY - viewBox.y });
      }
    },
    [viewBox]
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
    [isPanning, panStart]
  );

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const resetZoom = useCallback(
    () => setViewBox({ x: 0, y: 0, w: width, h: height }),
    [width, height]
  );

  return (
    <div className="relative">
      <svg
        width={width}
        height={height}
        className="w-full rounded-lg border border-slate-700/50 bg-slate-800/20"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
      >
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
              stroke={isActive ? "#60a5fa" : "#334155"}
              strokeWidth={isActive ? 2 : 1}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;
          const color = LAYER_COLORS[node.layer] || LAYER_COLOR_FALLBACK;
          const labelLen = node.label.length;
          const labelWidth = Math.min(labelLen * 7 + 16, 140);
          const labelHeight = 22;

          return (
            <g key={node.id}>
              <a href={`/module/${node.id}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={7}
                  fill={color}
                  stroke={hoveredNode === node.id ? "#fff" : "none"}
                  strokeWidth={hoveredNode === node.id ? 2 : 0}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
                <rect
                  x={pos.x - labelWidth / 2}
                  y={pos.y - labelHeight - 10}
                  width={labelWidth}
                  height={labelHeight}
                  rx={4}
                  fill={color + "30"}
                  stroke={color + "80"}
                  strokeWidth={1}
                  className="transition-all duration-200"
                />
                <text
                  x={pos.x}
                  y={pos.y - labelHeight / 2 - 10 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={hoveredNode === node.id ? "#fff" : "#e2e8f0"}
                  fontSize="11"
                  className="pointer-events-none"
                >
                  {node.label}
                </text>
              </a>
            </g>
          );
        })}
      </svg>

      {viewBox.w !== width && (
        <button
          onClick={resetZoom}
          className="absolute right-2 top-2 rounded bg-slate-700/80 px-2 py-1 text-xs text-slate-300 hover:bg-slate-600 transition-colors"
        >
          重置
        </button>
      )}
    </div>
  );
}
