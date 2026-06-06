import type { Metadata } from "next";
import Link from "next/link";
import { layers } from "@/data/layers";
import { modules } from "@/data/modules";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "五层架构 - 生理信号处理框架",
  description:
    "从传感器到临床应用的五层系统化架构：传感器层、基础指标层、融合指标层、高级指标层、AI教练层",
};

export default function LayerListPage() {
  return (
    <div className="space-y-8">
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "层级" },
        ]}
      />

      <h1 className="text-3xl font-bold text-white">五层架构</h1>
      <p className="text-slate-400">
        从传感器到临床应用，系统化的生理信号处理知识体系
      </p>

      <div className="grid gap-6">
        {layers
          .filter((l) => l.id !== "L0")
          .map((layer) => {
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
                    <p className="mt-2 text-slate-400">
                      {layer.description}
                    </p>
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
    </div>
  );
}
