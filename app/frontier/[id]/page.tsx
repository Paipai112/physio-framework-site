import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  frontierItems,
  getFrontierItemById,
  type FrontierItem,
} from "@/data/frontier-data";
import { getLayerHex } from "@/data/colors";
import BreadcrumbNav from "@/components/BreadcrumbNav";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return frontierItems.map((item) => ({ id: item.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const item = getFrontierItemById(decodeURIComponent(params.id));
  if (!item) return { title: "前沿课题未找到" };
  return {
    title: `${item.title} — 前沿研究 — 生理信号处理框架`,
    description: item.summary,
  };
}

const LAYER_NAMES: Record<string, string> = {
  L1: "传感器层",
  L2: "基础指标层",
  L3: "融合指标层",
  L4: "高级指标层",
  L5: "AI教练层",
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

function SectionDivider() {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="h-px flex-1 bg-border-subtle" />
      <span className="text-xs text-text-muted font-mono">· · ·</span>
      <div className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}

export default function FrontierDetailPage({ params }: Props) {
  const itemId = decodeURIComponent(params.id);
  const item = getFrontierItemById(itemId);

  if (!item) {
    notFound();
  }

  const layerHex = getLayerHex(item.layer);
  const descParagraphs = item.description.split("\n\n").filter(Boolean);
  const layerName = LAYER_NAMES[item.layer] ?? item.layer;

  // Prev/next navigation
  const currentIdx = frontierItems.findIndex((i) => i.id === item.id);
  const prevItem = currentIdx > 0 ? frontierItems[currentIdx - 1] : null;
  const nextItem =
    currentIdx < frontierItems.length - 1
      ? frontierItems[currentIdx + 1]
      : null;

  return (
    <div className="space-y-8">
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "前沿研究", href: "/frontier" },
          { label: item.title },
        ]}
      />

      {/* ───────── Header ───────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated p-8 border-l-2"
        style={{ borderLeftColor: layerHex }}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: layerHex }}
        />
        <div className="relative z-10">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-bold text-text-primary">
              {item.title}
            </h1>
            <TypeBadge type={item.type} />
            <span
              className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
              style={{
                borderColor: layerHex + "40",
                color: layerHex,
                backgroundColor: layerHex + "15",
              }}
            >
              {item.layer} · {layerName}
            </span>
          </div>
          <p className="text-lg text-text-body">{item.summary}</p>
        </div>
      </div>

      {/* Source & Year metadata */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
        <span className="flex items-center gap-1.5">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          {item.source}
        </span>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs">
          {item.year}
        </span>
      </div>

      {/* ───────── 01 课题详述 ───────── */}
      <section
        className="rounded-2xl border border-border-subtle bg-surface-elevated border-l-2 p-6 pl-5"
        style={{ borderLeftColor: layerHex }}
      >
        <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
          <span className="mr-2 text-xs font-mono text-text-muted">01</span>
          课题详述
        </h2>
        <div className="space-y-4 text-text-body leading-relaxed">
          {descParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ───────── 02 影响分析 ───────── */}
      <section
        className="rounded-2xl border border-border-subtle bg-surface-elevated border-l-2 p-6 pl-5"
        style={{ borderLeftColor: layerHex }}
      >
        <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
          <span className="mr-2 text-xs font-mono text-text-muted">02</span>
          影响分析
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-border-subtle bg-surface-highlight p-5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <svg
                className="h-4 w-4 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                />
              </svg>
              技术影响
            </h3>
            <p className="text-sm text-text-body leading-relaxed">
              {item.impact.technology}
            </p>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface-highlight p-5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <svg
                className="h-4 w-4 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                />
              </svg>
              产品影响
            </h3>
            <p className="text-sm text-text-body leading-relaxed">
              {item.impact.product}
            </p>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface-highlight p-5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <svg
                className="h-4 w-4 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                />
              </svg>
              行业影响
            </h3>
            <p className="text-sm text-text-body leading-relaxed">
              {item.impact.industry}
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ───────── 03 应用场景 ───────── */}
      <section
        className="rounded-2xl border border-border-subtle bg-surface-elevated border-l-2 p-6 pl-5"
        style={{ borderLeftColor: layerHex }}
      >
        <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
          <span className="mr-2 text-xs font-mono text-text-muted">03</span>
          可能的应用场景
        </h2>
        <div className="grid gap-3">
          {item.applications.map((app, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-highlight p-4 transition-colors duration-200 hover:border-white/10"
            >
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                style={{
                  backgroundColor: layerHex + "20",
                  color: layerHex,
                }}
              >
                {idx + 1}
              </span>
              <p className="text-sm text-text-body leading-relaxed pt-0.5">
                {app}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ───────── 04 参考资源 ───────── */}
      <section className="rounded-2xl border border-border-subtle bg-surface-elevated p-6">
        <div
          className="absolute inset-x-0 top-0 h-px opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${layerHex}, transparent)`,
          }}
        />
        <h2 className="mb-2 font-heading text-xl font-semibold text-text-primary">
          <span className="mr-2 text-xs font-mono text-text-muted">04</span>
          参考资源
        </h2>
        <p className="mb-5 text-sm text-text-muted">
          以下为该课题相关的关键参考文献、产品页面和外部资源链接，点击即可跳转访问。
        </p>

        <div className="grid gap-2">
          {item.references.map((ref, idx) => {
            const typeLabel =
              ref.type === "paper"
                ? "论文"
                : ref.type === "product"
                  ? "产品"
                  : ref.type === "article"
                    ? "文章"
                    : ref.type === "video"
                      ? "视频"
                      : "网站";

            const typeColor =
              ref.type === "paper"
                ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                : ref.type === "product"
                  ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                  : ref.type === "article"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : ref.type === "video"
                      ? "text-red-400 bg-red-500/10 border-red-500/20"
                      : "text-text-muted bg-white/5 border-white/10";

            return (
              <a
                key={idx}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-highlight p-4 transition-all duration-200 hover:border-white/10 hover:bg-surface-elevated"
              >
                {/* External link icon */}
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-text-muted group-hover:text-text-secondary transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                      {ref.title}
                    </span>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${typeColor}`}
                    >
                      {typeLabel}
                    </span>
                  </div>
                  {ref.description && (
                    <p className="text-xs text-text-muted leading-relaxed">
                      {ref.description}
                    </p>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ───────── Prev / Next Navigation ───────── */}
      <nav
        className="mt-8 flex items-center justify-between border-t border-border-subtle pt-6"
        aria-label="前沿课题导航"
      >
        <div>
          {prevItem && (
            <Link
              href={`/frontier/${prevItem.id}`}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              &larr; {prevItem.title}
            </Link>
          )}
        </div>
        <Link
          href="/frontier"
          className="text-sm text-text-muted hover:text-text-secondary"
        >
          返回前沿研究
        </Link>
        <div>
          {nextItem && (
            <Link
              href={`/frontier/${nextItem.id}`}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {nextItem.title} &rarr;
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
