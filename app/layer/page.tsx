import Link from "next/link";
import { layers } from "@/data/layers";
import { modules } from "@/data/modules";

export default function LayerListPage() {
  return (
    <div className="space-y-8">
      <nav className="flex items-center space-x-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-white">
          首页
        </Link>
        <span>/</span>
        <span className="text-white">层级</span>
      </nav>

      <h1 className="text-3xl font-bold text-white">🏗️ 五层架构</h1>
      <p className="text-slate-400">
        从传感器到临床应用，系统化的生理信号处理知识体系
      </p>

      <div className="grid gap-6">
        {layers.filter(l => l.id !== 'L0').map((layer) => {
          const layerModules = modules.filter((m) => m.layer === layer.id);
          return (
            <Link
              key={layer.id}
              href={`/layer/${layer.id}`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 transition-all hover:border-slate-600"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{layer.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-white group-hover:text-primary-400">
                      {layer.name}
                    </h2>
                    <span className="rounded-full bg-slate-700/50 px-2 py-0.5 text-xs text-slate-400">
                      {layer.id}
                    </span>
                    <span className="text-sm text-slate-500">
                      {layerModules.length} 个模块
                    </span>
                  </div>
                  <p className="mt-2 text-slate-400">{layer.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {layerModules.slice(0, 8).map((m) => (
                      <span
                        key={m.id}
                        className="rounded bg-slate-700/30 px-2 py-0.5 text-xs text-slate-400"
                      >
                        {m.name}
                      </span>
                    ))}
                    {layerModules.length > 8 && (
                      <span className="text-xs text-slate-500">
                        +{layerModules.length - 8}...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Vertical Flow Visualization */}
      <section className="rounded-xl border border-slate-700/50 bg-slate-800/20 p-8">
        <h2 className="mb-6 text-center text-lg font-semibold text-white">
          数据流向
        </h2>
        <div className="flex flex-col items-center gap-2">
          {layers.filter(l => l.id !== 'L0').map((layer, i) => (
            <div key={layer.id} className="flex items-center gap-4">
              <div className="w-12 text-center text-2xl">{layer.icon}</div>
              <div
                className={`h-3 flex-1 rounded bg-slate-700`}
                style={{ width: 300 - i * 30 }}
              />
              <div className="w-20 text-right text-xs text-slate-500">
                {layer.name}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
