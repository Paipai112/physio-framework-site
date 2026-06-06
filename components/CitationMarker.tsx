interface Props {
  citationIds: string[];
}

export default function CitationMarker({ citationIds }: Props) {
  if (!citationIds || citationIds.length === 0) return null;

  return (
    <span className="inline-flex items-center gap-1">
      {citationIds.map((id) => (
        <a
          key={id}
          href={`/references#${id}`}
          className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[11px] text-blue-400 font-medium hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-200 cursor-pointer no-underline"
        >
          [{id.replace("ref-", "")}]
        </a>
      ))}
    </span>
  );
}
