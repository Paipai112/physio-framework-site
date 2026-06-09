"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { modules } from "@/data/modules";
import { layers } from "@/data/layers";
import {
  buildFullDependencyGraph,
  getDependencyNeighbors,
} from "@/data/dependency-graph";
import { getLayerHex, layerBadgeColors } from "@/data/colors";
import type { Module } from "@/data/types";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface TooltipState {
  module: Module;
  x: number;
  y: number;
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ImportanceBadge({ importance }: { importance: Module["importance"] }) {
  const colorClass =
    importance === "high"
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : importance === "medium"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-slate-500/10 text-slate-400 border-slate-500/20";

  const label =
    importance === "high"
      ? "核心"
      : importance === "medium"
        ? "重要"
        : "辅助";

  return (
    <span
      className={`inline-block shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */

export default function PanoramicMap() {
  const router = useRouter();

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  /* ---- Derived data ---- */

  const fullGraph = useMemo(() => buildFullDependencyGraph(), []);

  const modulesByLayer = useMemo(() => {
    const byLayer: Record<string, Module[]> = {};
    for (const m of modules) {
      if (!byLayer[m.layer]) byLayer[m.layer] = [];
      byLayer[m.layer].push(m);
    }
    return byLayer;
  }, []);

  const highlightedIds = useMemo(() => {
    if (!selectedModuleId) return new Set<string>();
    const neighbors = getDependencyNeighbors(selectedModuleId);
    return new Set([...neighbors.all, selectedModuleId]);
  }, [selectedModuleId]);

  const selectedModule = useMemo(() => {
    if (!selectedModuleId) return null;
    return modules.find((m) => m.id === selectedModuleId) ?? null;
  }, [selectedModuleId]);

  const selectedNeighborCount = useMemo(() => {
    if (!selectedModuleId) return 0;
    return getDependencyNeighbors(selectedModuleId).all.length;
  }, [selectedModuleId]);

  /* ---- Handlers ---- */

  const handleCardClick = useCallback(
    (id: string) => {
      setSelectedModuleId((prev) => (prev === id ? null : id));
    },
    [],
  );

  const handleArrowClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      router.push(`/module/${id}`);
    },
    [router],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, module: Module) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;

      setTooltip({
        module,
        x,
        y,
      });
    },
    [],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Nudge tooltip slightly with the cursor inside the card
    setTooltip((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        x: e.clientX + 12,
        y: e.clientY - 10,
      };
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleDeselect = useCallback(() => {
    setSelectedModuleId(null);
  }, []);

  /* ---- Tooltip smart positioning ---- */

  useEffect(() => {
    if (!tooltip || !tooltipRef.current) return;

    const el = tooltipRef.current;
    const rect = el.getBoundingClientRect();

    let adjustedX = tooltip.x;
    let adjustedY = tooltip.y;

    // Flip horizontally if too close to right edge
    if (adjustedX + rect.width > window.innerWidth - 16) {
      adjustedX = window.innerWidth - rect.width - 16;
    }

    // Flip vertically if too close to bottom
    if (adjustedY + rect.height > window.innerHeight - 16) {
      adjustedY = adjustedY - rect.height - 20;
    }

    // Clamp to top
    if (adjustedY < 16) {
      adjustedY = 16;
    }

    // Clamp to left
    if (adjustedX < 16) {
      adjustedX = 16;
    }

    el.style.left = `${adjustedX}px`;
    el.style.top = `${adjustedY}px`;
  }, [tooltip]);

  /* ---- Visible layers ---- */

  const visibleLayers = layers.filter((l) => l.id !== "L0");

  /* ---- Render ---- */

  return (
    <div className="relative">
      {/* ========== Selection bar ========== */}
      {selectedModule && (
        <div className="mb-4 animate-slide-up rounded-xl border border-border-subtle bg-surface-elevated p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="shrink-0 inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: getLayerHex(selectedModule.layer) }}
            />
            <span className="font-semibold text-text-primary text-sm truncate">
              已选中: {selectedModule.name}
            </span>
            <span className="shrink-0 text-xs text-text-muted">
              关联 {selectedNeighborCount} 个模块
            </span>
          </div>
          <button
            onClick={handleDeselect}
            className="shrink-0 rounded-lg p-1.5 text-text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-text-primary"
            aria-label="取消选择"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
      )}

      {/* ========== Layer sections ========== */}
      {visibleLayers.map((layer) => {
        const layerModules = modulesByLayer[layer.id] ?? [];
        const hex = getLayerHex(layer.id);

        return (
          <section key={layer.id} className="mb-10">
            {/* Layer header */}
            <div
              className="mb-4 flex items-center gap-3 pl-2"
              style={{ borderLeft: `3px solid ${hex}` }}
            >
              <h2
                className="font-heading text-lg font-semibold text-text-primary"
                style={{ color: hex }}
              >
                {layer.id} {layer.name}
              </h2>
              <span className="rounded-full border border-border-subtle bg-surface-elevated px-2.5 py-0.5 text-xs font-medium text-text-muted">
                {layerModules.length} 个模块
              </span>
            </div>

            {/* Module cards grid */}
            <div className="flex flex-wrap gap-3">
              {layerModules.map((mod) => {
                const isSelected = selectedModuleId === mod.id;
                const isHighlighted = highlightedIds.has(mod.id);

                return (
                  <div
                    key={mod.id}
                    onClick={() => handleCardClick(mod.id)}
                    onMouseEnter={(e) => handleMouseEnter(e, mod)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className={[
                      "group relative cursor-pointer rounded-xl border p-3 transition duration-200 bg-surface-elevated border-border-subtle",
                      "min-w-[200px] max-w-[260px] flex-1",
                      "flex items-start gap-2.5",
                      // Hover (not selected)
                      !isSelected &&
                        !isHighlighted &&
                        "hover:border-white/10 hover:shadow-card-hover",
                      // Selected + highlighted
                      isSelected &&
                        isHighlighted &&
                        "border-opacity-100 shadow-glow",
                      // Selected but NOT highlighted
                      isSelected &&
                        !isHighlighted &&
                        "opacity-25 grayscale",
                      // Highlighted but not selected
                      !isSelected &&
                        isHighlighted &&
                        "border-opacity-100 shadow-glow",
                      // Reduced motion
                      "motion-reduce:transition-none",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={{
                      ...(isHighlighted
                        ? {
                            borderColor: hex,
                            boxShadow: `0 0 16px ${hex}22, 0 0 4px ${hex}18`,
                          }
                        : {}),
                      ...(isSelected && isHighlighted
                        ? {
                            borderColor: hex,
                            boxShadow: `0 0 20px ${hex}33, 0 0 6px ${hex}20`,
                          }
                        : {}),
                    }}
                  >
                    {/* Left accent strip */}
                    <div
                      className="absolute inset-y-0 left-0 w-[3px] rounded-l-xl"
                      style={{ backgroundColor: hex }}
                    />

                    {/* Content area */}
                    <div className="ml-1 flex-1 min-w-0 pt-0.5">
                      <h3 className="font-body text-sm font-semibold text-text-primary line-clamp-1">
                        {mod.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-text-muted line-clamp-1">
                        {mod.summary}
                      </p>
                    </div>

                    {/* Right: arrow button */}
                    <button
                      onClick={(e) => handleArrowClick(e, mod.id)}
                      className="shrink-0 rounded-lg p-1 text-text-muted opacity-0 transition duration-200 group-hover:opacity-100 hover:bg-surface-hover hover:text-text-primary"
                      aria-label={`查看 ${mod.name} 详情`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 3l4 4-4 4" />
                      </svg>
                    </button>
                  </div>
                );
              })}

              {/* Empty state */}
              {layerModules.length === 0 && (
                <p className="w-full py-6 text-center text-sm text-text-muted">
                  该层级暂无模块
                </p>
              )}
            </div>
          </section>
        );
      })}

      {/* ========== Tooltip ========== */}
      {tooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-50 pointer-events-none max-w-[280px] rounded-lg p-3 animate-scale-in"
          style={{
            background: "rgba(18, 18, 18, 0.97)",
            border: `1px solid ${getLayerHex(tooltip.module.layer)}40`,
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <h4 className="font-heading font-semibold text-sm text-text-primary line-clamp-1">
              {tooltip.module.name}
            </h4>
            <ImportanceBadge importance={tooltip.module.importance} />
          </div>

          <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
            {tooltip.module.summary}
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
              style={{
                borderColor: `${getLayerHex(tooltip.module.layer)}40`,
                color: getLayerHex(tooltip.module.layer),
              }}
            >
              {tooltip.module.layer}
            </span>
            {tooltip.module.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/5 text-text-muted text-xs px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
