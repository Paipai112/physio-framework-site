import type { Metadata } from "next";
import Link from "next/link";
import { modules } from "@/data/modules";
import { layers } from "@/data/layers";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ModuleCard from "@/components/ModuleCard";

export const metadata: Metadata = {
  title: "全部模块 - 生理信号处理框架",
  description: "浏览全部98个生理信号处理知识模块，涵盖传感器、信号处理、特征提取、模式识别与临床决策支持",
};

export default function ModuleListPage() {
  const grouped: Record<string, typeof modules> = {};
  for (const mod of modules) {
    if (!grouped[mod.layer]) grouped[mod.layer] = [];
    grouped[mod.layer].push(mod);
  }

  return (
    <div className="space-y-8">
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "全部模块" },
        ]}
      />

      <h1 className="text-3xl font-bold text-white">全部模块</h1>
      <p className="text-slate-400">
        共 {modules.length}{" "}
        个模块，涵盖传感器、信号处理、特征提取、模式识别与临床决策支持
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
                <ModuleCard key={mod.id} module={mod} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
