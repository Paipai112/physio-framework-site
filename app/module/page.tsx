import Link from "next/link";
import { modules } from "@/data/modules";
import { layers } from "@/data/layers";

export default function ModuleListPage() {
  // Group by layer
  const grouped: Record<string, typeof modules> = {};
  modules.forEach((mod) => {
    if (!grouped[mod.layer]) grouped[mod.layer] = [];
    grouped[mod.layer].push(mod);
  });

  return (
    <div className="space-y-8">
      <nav className="flex items-center space-x-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-white">
          首页
        </Link>
        <span>/</span>
        <span className="text-white">全部模块</span>
      </nav>

      <h1 className="text-3xl font-bold text-white">📦 全部模块</h1>
      <p className="text-slate-400">
        共 {modules.length} 个模块，涵盖传感器、信号处理、特征提取、模式识别与临床决策支持
      </p>

      {layers.map((layer) => {
        const layerModules = grouped[layer.id] || [];
        if (layerModules.length === 0) return null;

        return (
          <section key={layer.id}>
            <h2 className="mb-4 text-xl font-semibold text-white">
              {layer.icon} {layer.name}
              <span className="ml-2 text-sm text-slate-500">
                ({layerModules.length})
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {layerModules.map((mod) => (
                <Link
                  key={mod.id}
                  href={`/module/${mod.id}`}
                  className="rounded-lg border border-slate-700/50 bg-slate-800/20 p-5 transition-all hover:border-slate-600 hover:bg-slate-800/40"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-white hover:text-primary-400 line-clamp-1">
                      {mod.name}
                    </h3>
                    <span className="shrink-0 rounded bg-slate-700/50 px-2 py-0.5 text-xs text-slate-400">
                      {mod.layer}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-slate-400 line-clamp-2">
                    {mod.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.implementations.length > 0 && (
                      <span className="rounded bg-blue-500/5 px-1.5 py-0.5 text-xs text-blue-400">
                        方案
                      </span>
                    )}
                    {mod.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-slate-700/50 px-1.5 py-0.5 text-xs text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                    {mod.glossaryTerms.length > 0 && (
                      <span className="rounded bg-primary-500/5 px-1.5 py-0.5 text-xs text-primary-400">
                        {mod.glossaryTerms.length}术语
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
