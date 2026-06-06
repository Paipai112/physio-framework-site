"use client";

import { useMemo } from "react";
import { glossaryTerms } from "@/data/glossary";
import TermLink from "./TermLink";
import CitationMarker from "./CitationMarker";

interface MatchEntry {
  id: string;
  names: string[];
}

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

function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const matchList = buildMatches();
const CITATION_RE = /\[(ref-[a-z0-9-]+)\]/g;

export default function DescriptionRenderer({
  paragraphs,
}: {
  paragraphs: string[];
}) {
  const pattern = useMemo(
    () => matchList.map((m) => esc(m.name)).join("|"),
    []
  );
  const termRegex = useMemo(
    () => (pattern ? new RegExp(`(${pattern})`, "g") : null),
    [pattern]
  );

  return (
    <div className="space-y-5 text-text-secondary leading-relaxed max-w-prose text-[15px]">
      {paragraphs.map((p, i) => {
        // First, split by citation markers
        const citeSegments = p.split(CITATION_RE);

        return (
          <p key={i}>
            {citeSegments.map((seg, j) => {
              // Odd indices are citation IDs
              if (j % 2 === 1) {
                return (
                  <CitationMarker key={j} citationIds={[seg]} />
                );
              }
              // Even indices are regular text — apply term linking
              if (!termRegex) return <span key={j}>{seg}</span>;
              const parts = seg.split(termRegex);
              return parts.map((part, k) => {
                const found = matchList.find((m) => m.name === part);
                if (found) {
                  return (
                    <TermLink key={`${j}-${k}`} termId={found.id} display={part} />
                  );
                }
                return <span key={`${j}-${k}`}>{part}</span>;
              });
            })}
          </p>
        );
      })}
    </div>
  );
}
