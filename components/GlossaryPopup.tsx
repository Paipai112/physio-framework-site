"use client";

import { useState, useRef, useEffect } from "react";
import { getGlossaryTermById } from "@/data/glossary";
import Link from "next/link";

interface Props {
  termId: string;
  children: React.ReactNode;
}

export default function GlossaryPopup({ termId, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const term = getGlossaryTermById(termId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!term) return <>{children}</>;

  return (
    <span className="relative inline">
      <span
        ref={ref}
        className="cursor-help border-b border-dashed border-primary-500/50 text-primary-400"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setIsOpen(!isOpen);
        }}
      >
        {children}
      </span>
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 transform rounded-lg border border-slate-600 bg-slate-800 p-4 shadow-xl"
        >
          <div className="mb-2">
            <span className="text-sm font-medium text-white">{term.term}</span>
            <span className="ml-2 rounded bg-slate-700/50 px-2 py-0.5 text-xs text-slate-400">
              {term.category}
            </span>
          </div>
          <p className="mb-3 text-sm text-slate-300">{term.definition}</p>
          <Link
            href={`/glossary/${termId}`}
            className="text-xs text-primary-400 hover:text-primary-300"
            onClick={() => setIsOpen(false)}
          >
            查看详情 &rarr;
          </Link>
          {/* Arrow */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-slate-600" />
        </div>
      )}
    </span>
  );
}
