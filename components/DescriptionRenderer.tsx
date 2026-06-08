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

const FORMULA_TOKENS_REGEX = new RegExp(
  `[${GREEK_LETTERS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]|` +
  MATH_OPERATORS.source + "|" +
  DIMENSIONAL_UNITS.source + "|" +
  MATH_NOTATION.source
);

/**
 * Characters considered "formula-like": Latin letters, digits, Greek,
 * math symbols, brackets, whitespace, dot, comma, underscore.
 */
const FORMULA_CHAR = /[a-zA-Z0-9αβγδεζηθικλμνξπρστυφχψωΔΣΩ√+\-*/^=≈≠±≤≥×·÷∑∫(){}[\].,_\s]/g;

function isFormula(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  // Must contain at least one formula indicator token
  if (!FORMULA_TOKENS_REGEX.test(trimmed)) return false;

  // Require ≥60% formula-like characters to avoid false positives
  // on Chinese text that happens to contain a stray × / ± / = / ≈
  const formulaCount = (trimmed.match(FORMULA_CHAR) || []).length;
  const ratio = formulaCount / trimmed.length;
  // Require ≥6 characters — short tokens like "=", "×", "mm", "Hz)"
  // are almost never standalone formulas worth centering
  if (trimmed.length < 6) return false;

  return ratio >= 0.7;
}

/**
 * Split raw text by whitespace boundaries into alternating formula/non-formula tokens,
 * then merge adjacent tokens of the same type into blocks.
 */
function splitFormulaBlocks(text: string): { value: string; isFormula: boolean }[] {
  const blocks: { value: string; isFormula: boolean }[] = [];
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
      blocks.push({ value: currentText, isFormula: currentIsFormula });
      currentIsFormula = tokenIsFormula;
      currentText = token;
    }
  }

  if (currentText) {
    blocks.push({ value: currentText, isFormula: currentIsFormula! });
  }

  return blocks;
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

  /**
   * Renders text content with term links and citation markers.
   * Pure text helper — no formula detection (formulas are split out before calling this).
   */
  function renderText(text: string, keyPrefix: string): React.ReactNode {
    const citeSegments = text.split(CITATION_RE);

    return citeSegments.map((seg, j) => {
      // Odd indices are citation IDs
      if (j % 2 === 1) {
        return <CitationMarker key={`${keyPrefix}-c-${j}`} citationIds={[seg]} />;
      }

      if (!termRegex) {
        return <span key={`${keyPrefix}-s-${j}`}>{seg}</span>;
      }

      const parts = seg.split(termRegex);
      return parts.map((part, k) => {
        const found = matchList.find((m) => m.name === part);
        if (found) {
          return (
            <TermLink key={`${keyPrefix}-t-${j}-${k}`} termId={found.id} display={part} />
          );
        }
        return <span key={`${keyPrefix}-tx-${j}-${k}`}>{part}</span>;
      });
    });
  }

  return (
    <div className="space-y-4 text-text-body leading-relaxed text-base">
      {paragraphs.map((p, i) => {
        const blocks = splitFormulaBlocks(p);

        // All blocks are text → simple <p>
        if (blocks.every((b) => !b.isFormula)) {
          return <p key={i}>{renderText(p, `p${i}`)}</p>;
        }

        // All blocks are formula → single centered <div>
        if (blocks.every((b) => b.isFormula)) {
          const cleaned = p.replace(CITATION_RE, "").trim();
          return (
            <div key={i} className="formula-block">
              {cleaned}
            </div>
          );
        }

        // Mixed: text blocks → <p>, formula blocks → centered <div>
        return (
          <div key={i} className="space-y-4">
            {blocks.map((block, bi) => {
              if (block.isFormula) {
                return (
                  <div key={`${i}-fb-${bi}`} className="formula-block">
                    {block.value.trim()}
                  </div>
                );
              }
              const trimmed = block.value.trim();
              if (!trimmed) return null;
              return (
                <p key={`${i}-t-${bi}`}>
                  {renderText(block.value, `p${i}b${bi}`)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
