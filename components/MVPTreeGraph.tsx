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

  const nodePositionMap = useMemo<Map<string, { x: number; y: number }>>(() => {
    const map = new Map<string, { x: number; y: number }>();

    for (let i = 0; i < LAYERS.length; i++) {
      const layerId = LAYERS[i];
      const layerNodes = nodes.filter((n) => n.layer === layerId);

      if (layerNodes.length === 0) {
        continue;
      }

      const y = START_Y + i * LAYER_SPACING;

      if (layerNodes.length === 1) {
        map.set(layerNodes[0].id, { x: width / 2, y });
        continue;
      }

      const usableWidth = width - PADDING_X * 2;
      const step = usableWidth / (layerNodes.length - 1);

      for (let j = 0; j < layerNodes.length; j++) {
        const x = PADDING_X + j * step;
        map.set(layerNodes[j].id, { x, y });
      }
    }

    return map;
  }, [nodes, width]);

  const connectedNodeIds = useMemo<Set<string>>(() => {
    if (!hoveredNodeId) {
      return new Set();
    }

    const connected = new Set<string>();
    connected.add(hoveredNodeId);

    const edgeMap = new Map<string, Set<string>>();
    const reverseEdgeMap = new Map<string, Set<string>>();

    for (const edge of edges) {
      if (!edgeMap.has(edge.source)) {
        edgeMap.set(edge.source, new Set());
      }
      edgeMap.get(edge.source)!.add(edge.target);

      if (!reverseEdgeMap.has(edge.target)) {
        reverseEdgeMap.set(edge.target, new Set());
      }
      reverseEdgeMap.get(edge.target)!.add(edge.source);
    }

    const queue = [hoveredNodeId];
    for (let i = 0; i < queue.length; i++) {
      const current = queue[i];

      const downstream = edgeMap.get(current);
      if (downstream) {
        downstream.forEach((target) => {
          if (!connected.has(target)) {
            connected.add(target);
            queue.push(target);
          }
        });
      }

      const upstream = reverseEdgeMap.get(current);
      if (upstream) {
        upstream.forEach((source) => {
          if (!connected.has(source)) {
            connected.add(source);
            queue.push(source);
          }
        });
      }
    }

    return connected;
  }, [hoveredNodeId, edges]);

  const connectedEdgeIds = useMemo<Set<string>>(() => {
    if (!hoveredNodeId) {
      return new Set();
    }

    const connected = new Set<string>();
    for (const edge of edges) {
      if (connectedNodeIds.has(edge.source) && connectedNodeIds.has(edge.target)) {
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
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#333" />
        </marker>
      </defs>

      {edges.map((edge) => {
        const sourcePos = nodePositionMap.get(edge.source);
        const targetPos = nodePositionMap.get(edge.target);

        if (!sourcePos || !targetPos) {
          return null;
        }

        const edgeKey = `${edge.source}->${edge.target}`;
        const isEdgeConnected =
          !isDimmed || connectedEdgeIds.has(edgeKey);
        const isEdgeDirect =
          isDimmed &&
          (edge.source === hoveredNodeId || edge.target === hoveredNodeId);

        const sourceColor = getLayerHex(
          nodes.find((n) => n.id === edge.source)?.layer ?? '',
        );

        let strokeColor = '#333';
        let strokeWidth = 1.5;
        let opacity = 1;

        if (isDimmed) {
          if (isEdgeConnected) {
            strokeColor = sourceColor;
            strokeWidth = isEdgeDirect ? 2.5 : 2;
          } else {
            opacity = 0.05;
          }
        }

        const dx = targetPos.x - sourcePos.x;
        const dy = targetPos.y - sourcePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist === 0) {
          return null;
        }

        const offsetX = (dx / dist) * (NODE_HEIGHT / 2);
        const offsetY = (dy / dist) * (NODE_HEIGHT / 2);

        const x1 = sourcePos.x;
        const y1 = sourcePos.y + NODE_HEIGHT / 2;
        const x2 = targetPos.x;
        const y2 = targetPos.y - NODE_HEIGHT / 2;

        return (
          <line
            key={edgeKey}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={opacity}
            markerEnd="url(#arrowhead)"
            style={{ transition: 'opacity 200ms ease, stroke 200ms ease, stroke-width 200ms ease' }}
          />
        );
      })}

      {nodes.map((node) => {
        const pos = nodePositionMap.get(node.id);
        if (!pos) {
          return null;
        }

        const layerColor = getLayerHex(node.layer);
        const isConnected = !isDimmed || connectedNodeIds.has(node.id);
        const isHovered = hoveredNodeId === node.id;
        const isDirectlyConnected =
          isDimmed &&
          !isHovered &&
          (edges.some(
            (e) =>
              (e.source === hoveredNodeId && e.target === node.id) ||
              (e.target === hoveredNodeId && e.source === node.id),
          ) ||
            connectedNodeIds.has(node.id));

        const opacity = isDimmed && !isConnected ? 0.15 : 1;
        const rectStrokeOpacity = isHovered
          ? 1
          : isDirectlyConnected
            ? 0.8
            : 0.4;
        const rectStrokeWidth = isHovered ? 2 : 1;
        const glowFilter = isHovered
          ? `drop-shadow(0 0 8px ${layerColor}40)`
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
              opacity,
              transition: 'opacity 200ms ease',
              filter: glowFilter,
            }}
          >
            <rect
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx={8}
              fill="rgba(10, 10, 10, 0.9)"
              stroke={layerColor}
              strokeWidth={rectStrokeWidth}
              strokeOpacity={rectStrokeOpacity}
              style={{ transition: 'stroke 200ms ease, stroke-opacity 200ms ease, stroke-width 200ms ease' }}
            />
            <text
              x={NODE_WIDTH / 2}
              y={22}
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

            {isHovered && (
              <g transform={`translate(${NODE_WIDTH + 8}, ${NODE_HEIGHT / 2})`}>
                <rect
                  x={0}
                  y={-18}
                  width={220}
                  height={36}
                  rx={4}
                  fill="rgba(24, 24, 27, 0.95)"
                  stroke={layerColor}
                  strokeWidth={1}
                  strokeOpacity={0.6}
                />
                <text
                  x={8}
                  y={-4}
                  fill="#D4D4D8"
                  fontSize={10}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {node.whyMVP.length > 40
                    ? `${node.whyMVP.slice(0, 40)}...`
                    : node.whyMVP}
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
