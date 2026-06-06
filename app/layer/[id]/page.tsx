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

      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-8">
        <div className="mb-4 text-6xl">{layer.icon}</div>
        <h1 className="text-3xl font-bold text-white">{layer.name}</h1>
        <p className="mt-2 max-w-3xl text-lg text-slate-400">
          {layer.description}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}
          >
            {layer.id}
          </span>
          <span className="text-sm text-slate-500">
            {layerModules.length} 个模块
          </span>
        </div>
      </div>

      {Object.entries(tagGroups).map(([tag, tagModules]) => (
        <section key={tag}>
          <h2 className="mb-4 text-xl font-semibold text-white">
            <span className="rounded bg-slate-700/50 px-2 py-0.5 text-base">
              {tag}
            </span>
            <span className="ml-2 text-sm text-slate-500">
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
        <div className="rounded-xl border border-dashed border-slate-700/50 p-12 text-center">
          <p className="text-slate-500">该层级暂无模块</p>
        </div>
      )}
    </div>
  );
}
