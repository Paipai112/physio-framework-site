interface Props {
  citationIds: string[];
}

export default function CitationMarker({ citationIds }: Props) {
  if (!citationIds || citationIds.length === 0) return null;

  return (
    <sup className="text-xs text-primary-400">
      {citationIds.map((id, i) => (
        <span key={id}>
          {i > 0 && ", "}
          <a
            href={`/references#${id}`}
            className="hover:text-primary-300 hover:underline"
          >
            [{id.replace("ref-", "")}]
          </a>
        </span>
      ))}
    </sup>
  );
}
