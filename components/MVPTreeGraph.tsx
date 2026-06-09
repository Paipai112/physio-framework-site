'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getLayerHex } from '@/data/colors';

export interface MvpNode {
  id: string;
  layer: string;
  name: string;
  whyMVP: string;
  keyMetric: string;
}

export interface MvpEdge {
  source: string;
  target: string;
}

export interface MVPTreeGraphProps {
  nodes: MvpNode[];
  edges: MvpEdge[];
  width: number;
  height: number;
}

const NODE_WIDTH = 140;
const NODE_HEIGHT = 48;
const LAYER_SPACING = 130;
const PADDING_X = 80;
const START_Y = 60;

const LAYERS = ['L1', 'L2', 'L3', 'L4', 'L5'];

function MVPTreeGraph({ nodes, edges, width, height }: MVPTreeGraphProps) {
  const router = useRouter();
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  /* ---- Layout: layered top-down --------------------------------- */
  const nodePositionMap = useMemo<Map<string, { x: number; y: number }>>(() => {
    const map = new Map<string, { x: number; y: number }>();

    for (let i = 0; i < LAYERS.length; i++) {
      const layerId = LAYERS[i];
      const layerNodes = nodes.filter((n) => n.layer === layerId);

      if (layerNodes.length === 0) continue;

      const y = START_Y + i * LAYER_SPACING;

      if (layerNodes.length === 1) {
        map.set(layerNodes[0].id, { x: width / 2, y });
        continue;
      }

      const usableWidth = width - PADDING_X * 2;
      const step = usableWidth / (layerNodes.length - 1);

      for (let j = 0; j < layerNodes.length; j++) {
        map.set(layerNodes[j].id, { x: PADDING_X + j * step, y });
      }
    }

    return map;
  }, [nodes, width]);

  /* ---- 1-hop connected set for hover highlighting ----------------- */
  const connectedNodeIds = useMemo<Set<string>>(() => {
    if (!hoveredNodeId) return new Set();

    const connected = new Set<string>();
    connected.add(hoveredNodeId);

    for (const edge of edges) {
      if (edge.source === hoveredNodeId) connected.add(edge.target);
      if (edge.target === hoveredNodeId) connected.add(edge.source);
    }

    return connected;
  }, [hoveredNodeId, edges]);

  const connectedEdgeIds = useMemo<Set<string>>(() => {
    if (!hoveredNodeId) return new Set();

    const connected = new Set<string>();
    for (const edge of edges) {
      if (
        connectedNodeIds.has(edge.source) &&
        connectedNodeIds.has(edge.target)
      ) {
        connected.add(`${edge.source}->${edge.target}`);
      }
    }
    return connected;
  }, [hoveredNodeId, edges, connectedNodeIds]);

  const handleMouseEnter = useCallback((nodeId: string) => {
    setHoveredNodeId(nodeId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  const handleClick = useCallback(
    (nodeId: string) => {
      router.push(`/module/${nodeId}`);
    },
    [router],
  );

  const isDimmed = hoveredNodeId !== null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Arrowhead marker — uses context-stroke so it inherits the line colour */}
      <defs>
        <marker
          id="arrow"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon points="0 0, 8 3, 0 6" fill="context-stroke" />
        </marker>
      </defs>

      {/* ---- Edges ------------------------------------------------- */}
      {edges.map((edge) => {
        const src = nodePositionMap.get(edge.source);
        const tgt = nodePositionMap.get(edge.target);
        if (!src || !tgt) return null;

        const edgeKey = `${edge.source}->${edge.target}`;
        const isEdgeConnected =
          !isDimmed || connectedEdgeIds.has(edgeKey);

        const sourceColor = getLayerHex(
          nodes.find((n) => n.id === edge.source)?.layer ?? '',
        );

        let strokeColor = '#555';
        let strokeWidth = 1.2;
        let op = 1;

        if (isDimmed) {
          if (isEdgeConnected) {
            strokeColor = sourceColor;
            strokeWidth = 2;
          } else {
            op = 0.04;
          }
        }

        // Simple centre-to-centre: exit bottom of source, enter top of target
        const x1 = src.x;
        const y1 = src.y + NODE_HEIGHT / 2;
        const x2 = tgt.x;
        const y2 = tgt.y - NODE_HEIGHT / 2;

        return (
          <line
            key={edgeKey}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={op}
            markerEnd="url(#arrow)"
            style={{
              transition:
                'opacity 200ms ease, stroke 200ms ease, stroke-width 200ms ease',
            }}
          />
        );
      })}

      {/* ---- Nodes ------------------------------------------------- */}
      {nodes.map((node) => {
        const pos = nodePositionMap.get(node.id);
        if (!pos) return null;

        const layerColor = getLayerHex(node.layer);
        const isConnected = !isDimmed || connectedNodeIds.has(node.id);
        const isHovered = hoveredNodeId === node.id;

        const nodeOpacity = isDimmed && !isConnected ? 0.12 : 1;
        const strokeOp = isHovered ? 1 : isConnected && isDimmed ? 0.75 : 0.4;
        const strokeW = isHovered ? 2 : 1;
        const glow = isHovered
          ? `drop-shadow(0 0 8px ${layerColor}50)`
          : 'none';

        return (
          <g
            key={node.id}
            transform={`translate(${pos.x - NODE_WIDTH / 2}, ${pos.y})`}
            onMouseEnter={() => handleMouseEnter(node.id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(node.id)}
            style={{
              cursor: 'pointer',
              opacity: nodeOpacity,
              transition: 'opacity 200ms ease',
              filter: glow,
            }}
          >
            <rect
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx={8}
              fill="rgba(10, 10, 10, 0.92)"
              stroke={layerColor}
              strokeWidth={strokeW}
              strokeOpacity={strokeOp}
              style={{
                transition:
                  'stroke 200ms ease, stroke-opacity 200ms ease, stroke-width 200ms ease',
              }}
            />
            <text
              x={NODE_WIDTH / 2}
              y={21}
              textAnchor="middle"
              fill="#FAFAFA"
              fontSize={12}
              fontWeight={500}
            >
              {node.name}
            </text>
            <text
              x={NODE_WIDTH / 2}
              y={38}
              textAnchor="middle"
              fill={layerColor}
              fontSize={10}
            >
              {node.keyMetric}
            </text>

            {/* ---- Tooltip on hover ------------------------------- */}
            {isHovered && (
              <g
                transform={`translate(${NODE_WIDTH + 10}, ${-NODE_HEIGHT / 2})`}
              >
                <rect
                  x={0}
                  y={0}
                  width={260}
                  height={52}
                  rx={6}
                  fill="rgba(18, 18, 18, 0.97)"
                  stroke={layerColor}
                  strokeWidth={1}
                  strokeOpacity={0.5}
                />
                <text
                  x={12}
                  y={20}
                  fill="#D4D4D8"
                  fontSize={13}
                  fontWeight={500}
                >
                  {node.name}
                </text>
                <text x={12} y={40} fill="#A3A3A3" fontSize={12}>
                  {node.whyMVP}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default MVPTreeGraph;
