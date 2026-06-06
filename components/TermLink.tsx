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
      className="border-b border-dashed border-primary-500/50 text-primary-400 transition-colors hover:border-primary-400 hover:text-primary-300"
      title={term.definition}
    >
      {display ?? term.term}
    </Link>
  );
}
