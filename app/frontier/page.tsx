import Link from "next/link";
import type { Metadata } from "next";
import { frontierItemsByLayer, type FrontierItem } from "@/data/frontier-data";
import { getLayerHex } from "@/data/colors";

export const metadata: Metadata = {
  title: "前沿研究 — 生理信号处理框架",
  description:
    "L1-L5各层级最新最前沿的商业应用与科研成果，覆盖传感器技术、AI算法、数字生物标志物与AI健康教练。",
};

const LAYER_INFO: Record<string, { name: string; description: string }> = {
  L1: { name: "传感器层", description: "新型传感模态、材料科学突破与芯片创新" },
  L2: { name: "基础指标层", description: "信号处理算法、边缘AI与新型生物标志物" },
  L3: { name: "融合指标层", description: "数字生物标志物、大规模验证研究与多模态融合" },
  L4: { name: "高级指标层", description: "厂商专有评分系统、新型健康指标与AI功能" },
  L5: { name: "AI教练层", description: "基础模型、生成式AI与LLM健康教练平台" },
};

function TypeBadge({ type }: { type: "commercial" | "research" }) {
  return (
    <span
      className={
        type === "commercial"
          ? "inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-400"
          : "inline-flex items-center rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-xs font-medium text-violet-400"
      }
    >
      {type === "commercial" ? "商业产品" : "科研成果"}
    </span>
  );
}

export default function FrontierPage() {
  const layerOrder = ["L1", "L2", "L3", "L4", "L5"];

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.03em] text-text-primary">
          前沿研究
        </h1>
        <div className="mx-auto my-6 h-[3px] w-[60px] rounded-full bg-gradient-to-r from-layer-1 via-layer-2 via-layer-3 via-layer-4 to-layer-5" />
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-body">
          追踪最新最前沿的商业应用与科研成果，按五层架构 L1-L5
          组织。涵盖传感器技术、AI/ML突破、数字生物标志物、可穿戴健康创新与AI健康教练。
        </p>
        <p className="mt-3 text-sm text-text-muted">
          点击任意课题卡片查看详细描述、影响分析、应用场景与参考资源
        </p>
      </section>

      {/* Layer-by-layer frontier sections */}
      {layerOrder.map((layerId) => {
        const items = frontierItemsByLayer(layerId);
        if (items.length === 0) return null;
        const info = LAYER_INFO[layerId];
        const hex = getLayerHex(layerId);

        return (
          <section key={layerId}>
            {/* Section header */}
            <div className="mb-6 flex items-center gap-3">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: hex }}
              />
              <span className="font-heading text-2xl font-bold text-text-primary">
                {layerId}
              </span>
              <span className="text-lg font-medium text-text-secondary">
                {info.name}
              </span>
              <span className="text-sm text-text-muted hidden sm:inline">
                · {info.description}
              </span>
            </div>

            {/* Items grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/frontier/${item.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated p-6 transition-all duration-300 hover:border-white/10 hover:bg-surface-highlight cursor-pointer"
                  style={{
                    borderLeftWidth: "2px",
                    borderLeftColor: hex,
                  }}
                >
                  {/* Hover shimmer */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div
                      className="absolute -right-10 -top-10 h-20 w-20 rounded-full blur-2xl"
                      style={{ backgroundColor: hex, opacity: 0.15 }}
                    />
                  </div>

                  <div className="relative z-10">
                    {/* Header row */}
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="font-heading text-base font-semibold text-text-primary leading-snug group-hover:text-blue-400 transition-colors duration-200">
                        {item.title}
                      </h3>
                      <TypeBadge type={item.type} />
                    </div>

                    {/* Summary */}
                    <p className="mb-4 text-sm text-text-body leading-relaxed">
                      {item.summary}
                    </p>

                    {/* Source & year */}
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span className="line-clamp-1">{item.source}</span>
                      <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5">
                        {item.year}
                      </span>
                    </div>

                    {/* Read more indicator */}
                    <div className="mt-3 flex items-center gap-1 text-xs text-blue-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span>查看详情</span>
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* Bottom note */}
      <section className="border-t border-border-subtle pt-10 text-center">
        <p className="text-sm text-text-muted">
          前沿研究页面持续更新。内容来源于学术期刊、企业官方发布与行业报告。
          <br />
          最后更新：2026年6月
        </p>
      </section>
    </div>
  );
}
