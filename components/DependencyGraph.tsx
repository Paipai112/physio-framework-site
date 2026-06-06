"use client";

import { useState } from "react";
import Link from "next/link";

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

const layerColors: Record<string, string> = {
  L1: "#ef4444",
  L2: "#f59e0b",
  L3: "#10b981",
  L4: "#3b82f6",
  L5: "#8b5cf6",
};

export default function DependencyGraph({
  nodes,
  edges,
  width = 600,
  height = 400,
}: Props) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate positions in a layered layout
  const getPositions = () => {
    const positions: Record<string, { x: number; y: number }> = {};
    const padding = 60;

    // Group nodes by layer
    const byLayer: Record<string, Node[]> = {};
    nodes.forEach((n) => {
      if (!byLayer[n.layer]) byLayer[n.layer] = [];
      byLayer[n.layer].push(n);
    });

    const layerOrder = ["L1", "L2", "L3", "L4", "L5"];
    const activeLayers = layerOrder.filter((l) => byLayer[l]);
    const layerHeight = (height - 2 * padding) / Math.max(activeLayers.length, 1);

    activeLayers.forEach((layerId, li) => {
      const layerNodes = byLayer[layerId];
      const y = padding + li * layerHeight + layerHeight / 2;
      const nodeSpacing = (width - 2 * padding) / Math.max(layerNodes.length, 1);

      layerNodes.forEach((node, ni) => {
        const x = padding + ni * nodeSpacing + nodeSpacing / 2;
        positions[node.id] = { x, y };
      });
    });

    return positions;
  };

  const positions = getPositions();

  return (
    <svg
      width={width}
      height={height}
      className="w-full rounded-lg border border-slate-700/50 bg-slate-800/20"
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Edges */}
      {edges.map((edge, i) => {
        const source = positions[edge.source];
        const target = positions[edge.target];
        if (!source || !target) return null;
        return (
          <line
            key={`e-${i}`}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={
              hoveredNode === edge.source || hoveredNode === edge.target
                ? "#60a5fa"
                : "#334155"
            }
            strokeWidth={hoveredNode === edge.source || hoveredNode === edge.target ? 2 : 1}
            className="transition-all duration-300"
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const pos = positions[node.id];
        if (!pos) return null;
        const isHovered = hoveredNode === node.id;
        const color = layerColors[node.layer] || "#64748b";
        const labelLen = node.label.length;
        const labelWidth = Math.min(labelLen * 7 + 16, 140);
        const labelHeight = 22;

        return (
          <g key={node.id}>
            <a href={`/module/${node.id}`}>
              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={7}
                fill={color}
                stroke={isHovered ? "#fff" : "none"}
                strokeWidth={isHovered ? 2 : 0}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />
              {/* Always-visible label */}
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
                fill={isHovered ? "#fff" : "#e2e8f0"}
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
  );
}
