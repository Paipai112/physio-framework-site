"use client";

import { useState } from "react";
import { layers as allLayers } from "@/data/layers";
import ModuleCard from "@/components/ModuleCard";
import { layerBadgeColors } from "@/data/colors";
import type { Module } from "@/data/types";

interface Props {
  modules: Module[];
}

function chipClass(layerId: string, isActive: boolean): string {
  const base =
    "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer select-none active:scale-95";
  if (isActive) {
    const colors =
      layerBadgeColors[layerId] ??
      "bg-slate-500/10 text-slate-400 border-slate-500/20";
    return `${base} ${colors} ring-1 ring-inset ring-white/10`;
  }
  return `${base} bg-surface-elevated text-text-muted border-border-subtle hover:text-text-secondary hover:border-border-default`;
}

export default function ModuleListClient({ modules }: Props) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const grouped: Record<string, Module[]> = {};
  for (const mod of modules) {
    if (!grouped[mod.layer]) grouped[mod.layer] = [];
    grouped[mod.layer].push(mod);
  }

  const displayLayers = activeLayer
    ? allLayers.filter((l) => l.id === activeLayer)
    : allLayers;

  const totalActive = activeLayer
    ? (grouped[activeLayer] || []).length
    : modules.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-2">
          全部模块
        </h1>
        <p className="text-text-body">
          共 {totalActive} 个模块，涵盖传感器、信号处理、特征提取、模式识别与临床决策支持
        </p>
      </div>

      {/* Layer filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveLayer(null)}
          className={(() => {
            const isAllActive = activeLayer === null;
            const base =
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer select-none active:scale-95";
            if (isAllActive) {
              return `${base} bg-white text-black border-white`;
            }
            return `${base} bg-surface-elevated text-text-muted border-border-subtle hover:text-text-secondary hover:border-border-default`;
          })()}
        >
          全部
        </button>
        {allLayers.map((layer) => {
          const count = grouped[layer.id]?.length ?? 0;
          if (count === 0) return null;
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() =>
                setActiveLayer(activeLayer === layer.id ? null : layer.id)
              }
              className={chipClass(layer.id, isActive)}
            >
              {layer.name}
            </button>
          );
        })}
      </div>

      {displayLayers.map((layer) => {
        const layerModules = grouped[layer.id] || [];
        if (layerModules.length === 0) return null;

        return (
          <section key={layer.id}>
            <div className="flex items-baseline gap-3 mb-5">
              <h2 className="font-heading text-xl font-semibold text-text-primary">
                {layer.name}
              </h2>
              <span className="text-sm text-text-muted">
                {layerModules.length} 个模块
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 motion-safe:animate-fade-in">
              {layerModules.map((mod) => (
                <ModuleCard key={mod.id} module={mod} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
