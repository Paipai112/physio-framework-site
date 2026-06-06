"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getGlossaryTermById } from "@/data/glossary";
import Link from "next/link";

interface Props {
  termId: string;
  children: React.ReactNode;
}

export default function GlossaryPopup({ termId, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const ref = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const term = getGlossaryTermById(termId);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    // Check available space above
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition(rect.top < 220 ? "bottom" : "top");
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, close]);

  if (!term) return <>{children}</>;

  const isTop = position === "top";

  return (
    <span className="relative inline">
      <span
        ref={ref}
        className="cursor-help border-b border-dashed border-primary-500/50 text-primary-400"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {children}
      </span>
      {isOpen && (
        <div
          ref={popupRef}
          className={`absolute left-1/2 z-50 w-72 -translate-x-1/2 rounded-lg border border-slate-600 bg-slate-800 p-4 shadow-xl ${
            isTop ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="mb-2">
            <span className="text-sm font-medium text-white">
              {term.term}
            </span>
            <span className="ml-2 rounded bg-slate-700/50 px-2 py-0.5 text-xs text-slate-400">
              {term.category}
            </span>
          </div>
          <p className="mb-3 text-sm text-slate-300">{term.definition}</p>
          <Link
            href={`/glossary/${termId}`}
            className="text-xs text-primary-400 hover:text-primary-300"
            onClick={close}
          >
            查看详情 &rarr;
          </Link>
          <div
            className={`absolute left-1/2 -translate-x-1/2 border-8 border-transparent ${
              isTop
                ? "top-full border-t-slate-600"
                : "bottom-full border-b-slate-600"
            }`}
          />
        </div>
      )}
    </span>
  );
}
