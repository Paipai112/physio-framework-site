import Link from "next/link";
import { redirect } from "next/navigation";
import { getGlossaryTermById } from "@/data/glossary";
import { getReferencesByIds } from "@/data/references";
import { modules } from "@/data/modules";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ReferenceList from "@/components/ReferenceList";

interface Props {
  params: { id: string };
}

export default function GlossaryDetailPage({ params }: Props) {
  const term = getGlossaryTermById(params.id);

  if (!term) {
    redirect("/glossary");
  }

  const refs = getReferencesByIds(term.references);

  // Find modules that reference this term
  const relatedModules = modules.filter((m) =>
    m.glossaryTerms.includes(term.id)
  );

  return (
    <div className="space-y-8">
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "术语", href: "/glossary" },
          { label: term.term },
        ]}
      />

      {/* Term Header */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-8">
        <h1 className="text-3xl font-bold text-white">{term.term}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-slate-700/50 px-3 py-1 text-xs text-slate-400">
            ID: {term.id}
          </span>
          <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-400">
            {term.category}
          </span>
        </div>
      </div>

      {/* Definition */}
      <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">📖 定义</h2>
        <p className="leading-relaxed text-slate-300">{term.definition}</p>
      </section>

      {/* Related Modules */}
      {relatedModules.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">
            🔗 使用该术语的模块 ({relatedModules.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedModules.map((mod) => (
              <Link
                key={mod.id}
                href={`/module/${mod.id}`}
                className="block rounded-lg border border-slate-700/50 bg-slate-800/20 p-4 transition-colors hover:border-slate-600"
              >
                <div className="text-sm font-medium text-primary-400">
                  {mod.name}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {mod.summary.slice(0, 80)}...
                </div>
                <span className="mt-2 inline-block rounded bg-slate-700/50 px-2 py-0.5 text-xs text-slate-400">
                  {mod.layer}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {refs.length > 0 && (
        <section>
          <ReferenceList references={refs} />
        </section>
      )}

      {refs.length === 0 && (
        <section className="rounded-xl border border-dashed border-slate-700/50 p-6 text-center">
          <p className="text-sm text-slate-500">暂无参考文献</p>
        </section>
      )}

      {/* Back links */}
      <div className="flex gap-4">
        <Link
          href="/glossary"
          className="text-sm text-primary-400 hover:text-primary-300"
        >
          &larr; 返回术语列表
        </Link>
        <Link href="/" className="text-sm text-slate-500 hover:text-white">
          首页
        </Link>
      </div>
    </div>
  );
}
