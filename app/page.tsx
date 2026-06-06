import Link from "next/link";
import { modules } from "@/data/modules";
import { layers } from "@/data/layers";
import type { Module } from "@/data/types";
import { getLayerHex } from "@/data/colors";

export default function HomePage() {
  const byLayer: Record<string, Module[]> = {};
  for (const m of modules) {
    if (!byLayer[m.layer]) byLayer[m.layer] = [];
    byLayer[m.layer].push(m);
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          系统化生理信号处理
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          从传感器到临床应用，构建完整的技术栈知识体系。
          涵盖信号采集、预处理、特征提取、模式识别与临床决策支持。
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/layer/L1"
            className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus-ring"
          >
            探索五层架构
          </Link>
          <Link
            href="/module"
            className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white focus-ring"
          >
            查看所有模块
          </Link>
        </div>
      </section>

      {/* Layer Flow Diagram */}
      <section className="rounded-xl border border-slate-700/50 bg-slate-800/20 p-8">
        <h3 className="mb-6 text-center text-xl font-semibold text-white">
          五层架构概览
        </h3>
        <div className="relative mx-auto flex max-w-3xl flex-col items-center">
          {layers
            .filter((l) => l.id !== "L0")
            .map((layer, i) => (
              <div key={layer.id} className="flex w-full items-center gap-4">
                <div className="w-28 flex-none">
                  <Link
                    href={`/layer/${layer.id}`}
                    className="group flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2 transition-all hover:border-slate-600"
                  >
                    <span className="text-lg">{layer.icon}</span>
                    <div>
                      <div className="whitespace-nowrap text-xs font-semibold text-white group-hover:text-primary-400">
                        {layer.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {byLayer[layer.id]?.length || 0} 模块
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: getLayerHex(layer.id) }}
                  >
                    {layer.id.replace("L", "")}
                  </div>
                  {i < 4 && (
                    <div
                      className="h-8 w-0.5"
                      style={{
                        backgroundColor: getLayerHex(layer.id) + "40",
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm leading-relaxed text-slate-500">
                    {layer.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Stats */}
      <section className="rounded-xl border border-slate-700/50 bg-slate-800/20 p-8">
        <div className="grid gap-6 text-center sm:grid-cols-5">
          <StatBox
            value={byLayer.L1?.length ?? 0}
            label="传感器层"
            color="text-red-400"
          />
          <StatBox
            value={byLayer.L2?.length ?? 0}
            label="基础指标层"
            color="text-amber-400"
          />
          <StatBox
            value={byLayer.L3?.length ?? 0}
            label="中级（融合）指标层"
            color="text-emerald-400"
          />
          <StatBox
            value={byLayer.L4?.length ?? 0}
            label="高级指标层"
            color="text-blue-400"
          />
          <StatBox
            value={byLayer.L5?.length ?? 0}
            label="AI教练/平台层"
            color="text-violet-400"
          />
        </div>
      </section>

      {/* Quick Entry */}
      <section>
        <h3 className="mb-6 text-center text-xl font-semibold text-white">
          快速入口
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {layers
            .filter((l) => l.id !== "L0")
            .map((layer) => (
              <Link
                key={layer.id}
                href={`/layer/${layer.id}`}
                className="group rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 text-center transition-all hover:border-slate-600"
              >
                <div className="mb-2 text-3xl">{layer.icon}</div>
                <div className="text-sm font-semibold text-white group-hover:text-primary-400">
                  {layer.name}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {byLayer[layer.id]?.length || 0} 模块
                </div>
              </Link>
            ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/module"
            className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
          >
            浏览全部模块 &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatBox({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  );
}
