import Link from "next/link";
import type { Module } from "@/data/types";
import { getLayerById } from "@/data/layers";
import { layerBadgeColors } from "@/data/colors";

interface Props {
  module: Module;
}

export default function ModuleCard({ module }: Props) {
  const layer = getLayerById(module.layer);
  const badgeClass =
    layerBadgeColors[module.layer] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20";
  const mainstreamCount = module.implementations.filter(
    (i) => i.type === "mainstream",
  ).length;

  return (
    <Link
      href={`/module/${module.id}`}
      className="block rounded-2xl border border-border-subtle bg-surface-elevated p-6 transition-all duration-200 hover:bg-surface-highlight hover:border-white/10 hover:translate-y-[-2px] hover:shadow-card-hover"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-heading font-semibold text-text-primary line-clamp-1 text-lg">
          {module.name}
        </h3>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
        >
          {module.layer}
        </span>
      </div>

      <p className="line-clamp-2 mt-2 text-sm text-text-body">
        {module.summary}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {mainstreamCount > 0 && (
          <span className="rounded-full bg-layer-4/10 text-layer-4 text-xs px-2 py-0.5">
            {mainstreamCount}个方案
          </span>
        )}
        {module.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-white/5 text-text-muted text-xs px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
