import Link from "next/link";
import { references, getReferencesByType } from "@/data/references";
import { Reference } from "@/data/types";

function getUrl(ref: Reference): string | null {
  if (ref.url) return ref.url;
  if (ref.doi) return `https://doi.org/${ref.doi}`;
  return null;
}

function ReferenceCard({ reference, typeLabel }: { reference: Reference; typeLabel: string }) {
  const url = getUrl(reference);
  const isClickable = url !== null;

  // Type badge color
  const r = reference;
  const badgeColors: Record<string, string> = {
    paper: "bg-blue-500/10 text-blue-400",
    book: "bg-violet-500/10 text-violet-400",
    patent: "bg-amber-500/10 text-amber-400",
    website: "bg-emerald-500/10 text-emerald-400",
    documentation: "bg-slate-500/10 text-slate-400",
  };

  const content = (
    <div
      className={`rounded-lg border border-slate-700/50 bg-slate-800/20 p-4 transition-all ${
        isClickable
          ? "cursor-pointer hover:border-primary-500/50 hover:bg-slate-800/40 hover:shadow-lg hover:shadow-primary-500/5"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 rounded bg-slate-700/50 px-1.5 py-0.5 text-xs font-mono text-slate-500">
          {r.id.replace("ref-", "")}
        </span>
        <div className="min-w-0 flex-1">
          {r.authors && (
            <div className="text-sm text-slate-400">
              {r.authors}
            </div>
          )}
          <div className="font-medium text-slate-200">
            {r.title}
          </div>
          {r.zhSummary && (
            <div className="mt-1 text-sm text-slate-500 italic">
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
          {!isClickable && r.doi && (
            <div className="mt-1 flex flex-wrap gap-3">
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
          {!isClickable && r.url && (
            <div className="mt-1">
              <a
                href={r.url}
                className="text-xs text-primary-400 hover:text-primary-300 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 {r.url.length > 50 ? r.url.slice(0, 50) + "..." : r.url}
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

export default function ReferencesPage() {
  const paperRefs = getReferencesByType("paper");
  const docRefs = getReferencesByType("documentation");
  const websiteRefs = getReferencesByType("website");
  const patentRefs = getReferencesByType("patent");
  const bookRefs = getReferencesByType("book");

  const allTypes = [
    { type: "paper", label: "学术论文", refs: paperRefs, icon: "📄" },
    { type: "documentation", label: "技术文档", refs: docRefs, icon: "📋" },
    { type: "website", label: "网站", refs: websiteRefs, icon: "🌐" },
    { type: "patent", label: "专利", refs: patentRefs, icon: "📜" },
    { type: "book", label: "书籍/专著", refs: bookRefs, icon: "📚" },
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-white">
          首页
        </Link>
        <span>/</span>
        <span className="text-white">参考文献</span>
      </nav>

      <h1 className="text-3xl font-bold text-white">📚 参考文献总汇</h1>
      <p className="text-slate-400">
        共 {references.length} 篇文献，覆盖传感器技术、信号处理算法、临床应用等多个领域
      </p>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-5">
        {allTypes.map(({ type, label, refs, icon }) => (
          <a
            key={type}
            href={`#${type}`}
            className="rounded-lg border border-slate-700/50 bg-slate-800/20 p-4 text-center transition-all hover:border-slate-600"
          >
            <div className="text-2xl">{icon}</div>
            <div className="mt-1 text-lg font-bold text-white">{refs.length}</div>
            <div className="text-xs text-slate-400">{label}</div>
          </a>
        ))}
      </div>

      {/* Reference Lists by Type */}
      {allTypes.map(({ type, label, refs, icon }) =>
        refs.length > 0 ? (
          <section key={type} id={type}>
            <h2 className="mb-4 text-xl font-semibold text-white">
              {icon} {label}
              <span className="ml-2 text-base text-slate-500">({refs.length})</span>
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
