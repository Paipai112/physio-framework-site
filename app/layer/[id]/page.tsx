import Link from "next/link";
import { redirect } from "next/navigation";
import { getLayerById } from "@/data/layers";
import { getModulesByLayer } from "@/data/modules";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ModuleCard from "@/components/ModuleCard";

interface Props {
  params: { id: string };
}

const layerBadgeColors: Record<string, string> = {
  L1: "bg-red-500/10 text-red-400",
  L2: "bg-amber-500/10 text-amber-400",
  L3: "bg-emerald-500/10 text-emerald-400",
  L4: "bg-blue-500/10 text-blue-400",
  L5: "bg-violet-500/10 text-violet-400",
};

export default function LayerDetailPage({ params }: Props) {
  const layer = getLayerById(params.id);

  if (!layer) {
    redirect("/");
  }

  const layerModules = getModulesByLayer(layer.id);
  const badgeClass =
    layerBadgeColors[layer.id] ?? "bg-slate-500/10 text-slate-400";

  // Group modules by tag
  const tagGroups: Record<string, typeof layerModules> = {};
  layerModules.forEach((mod) => {
    mod.tags.forEach((tag) => {
      if (!tagGroups[tag]) tagGroups[tag] = [];
      tagGroups[tag].push(mod);
    });
  });

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: layer.name },
        ]}
      />

      {/* Layer Header */}
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

      {/* Modules Grouped by Tag */}
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

      {/* All Modules (fallback) */}
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

      {/* Layer Navigation */}
      <section className="rounded-xl border border-slate-700/50 bg-slate-800/20 p-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-400">
          切换层级
        </h3>
        <div className="flex flex-wrap gap-3">
          {["L1", "L2", "L3", "L4", "L5"].map((lid) => {
            const l = getLayerById(lid);
            if (!l) return null;
            const isActive = lid === layer.id;
            return (
              <Link
                key={lid}
                href={`/layer/${lid}`}
                className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                  isActive
                    ? "border-primary-500 bg-primary-500/10 text-primary-400"
                    : "border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-white"
                }`}
              >
                {l.icon} {l.name}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
