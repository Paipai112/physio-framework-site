import Link from "next/link";
import { getGlossaryTermById } from "@/data/glossary";

interface Props {
  termId: string;
  /** Optional override for the displayed text (otherwise uses term.term) */
  display?: string;
}

export default function TermLink({ termId, display }: Props) {
  const term = getGlossaryTermById(termId);

  if (!term) return <span className="text-slate-500">{termId}</span>;

  return (
    <Link
      href={`/glossary/${termId}`}
      className="rounded-lg text-blue-400 hover:text-blue-300 transition-colors duration-200 border-b border-dashed border-blue-400/50 cursor-help"
      title={term.definition}
    >
      {display ?? term.term}
    </Link>
  );
}
