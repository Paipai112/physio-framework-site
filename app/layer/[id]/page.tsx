import Link from "next/link";
import { notFound } from "next/navigation";
import { getLayerById, layers } from "@/data/layers";
import { getModulesByLayer } from "@/data/modules";
import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ModuleCard from "@/components/ModuleCard";
import { layerBadgeColors } from "@/data/colors";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return layers.filter((l) => l.id !== "L0").map((l) => ({ id: l.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const layer = getLayerById(params.id);
  if (!layer) return { title: "层级未找到" };
  return {
    title: `${layer.name} - 生理信号处理框架`,
    description: layer.description,
  };
}

export default function LayerDetailPage({ params }: Props) {
  const layer = getLayerById(params.id);

  if (!layer) {
    notFound();
  }

  const layerModules = getModulesByLayer(layer.id);
  const badgeClass =
    layerBadgeColors[layer.id] ?? "bg-slate-500/10 text-slate-400";

  const tagGroups: Record<string, typeof layerModules> = {};
  for (const mod of layerModules) {
    for (const tag of mod.tags) {
      if (!tagGroups[tag]) tagGroups[tag] = [];
      tagGroups[tag].push(mod);
    }
  }

  return (
    <div className="space-y-8">
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "层级", href: "/layer" },
          { label: layer.name },
        ]}
      />

      {/* Layer header card */}
      <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-8">
        <h1 className="font-heading text-3xl font-bold text-text-primary">{layer.name}</h1>
        <p className="mt-3 max-w-3xl text-lg text-text-body">
          {layer.description}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${badgeClass}`}
          >
            {layer.id}
          </span>
          <span className="text-sm text-text-muted">
            {layerModules.length} 个模块
          </span>
        </div>
      </div>

      {Object.entries(tagGroups).map(([tag, tagModules]) => (
        <section key={tag}>
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">
            <span className="inline-block rounded-lg bg-white/5 px-3 py-1 text-sm text-text-secondary">
              {tag}
            </span>
            <span className="ml-2 text-sm text-text-muted">
              ({tagModules.length})
            </span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tagModules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} />
            ))}
          </div>
        </section>
      ))}

      {Object.keys(tagGroups).length === 0 && layerModules.length > 0 && (
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {layerModules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} />
            ))}
          </div>
        </section>
      )}

      {layerModules.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border-subtle p-16 text-center text-text-muted italic">
          <p>该层级暂无模块</p>
        </div>
      )}
    </div>
  );
}
