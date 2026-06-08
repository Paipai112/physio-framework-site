"use client";

import { useState } from "react";
import type { Implementation } from "@/data/types";

interface Props {
  implementations: Implementation[];
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="mt-0.5 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M3 8.5L6.5 12L13 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-400"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="mt-0.5 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M4 8H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-red-400"
      />
    </svg>
  );
}

export default function ImplementationTabs({ implementations }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!implementations || implementations.length === 0) {
    return (
      <p className="text-sm italic text-text-muted">暂无实现方案</p>
    );
  }

  const active = implementations[activeIndex];

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-2xl bg-surface-elevated border border-border-subtle p-1">
        {implementations.map((impl, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ring-offset-1 ring-offset-black ${
              i === activeIndex
                ? "bg-white/10 text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {impl.name}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div
        className="rounded-2xl border border-border-subtle bg-surface-elevated p-6 transition-all duration-300"
        key={activeIndex}
      >
        {/* Header row */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            {active.name}
          </h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
              active.type === "mainstream"
                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                : "bg-violet-500/10 text-violet-400 border-violet-500/20"
            }`}
          >
            {active.type === "mainstream" ? "主流方案" : "进阶方案"}
          </span>
        </div>

        {/* Vendor */}
        <p className="text-text-body text-sm mb-3">
          提供方: {active.vendor}
        </p>

        {/* Description */}
        <p className="text-text-body text-base mb-5 leading-relaxed">
          {active.description}
        </p>

        {/* Pros & Cons grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <h4 className="text-emerald-400 font-medium text-sm mb-2">
              优势
            </h4>
            <ul className="space-y-1">
              {active.pros.map((pro, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <CheckIcon />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-red-400 font-medium text-sm mb-2">
              局限
            </h4>
            <ul className="space-y-1">
              {active.cons.map((con, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <MinusIcon />
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
