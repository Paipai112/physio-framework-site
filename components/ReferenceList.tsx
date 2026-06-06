import type { Reference } from "@/data/types";

interface Props {
  references: Reference[];
  title?: string;
}

const TYPE_LABELS: Record<Reference["type"], string> = {
  paper: "论文",
  website: "网站",
  patent: "专利",
  documentation: "文档",
  book: "书籍",
};

function groupByType(refs: Reference[]): Map<Reference["type"], Reference[]> {
  const grouped = new Map<Reference["type"], Reference[]>();

  for (const ref of refs) {
    const list = grouped.get(ref.type);
    if (list) {
      list.push(ref);
    } else {
      grouped.set(ref.type, [ref]);
    }
  }

  return grouped;
}

function ReferenceCard({ reference: r }: { reference: Reference }) {
  const doiLink = r.doi ? `https://doi.org/${r.doi}` : null;

  return (
    <div className="group rounded-2xl border border-border-subtle bg-surface-elevated p-5 hover:bg-surface-highlight hover:border-white/10 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className="group-hover:text-white transition-colors duration-200 font-medium text-text-primary">{r.title}</span>

          {(r.authors || r.year) && (
            <p className="mt-1 text-sm text-text-secondary">
              {r.authors && <span>{r.authors}</span>}
              {r.authors && r.year && <span> &middot; </span>}
              {r.year && <span>{r.year}</span>}
            </p>
          )}

          {r.doi && doiLink && (
            <a
              href={doiLink}
              className="mt-1 inline-block text-sm text-blue-400 hover:text-blue-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {r.doi}
            </a>
          )}

          {r.url && (
            <a
              href={r.url}
              className="mt-1 block text-sm text-blue-400 hover:text-blue-300 transition-colors truncate"
              target="_blank"
              rel="noopener noreferrer"
            >
              {r.url}
            </a>
          )}

          {r.zhSummary && (
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              {r.zhSummary}
            </p>
          )}
        </div>

        <span className="group-hover:bg-white/10 transition-colors duration-200 shrink-0 rounded-full bg-white/5 text-text-muted text-xs px-2 py-0.5 border border-white/5">
          {TYPE_LABELS[r.type]}
        </span>
      </div>
    </div>
  );
}

function TypeSection({
  type,
  refs,
}: {
  type: Reference["type"];
  refs: Reference[];
}) {
  return (
    <div>
      <h3 className="font-heading text-lg font-semibold text-text-primary mb-4">
        {TYPE_LABELS[type]}
      </h3>
      <div className="flex flex-col gap-3">
        {refs.map((ref) => (
          <ReferenceCard key={ref.id} reference={ref} />
        ))}
      </div>
    </div>
  );
}

export default function ReferenceList({
  references,
  title = "参考文献",
}: Props) {
  if (!references || references.length === 0) return null;

  const grouped = groupByType(references);

  return (
    <section>
      <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">
        {title}
      </h2>
      <div className="flex flex-col gap-10">
        {Array.from(grouped.entries()).map(([type, refs]) => (
          <TypeSection key={type} type={type} refs={refs} />
        ))}
      </div>
    </section>
  );
}
