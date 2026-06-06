import type { Metadata } from "next";
import Link from "next/link";
import { glossaryTerms } from "@/data/glossary";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "术语词典 - 生理信号处理框架",
  description: "生理信号处理领域专业术语词典，涵盖心血管、光学、电生理、睡眠、训练等类别",
};

const categoryIcons: Record<string, string> = {
  心血管: "❤️",
  光学: "💡",
  电生理: "⚡",
  睡眠: "😴",
  训练: "🏋️",
  能量: "🔥",
  自主神经: "🧠",
  深度学习: "🤖",
  机器学习: "📊",
  应激生理: "⚠️",
  综合: "📋",
  信号处理: "📈",
  微电子: "🔬",
  体成分: "⚖️",
  心肺: "🫁",
  生理节律: "🕐",
  单位: "📏",
};

export default function GlossaryListPage() {
  const grouped: Record<string, typeof glossaryTerms> = {};
  for (const term of glossaryTerms) {
    if (!grouped[term.category]) grouped[term.category] = [];
    grouped[term.category].push(term);
  }

  return (
    <div className="space-y-10">
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "术语词典" },
        ]}
      />

      <div>
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-2">
          术语词典
        </h1>
        <p className="text-text-secondary mb-8">
          共收录 {glossaryTerms.length} 个生理信号处理领域专业术语，按类别分组展示
        </p>

        <div className="flex flex-wrap gap-2">
          {glossaryTerms.map((term) => (
            <Link
              key={term.id}
              href={`/glossary/${term.id}`}
              className="rounded-lg border border-border-subtle bg-surface-elevated px-3 py-1.5 text-sm text-text-secondary transition-all hover:border-white/20 hover:text-text-primary hover:bg-surface-highlight"
            >
              {term.term}
            </Link>
          ))}
        </div>
      </div>

      {Object.entries(grouped).map(([category, terms]) => (
        <section key={category}>
          <h2 className="font-heading text-lg font-semibold text-text-primary mb-3">
            {categoryIcons[category] ?? "📂"} {category}
            <span className="ml-2 text-sm font-normal text-text-muted">
              ({terms.length})
            </span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {terms.map((term) => (
              <Link
                key={term.id}
                href={`/glossary/${term.id}`}
                className="rounded-xl border border-border-subtle bg-surface-elevated p-4 hover:bg-surface-highlight hover:border-white/10 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-blue-400 font-medium">
                    {term.term}
                  </span>
                  <span className="rounded-full bg-white/5 text-text-muted text-[11px] px-2 py-0.5">
                    {term.category}
                  </span>
                </div>
                <p className="text-text-secondary text-sm mt-1 line-clamp-1">
                  {term.definition}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
