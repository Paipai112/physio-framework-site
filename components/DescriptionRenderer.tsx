"use client";

import { glossaryTerms } from "@/data/glossary";
import TermLink from "./TermLink";

interface MatchEntry {
  id: string;
  names: string[];
}

/** Build a flat list of (name, termId) sorted by name length descending */
function buildMatches(): { name: string; id: string }[] {
  const matches: { name: string; id: string }[] = [];
  for (const t of glossaryTerms) {
    const names = t.term.split("/").map((s) => s.trim());
    for (const n of names) {
      if (n.length > 0) {
        matches.push({ name: n, id: t.id });
      }
    }
  }
  matches.sort((a, b) => b.name.length - a.name.length);
  return matches;
}

const matchList = buildMatches();

/** Escape regex special characters */
function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function DescriptionRenderer({
  paragraphs,
}: {
  paragraphs: string[];
}) {
  const pattern = matchList.map((m) => esc(m.name)).join("|");
  const regex = new RegExp(`(${pattern})`, "g");

  return (
    <div className="space-y-4 text-slate-300 leading-relaxed">
      {paragraphs.map((p, i) => {
        const parts = p.split(regex);
        return (
          <p key={i}>
            {parts.map((part, j) => {
              const found = matchList.find((m) => m.name === part);
              if (found) {
                return <TermLink key={j} termId={found.id} display={part} />;
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}
