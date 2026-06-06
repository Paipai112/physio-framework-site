"use client";

import { useState } from "react";
import type { Implementation } from "@/data/types";

interface Props {
  implementations: Implementation[];
}

export default function ImplementationTabs({ implementations }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!implementations || implementations.length === 0) {
    return <p className="text-sm text-slate-500">暂无实现方案</p>;
  }

  const active = implementations[activeIndex];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex space-x-1 rounded-lg bg-slate-800/30 p-1">
        {implementations.map((impl, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              i === activeIndex
                ? "bg-primary-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {impl.name}
          </button>
        ))}
      </div>

      {/* Detail Panel */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 transition-all duration-300" key={activeIndex}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{active.name}</h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              active.type === "mainstream"
                ? "bg-blue-500/10 text-blue-400"
                : "bg-violet-500/10 text-violet-400"
            }`}
          >
            {active.type === "mainstream" ? "主流方案" : "进阶方案"}
          </span>
        </div>
        <p className="mb-2 text-sm text-slate-400">提供方: {active.vendor}</p>
        <p className="mb-4 text-slate-300">{active.description}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-medium text-emerald-400">优势</h4>
            <ul className="space-y-1">
              {active.pros.map((pro, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1 text-emerald-400">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-red-400">局限</h4>
            <ul className="space-y-1">
              {active.cons.map((con, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1 text-red-400">-</span>
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
