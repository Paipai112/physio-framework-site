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
        className="cursor-help border-b border-dashed border-blue-400/50 text-blue-400 hover:text-blue-300 transition-colors"
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
          className={`animate-scale-in absolute left-1/2 z-50 w-80 -translate-x-1/2 rounded-2xl border border-border-strong bg-surface-elevated/80 shadow-modal p-5 backdrop-blur-xl ${
            isTop ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="flex items-center flex-wrap gap-y-1 mb-2">
            <span className="font-heading font-semibold text-text-primary text-sm">
              {term.term}
            </span>
            <span className="rounded-full bg-white/5 text-text-muted text-xs px-2 py-0.5 ml-2">
              {term.category}
            </span>
          </div>
          <p className="text-text-secondary text-sm mt-2 leading-relaxed">
            {term.definition}
          </p>
          <Link
            href={`/glossary/${termId}`}
            className="text-blue-400 hover:text-blue-300 text-xs mt-3 inline-block transition-colors"
            onClick={close}
          >
            查看详情 &rarr;
          </Link>
          <div
            className={`absolute left-1/2 -translate-x-1/2 border-8 border-transparent ${
              isTop
                ? "top-full border-t-border-strong"
                : "bottom-full border-b-border-strong"
            }`}
          />
        </div>
      )}
    </span>
  );
}
