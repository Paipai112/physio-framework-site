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
    <div className="space-y-8">
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "术语词典" },
        ]}
      />

      <h1 className="text-3xl font-bold text-white">术语词典</h1>
      <p className="text-slate-400">
        共 {glossaryTerms.length} 个专业术语
      </p>

      <div className="flex flex-wrap gap-2">
        {glossaryTerms.map((term) => (
          <Link
            key={term.id}
            href={`/glossary/${term.id}`}
            className="rounded-lg border border-slate-700/50 bg-slate-800/20 px-3 py-1.5 text-sm text-slate-300 transition-all hover:border-slate-500 hover:text-white"
          >
            {term.term}
          </Link>
        ))}
      </div>

      {Object.entries(grouped).map(([category, terms]) => (
        <section key={category}>
          <h2 className="mb-4 text-xl font-semibold text-white">
            {categoryIcons[category] ?? "📂"} {category}
            <span className="ml-2 text-sm text-slate-500">
              ({terms.length})
            </span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {terms.map((term) => (
              <Link
                key={term.id}
                href={`/glossary/${term.id}`}
                className="block rounded-lg border border-slate-700/50 bg-slate-800/20 p-4 transition-colors hover:border-slate-600"
              >
                <div className="font-medium text-primary-400">
                  {term.term}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
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
