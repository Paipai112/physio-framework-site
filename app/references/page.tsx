import type { Metadata } from "next";
import Link from "next/link";
import { references, getReferencesByType } from "@/data/references";
import type { Reference } from "@/data/types";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "参考文献 - 生理信号处理框架",
  description: "生理信号处理框架参考文献总汇，涵盖学术论文、技术文档、专利和书籍",
};

function getUrl(ref: Reference): string | null {
  if (ref.url) return ref.url;
  if (ref.doi) return `https://doi.org/${ref.doi}`;
  return null;
}

const badgeColors: Record<string, string> = {
  paper: "bg-blue-500/10 text-blue-400",
  book: "bg-violet-500/10 text-violet-400",
  patent: "bg-amber-500/10 text-amber-400",
  website: "bg-emerald-500/10 text-emerald-400",
  documentation: "bg-slate-500/10 text-slate-400",
};

function ReferenceCard({
  reference: r,
  typeLabel,
}: {
  reference: Reference;
  typeLabel: string;
}) {
  const url = getUrl(r);

  const content = (
    <div
      className={`rounded-lg border border-slate-700/50 bg-slate-800/20 p-4 transition-all ${
        url
          ? "cursor-pointer hover:border-primary-500/50 hover:bg-slate-800/40"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 rounded bg-slate-700/50 px-1.5 py-0.5 font-mono text-xs text-slate-500">
          {r.id.replace("ref-", "")}
        </span>
        <div className="min-w-0 flex-1">
          {r.authors && (
            <div className="text-sm text-slate-400">{r.authors}</div>
          )}
          <div className="font-medium text-slate-200">{r.title}</div>
          {r.zhSummary && (
            <div className="mt-1 text-sm italic text-slate-500">
              {r.zhSummary}
            </div>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {r.year && <span>({r.year})</span>}
            <span
              className={`rounded px-1.5 py-0.5 text-xs ${badgeColors[r.type] || "bg-slate-500/10 text-slate-400"}`}
            >
              {typeLabel}
            </span>
          </div>
          {!url && r.doi && (
            <div className="mt-1">
              <a
                href={`https://doi.org/${r.doi}`}
                className="text-xs text-primary-400 hover:text-primary-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                DOI: {r.doi}
              </a>
            </div>
          )}
          {!url && r.url && (
            <div className="mt-1">
              <a
                href={r.url}
                className="text-xs text-primary-400 hover:text-primary-300 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {r.url.length > 50 ? r.url.slice(0, 50) + "..." : r.url}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}

const allTypes = [
  { type: "paper", label: "学术论文", icon: "📄" },
  { type: "documentation", label: "技术文档", icon: "📋" },
  { type: "website", label: "网站", icon: "🌐" },
  { type: "patent", label: "专利", icon: "📜" },
  { type: "book", label: "书籍/专著", icon: "📚" },
] as const;

export default function ReferencesPage() {
  const typeRefs = allTypes.map(({ type, label, icon }) => ({
    type,
    label,
    icon,
    refs: getReferencesByType(type),
  }));

  return (
    <div className="space-y-8">
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "参考文献" },
        ]}
      />

      <h1 className="text-3xl font-bold text-white">参考文献总汇</h1>
      <p className="text-slate-400">
        共 {references.length}{" "}
        篇文献，覆盖传感器技术、信号处理算法、临床应用等多个领域
      </p>

      <div className="grid gap-4 sm:grid-cols-5">
        {typeRefs.map(({ type, label, refs, icon }) => (
          <a
            key={type}
            href={`#${type}`}
            className="rounded-lg border border-slate-700/50 bg-slate-800/20 p-4 text-center transition-all hover:border-slate-600"
          >
            <div className="text-2xl">{icon}</div>
            <div className="mt-1 text-lg font-bold text-white">
              {refs.length}
            </div>
            <div className="text-xs text-slate-400">{label}</div>
          </a>
        ))}
      </div>

      {typeRefs.map(({ type, label, refs, icon }) =>
        refs.length > 0 ? (
          <section key={type} id={type}>
            <h2 className="mb-4 text-xl font-semibold text-white">
              {icon} {label}
              <span className="ml-2 text-base text-slate-500">
                ({refs.length})
              </span>
            </h2>
            <ul className="space-y-3">
              {refs.map((ref) => (
                <li key={ref.id} id={ref.id}>
                  <ReferenceCard reference={ref} typeLabel={label} />
                </li>
              ))}
            </ul>
          </section>
        ) : null
      )}
    </div>
  );
}
