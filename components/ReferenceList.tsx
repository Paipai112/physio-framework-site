import type { Reference } from "@/data/types";

interface Props {
  references: Reference[];
  title?: string;
}

export default function ReferenceList({
  references,
  title = "参考文献",
}: Props) {
  if (!references || references.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>
      <ul className="space-y-2">
        {references.map((ref) => (
          <li key={ref.id} className="text-sm text-slate-400">
            [{ref.id}]{" "}
            {ref.authors && <span>{ref.authors}. </span>}
            <span className="italic">{ref.title}</span>
            {ref.year && <span> ({ref.year})</span>}
            {ref.doi && (
              <span>
                {" "}
                DOI:{" "}
                <a
                  href={`https://doi.org/${ref.doi}`}
                  className="text-primary-400 hover:text-primary-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ref.doi}
                </a>
              </span>
            )}
            {ref.url && (
              <div className="mt-0.5">
                <a
                  href={ref.url}
                  className="text-primary-400 hover:text-primary-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ref.url}
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
