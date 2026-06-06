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

// Characters and patterns that signal a formula segment
const GREEK_LETTERS = "αβγδεζηθικλμνξπρστυφχψωΔΣΩ√";
const MATH_OPERATORS = /sqrt\(|mean\(|std\(|min\(|max\(|log\(|exp\(/;
const DIMENSIONAL_UNITS = /\b(kHz|MHz|GHz|μV|mV|V|mA|μA|nA|kΩ|MΩ|mW|μg|mg|g|kg|mL|W|kg|nm|mm|cm|m|s|ms|μs|hr|min|bpm|Hz|dB)\b/;
const MATH_NOTATION = /[=≈≠±≤≥×·÷∑∫]/;
const MATH_OPERATOR_CHARS = /[+\-*/^(){}[\]]/;

const FORMULA_TOKENS_REGEX = new RegExp(
  `[${GREEK_LETTERS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]|` +
  MATH_OPERATORS.source + "|" +
  DIMENSIONAL_UNITS.source + "|" +
  MATH_NOTATION.source + "|" +
  MATH_OPERATOR_CHARS.source
);

function isFormula(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return FORMULA_TOKENS_REGEX.test(trimmed);
}

/**
 * Given a raw text segment (no citation markers, no terms linked yet),
 * split it into alternating [text, formula, text, formula...] spans.
 * Odd indices are formula spans.
 */
function splitFormulaSegments(text: string): { value: string; isFormula: boolean }[] {
  const segments: { value: string; isFormula: boolean }[] = [];

  // Tokenize on whitespace boundaries while preserving delimiters
  const tokens = text.split(/(\s+)/g);

  let currentText = "";
  let currentIsFormula: boolean | null = null;

  for (const token of tokens) {
    const tokenIsFormula = isFormula(token);

    if (currentIsFormula === null) {
      currentIsFormula = tokenIsFormula;
      currentText = token;
    } else if (tokenIsFormula === currentIsFormula) {
      currentText += token;
    } else {
      // Transition: flush current and start new
      segments.push({ value: currentText, isFormula: currentIsFormula });
      currentIsFormula = tokenIsFormula;
      currentText = token;
    }
  }

  if (currentText) {
    segments.push({ value: currentText, isFormula: currentIsFormula! });
  }

  return segments;
}

const matchList = buildMatches();
const CITATION_RE = /\[(ref-[a-z0-9-]+)\]/g;

/**
 * Determines if a paragraph is a standalone formula (entirely formula content,
 * possibly with some punctuation/spacing). Used to choose block vs inline wrapping.
 */
function isStandaloneFormula(rawText: string): boolean {
  // Strip citation markers and trim
  const cleaned = rawText.replace(CITATION_RE, "").trim();
  if (!cleaned) return false;
  // If every non-space token is a formula segment, treat as standalone
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return false;
  return tokens.every((t) => isFormula(t));
}

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
    <div className="space-y-5 text-text-body leading-relaxed max-w-prose-wide text-[15px]">
      {paragraphs.map((p, i) => {
        const standalone = isStandaloneFormula(p);

        // First, split by citation markers
        const citeSegments = p.split(CITATION_RE);

        // Determine if this paragraph should be wrapped in a formula block
        const Wrapper = standalone
          ? ({ children }: { children: React.ReactNode }) => (
              <span className="formula-block">{children}</span>
            )
          : ({ children }: { children: React.ReactNode }) => <>{children}</>;

        return (
          <p key={i}>
            <Wrapper>
              {citeSegments.map((seg, j) => {
                // Odd indices are citation IDs
                if (j % 2 === 1) {
                  return (
                    <CitationMarker key={j} citationIds={[seg]} />
                  );
                }
                // Even indices are regular text — apply formula splitting + term linking
                if (!termRegex) {
                  // No terms to link — just apply formula detection
                  return splitFormulaSegments(seg).map((fs, k) =>
                    fs.isFormula ? (
                      <span key={k} className="formula">{fs.value}</span>
                    ) : (
                      <span key={k}>{fs.value}</span>
                    )
                  );
                }

                // First split by term matches
                const parts = seg.split(termRegex);

                return parts.map((part, k) => {
                  const found = matchList.find((m) => m.name === part);
                  if (found) {
                    // TermLink — no formula detection inside linked terms
                    return (
                      <TermLink key={`${j}-${k}`} termId={found.id} display={part} />
                    );
                  }
                  // Non-term text — apply formula detection
                  return splitFormulaSegments(part).map((fs, fi) =>
                    fs.isFormula ? (
                      <span key={`${j}-${k}-${fi}`} className="formula">{fs.value}</span>
                    ) : (
                      <span key={`${j}-${k}-${fi}`}>{fs.value}</span>
                    )
                  );
                });
              })}
            </Wrapper>
          </p>
        );
      })}
    </div>
  );
}
