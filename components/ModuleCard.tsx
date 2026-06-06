import Link from "next/link";
import type { Module } from "@/data/types";
import { getLayerById } from "@/data/layers";
import { layerBorderColors, layerBadgeColors } from "@/data/colors";

interface Props {
  module: Module;
}

export default function ModuleCard({ module }: Props) {
  const layer = getLayerById(module.layer);
  const borderClass =
    layerBorderColors[module.layer] ??
    "border-slate-700/50 hover:border-slate-600";
  const badgeClass =
    layerBadgeColors[module.layer] ?? "bg-slate-500/10 text-slate-400";

  return (
    <Link
      href={`/module/${module.id}`}
      className={`block rounded-lg border bg-slate-800/20 p-5 transition-all hover:bg-slate-800/40 ${borderClass}`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-white hover:text-primary-400 line-clamp-1">
          {module.name}
        </h3>
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${badgeClass}`}
        >
          {module.layer}
        </span>
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-slate-400">
        {module.summary}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {module.implementations.length > 0 && (
          <span className="rounded bg-blue-500/5 px-1.5 py-0.5 text-xs text-blue-400">
            {module.implementations.filter((i) => i.type === "mainstream").length}个方案
          </span>
        )}
        {module.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded bg-slate-700/50 px-1.5 py-0.5 text-xs text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
