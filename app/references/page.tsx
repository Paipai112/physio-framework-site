import type { Metadata } from "next";
import { references, getReferencesByType } from "@/data/references";
import type { Reference } from "@/data/types";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "参考文献 - 生理信号处理框架",
  description: "生理信号处理框架参考文献总汇，涵盖学术论文、技术文档、专利和书籍",
};

const typeLabelMap: Record<string, string> = {
  paper: "学术论文",
  book: "书籍/专著",
  patent: "专利",
  website: "网站",
  documentation: "技术文档",
};

function ReferenceCard({ reference: r }: { reference: Reference }) {
  const typeLabel = typeLabelMap[r.type] || r.type;

  const inner = (
    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 hover:bg-surface-highlight hover:border-white/10 transition-all duration-200">
      <div className="font-medium text-text-primary">{r.title}</div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 text-sm text-text-muted">
        {r.authors && <span>{r.authors}</span>}
        {r.year && <span>{r.year}</span>}
        <span className="rounded-full bg-white/5 text-text-muted text-[11px] px-2 py-0.5">
          {typeLabel}
        </span>
      </div>

      {r.zhSummary && (
        <div className="mt-2 text-text-secondary text-sm leading-relaxed">
          {r.zhSummary}
        </div>
      )}
    </div>
  );

  return <div>{inner}</div>;
}

const allTypes = [
  { type: "paper", label: "学术论文" },
  { type: "documentation", label: "技术文档" },
  { type: "website", label: "网站" },
  { type: "patent", label: "专利" },
  { type: "book", label: "书籍/专著" },
] as const;

export default function ReferencesPage() {
  const typeRefs = allTypes.map(({ type, label }) => ({
    type,
    label,
    refs: getReferencesByType(type),
  }));

  return (
    <div className="space-y-10">
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "参考文献" },
        ]}
      />

      <div>
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-2">
          参考文献总汇
        </h1>
        <p className="text-text-secondary mb-8">
          共 {references.length} 篇文献，覆盖传感器技术、信号处理算法、临床应用等多个领域
        </p>

        <div className="flex flex-wrap gap-3">
          {typeRefs.map(({ type, label, refs }) => (
            <a
              key={type}
              href={`#${type}`}
              className="rounded-xl border border-border-subtle bg-surface-elevated px-5 py-3 transition-all duration-200 hover:bg-surface-highlight hover:border-white/10"
            >
              <div className="text-lg font-bold text-text-primary">
                {refs.length}
              </div>
              <div className="text-xs text-text-muted mt-0.5">{label}</div>
            </a>
          ))}
        </div>
      </div>

      {typeRefs.map(({ type, label, refs }) =>
        refs.length > 0 ? (
          <section key={type} id={type}>
            <h2 className="font-heading text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
              {label}
              <span className="text-text-muted text-sm font-normal">
                ({refs.length})
              </span>
            </h2>
            <div className="grid gap-3">
              {refs.map((ref) => (
                <ReferenceCard key={ref.id} reference={ref} />
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}
