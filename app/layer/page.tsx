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

const layerAccentMap: Record<string, string> = {
  red: "border-t-layer-1",
  amber: "border-t-layer-2",
  emerald: "border-t-layer-3",
  blue: "border-t-layer-4",
  violet: "border-t-layer-5",
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

      <div>
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-2">
          五层架构
        </h1>
        <p className="text-text-secondary mb-8">
          从传感器到临床应用，系统化的生理信号处理知识体系
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {layers
          .filter((l) => l.id !== "L0")
          .map((layer) => {
            const layerModules = modules.filter((m) => m.layer === layer.id);
            const accentClass = layerAccentMap[layer.color] ?? "border-t-border-subtle";

            return (
              <Link
                key={layer.id}
                href={`/layer/${layer.id}`}
                className={`rounded-2xl border border-border-subtle bg-surface-elevated p-6 hover:bg-surface-highlight hover:border-white/10 transition-all duration-300 hover:translate-y-[-2px] cursor-pointer border-t-2 ${accentClass} flex flex-col`}
              >
                <span className="text-4xl mb-4">{layer.icon}</span>
                <h2 className="font-heading text-xl font-semibold text-text-primary">
                  {layer.name}
                </h2>
                <p className="text-text-muted text-sm mt-2 line-clamp-2 flex-1">
                  {layer.description}
                </p>
                <span className="text-sm text-text-muted mt-4">
                  {layerModules.length} 个模块
                </span>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
