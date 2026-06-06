import Link from "next/link";
import { notFound } from "next/navigation";
import { getGlossaryTermById, glossaryTerms } from "@/data/glossary";
import { getReferencesByIds } from "@/data/references";
import { modules } from "@/data/modules";
import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ReferenceList from "@/components/ReferenceList";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return glossaryTerms.map((t) => ({ id: t.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const term = getGlossaryTermById(params.id);
  if (!term) return { title: "术语未找到" };
  return {
    title: `${term.term} - 生理信号处理框架`,
    description: term.definition.slice(0, 160),
  };
}

const LAYER_COLORS: Record<string, string> = {
  L1: "bg-layer-1/10 text-layer-1 border-layer-1/20",
  L2: "bg-layer-2/10 text-layer-2 border-layer-2/20",
  L3: "bg-layer-3/10 text-layer-3 border-layer-3/20",
  L4: "bg-layer-4/10 text-layer-4 border-layer-4/20",
  L5: "bg-layer-5/10 text-layer-5 border-layer-5/20",
};

export default function GlossaryDetailPage({ params }: Props) {
  const term = getGlossaryTermById(params.id);

  if (!term) {
    notFound();
  }

  const refs = getReferencesByIds(term.references);

  const relatedModules = modules.filter((m) =>
    m.glossaryTerms.includes(term.id)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "术语", href: "/glossary" },
          { label: term.term },
        ]}
      />

      {/* Term Header Card */}
      <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-8">
        <h1 className="font-heading text-3xl font-bold text-text-primary">
          {term.term}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="inline-block rounded-full bg-white/5 text-text-muted text-sm px-3 py-1 border border-white/5">
            {term.category}
          </span>
          <span className="text-xs text-text-muted font-mono">
            {term.id}
          </span>
        </div>
      </div>

      {/* Definition Section */}
      <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-6">
        <h2 className="font-heading text-lg font-semibold text-text-primary mb-3">
          定义
        </h2>
        <p className="text-text-secondary leading-relaxed text-[15px]">
          {term.definition}
        </p>
      </div>

      {/* Related Modules */}
      {relatedModules.length > 0 && (
        <section>
          <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">
            使用该术语的模块
            <span className="ml-2 text-sm font-normal text-text-muted">
              ({relatedModules.length})
            </span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedModules.map((mod) => {
              const layerColor =
                LAYER_COLORS[mod.layer] ??
                "bg-white/5 text-text-muted border-white/5";

              return (
                <Link
                  key={mod.id}
                  href={`/module/${mod.id}`}
                  className="block rounded-2xl border border-border-subtle bg-surface-elevated p-5 hover:bg-surface-highlight hover:border-white/10 transition-all duration-200 group"
                >
                  <h3 className="font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                    {mod.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-text-muted leading-relaxed line-clamp-2">
                    {mod.summary}
                  </p>
                  <span
                    className={`mt-3 inline-block rounded-full text-xs px-2.5 py-0.5 border ${layerColor}`}
                  >
                    {mod.layer}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* References */}
      {refs.length > 0 && <ReferenceList references={refs} />}

      {refs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border-subtle bg-surface-elevated/50 p-8 text-center">
          <p className="text-sm text-text-muted">暂无参考文献</p>
        </div>
      )}

      {/* Back link */}
      <div className="flex gap-4 pt-2">
        <Link
          href="/glossary"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          &larr; 返回术语列表
        </Link>
        <Link
          href="/"
          className="text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          首页
        </Link>
      </div>
    </div>
  );
}
