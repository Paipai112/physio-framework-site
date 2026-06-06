import Link from "next/link";
import { modules } from "@/data/modules";
import { layers } from "@/data/layers";
import type { Module } from "@/data/types";
import { getLayerHex } from "@/data/colors";

/* ---- Bento layout mapping ---- */
const BENTO_LAYOUT: Record<string, string> = {
  L1: "col-span-1 row-span-1 order-1",
  L2: "col-span-1 row-span-1 order-2",
  L3: "col-span-1 row-span-2 order-3",
  L4: "col-span-1 row-span-1 order-4",
  L5: "col-span-1 row-span-1 order-5",
};

const LAYER_BG_GLOW: Record<string, string> = {
  L1: "rgba(255,87,87,0.06)",
  L2: "rgba(255,179,71,0.06)",
  L3: "rgba(74,222,128,0.06)",
  L4: "rgba(96,165,250,0.06)",
  L5: "rgba(192,132,252,0.06)",
};

/* ---- Summary card for each layer ---- */
function LayerBentoCard({
  layerId,
  layerName,
  layerDescription,
  moduleCount,
  modules: layerModules,
  isFeatured,
}: {
  layerId: string;
  layerName: string;
  layerDescription: string;
  moduleCount: number;
  modules: Module[];
  isFeatured: boolean;
}) {
  const hex = getLayerHex(layerId);
  const bgGlow = LAYER_BG_GLOW[layerId] ?? "rgba(115,115,115,0.03)";

  return (
    <Link
      href={`/layer/${layerId}`}
      className={`group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated p-6 transition-all duration-300 hover:-translate-y-[2px] hover:border-white/10 hover:bg-surface-highlight ${BENTO_LAYOUT[layerId]}`}
    >
      {/* Accent top-bar */}
      <div
        className="absolute left-0 right-0 top-0 h-0.5"
        style={{ backgroundColor: hex }}
      />

      {/* Subtle radial glow behind featured card */}
      {isFeatured && (
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-40 blur-3xl"
          style={{ backgroundColor: bgGlow }}
        />
      )}

      <div className="relative z-10 flex h-full flex-col">
        {/* Header row */}
        <div className="mb-3 flex items-center gap-2.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: hex }}
          />
          <span className="font-heading text-2xl font-bold text-text-primary">
            {layerId}
          </span>
          <span className="text-sm font-medium text-text-muted">
            {layerName}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-text-muted leading-relaxed">
          {layerDescription}
        </p>

        {/* Module count */}
        <div className="mt-auto">
          <span
            className="font-heading text-4xl font-bold"
            style={{ color: hex }}
          >
            {moduleCount}
          </span>
          <span className="ml-1.5 text-sm text-text-muted">个模块</span>
        </div>

        {/* Featured: show first 3 module tags */}
        {isFeatured && layerModules.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {layerModules.slice(0, 3).map((mod) => (
              <span
                key={mod.id}
                className="inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                style={{
                  borderColor: hex + "30",
                  color: hex,
                  backgroundColor: hex + "0D",
                }}
              >
                {mod.name}
              </span>
            ))}
            {layerModules.length > 3 && (
              <span className="inline-block rounded-full border border-border-default px-2.5 py-0.5 text-[11px] font-medium text-text-muted">
                +{layerModules.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ---- Stat item helper ---- */
function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-heading text-3xl font-bold text-text-primary">
        {value}
      </div>
      <div className="mt-1 text-sm text-text-muted">{label}</div>
    </div>
  );
}

/* ---- Page ---- */
export default function HomePage() {
  const byLayer: Record<string, Module[]> = {};
  for (const m of modules) {
    if (!byLayer[m.layer]) byLayer[m.layer] = [];
    byLayer[m.layer].push(m);
  }

  const visibleLayers = layers.filter((l) => l.id !== "L0");
  const totalModules = modules.length;
  const totalRefs = (() => {
    const ids = new Set<string>();
    for (const m of modules) {
      for (const r of m.references) ids.add(r);
    }
    return ids.size;
  })();
  const totalGlossary = (() => {
    const ids = new Set<string>();
    for (const m of modules) {
      for (const g of m.glossaryTerms) ids.add(g);
    }
    return ids.size;
  })();

  return (
    <div className="space-y-20">
      {/* ===== Hero ===== */}
      <section className="py-20 text-center">
        <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[-0.03em] text-text-primary">
          系统化生理信号处理
        </h1>

        {/* Gradient accent line */}
        <div className="mx-auto my-8 h-[3px] w-[60px] rounded-full bg-gradient-to-r from-layer-1 via-layer-2 via-layer-3 via-layer-4 to-layer-5" />

        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary">
          从传感器到临床应用，构建完整的技术栈知识体系。
          涵盖信号采集、预处理、特征提取、模式识别与临床决策支持。
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/layer/L1"
            className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-200 hover:bg-white/90"
          >
            探索五层架构
          </Link>
          <Link
            href="/module"
            className="rounded-xl border border-border-default px-6 py-3 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-white/30 hover:text-text-primary"
          >
            查看所有模块
          </Link>
        </div>
      </section>

      {/* ===== Bento Grid ===== */}
      <section className="mx-auto max-w-5xl">
        <div className="grid grid-cols-3 auto-rows-[minmax(180px,auto)] gap-4">
          {visibleLayers.map((layer) => {
            const layerModules = byLayer[layer.id] ?? [];
            const isFeatured = layer.id === "L3";
            return (
              <LayerBentoCard
                key={layer.id}
                layerId={layer.id}
                layerName={layer.name}
                layerDescription={layer.description}
                moduleCount={layerModules.length}
                modules={layerModules}
                isFeatured={isFeatured}
              />
            );
          })}
        </div>
      </section>

      {/* ===== Stats Bar ===== */}
      <section className="flex flex-wrap justify-center gap-8 border-b border-t border-border-subtle py-10">
        <StatItem value={totalModules} label="模块" />
        <StatItem value={totalRefs} label="参考文献" />
        <StatItem value={totalGlossary} label="术语" />
      </section>

      {/* ===== Quick Nav ===== */}
      <section className="text-center">
        <Link
          href="/module"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          浏览全部 {totalModules} 个模块
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </section>
    </div>
  );
}
