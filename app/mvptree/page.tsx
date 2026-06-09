'use client';

import MVPTreeGraph from '@/components/MVPTreeGraph';
import {
  mvpNodes,
  mvpEdges,
  buildPhases,
  getMvpNodesByLayer,
  type MvpNode,
  type BuildPhase,
} from '@/data/mvptree-data';
import { getLayerHex, LAYER_COLORS } from '@/data/colors';
import Link from 'next/link';
import { useState, useRef, useEffect, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const LAYER_ORDER = ['L1', 'L2', 'L3', 'L4', 'L5'] as const;

const LAYER_NAMES: Record<string, string> = {
  L1: '传感器层',
  L2: '基础指标层',
  L3: '融合指标层',
  L4: '高级指标层',
  L5: 'AI 输出层',
};

const PHASE_COLORS: Record<number, string> = {
  1: '#FFB347',
  2: '#4ADE80',
  3: '#60A5FA',
  4: '#C084FC',
};

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Map data edges (from/to) to component edges (source/target). */
function toComponentEdges(
  edges: { from: string; to: string }[],
): { source: string; target: string }[] {
  return edges.map((e) => ({ source: e.from, target: e.to }));
}

/** Look up module ids that belong to a given phase. */
function getPhaseModules(phase: BuildPhase): MvpNode[] {
  const idSet = new Set(phase.moduleIds);
  return mvpNodes.filter((n) => idSet.has(n.id));
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                     */
/* ------------------------------------------------------------------ */

function GradientDivider() {
  return (
    <div className="mx-auto my-8 h-[3px] w-[60px] rounded-full bg-gradient-to-r from-[#FF5757] via-[#4ADE80] to-[#C084FC]" />
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
      {children}
    </h2>
  );
}

function StatCard({ bigNumber, subtitle }: { bigNumber: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-6 text-center">
      <div className="font-heading text-[clamp(2rem,4vw,3rem)] font-bold text-text-primary">
        {bigNumber}
      </div>
      <div className="mt-2 text-sm text-text-secondary">{subtitle}</div>
    </div>
  );
}

interface LayerAccordionCardProps {
  layerId: string;
  layerName: string;
  nodes: MvpNode[];
  isExpanded: boolean;
  onToggle: () => void;
}

function LayerAccordionCard({
  layerId,
  layerName,
  nodes,
  isExpanded,
  onToggle,
}: LayerAccordionCardProps) {
  const hex = LAYER_COLORS[layerId] ?? '#737373';

  return (
    <div
      className="rounded-r-2xl border border-border-subtle bg-surface-elevated"
      style={{ borderLeft: `3px solid ${hex}` }}
    >
      {/* Header */}
      <button
        type="button"
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-highlight"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        {/* Color dot */}
        <span
          className="inline-block h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: hex }}
        />

        {/* Layer name + count */}
        <span className="font-heading text-base font-semibold text-text-primary">
          {layerId} — {layerName}
        </span>
        <span className="ml-1 rounded-full bg-surface-hover px-2 py-0.5 text-xs text-text-muted">
          {nodes.length} 模块
        </span>

        {/* Chevron */}
        <svg
          className={`ml-auto h-5 w-5 shrink-0 text-text-muted transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body */}
      {isExpanded && (
        <div className="border-t border-border-subtle px-5 pb-5 pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nodes.map((node) => (
              <Link
                key={node.id}
                href={`/module/${node.id}`}
                className="group block rounded-xl border border-border-subtle bg-surface p-4 transition-all duration-200 hover:border-white/10 hover:bg-surface-hover"
              >
                {/* Module name */}
                <div className="font-heading text-sm font-semibold text-text-primary transition-colors group-hover:text-white">
                  {node.name}
                </div>

                {/* Key metric badge */}
                <div className="mt-1.5">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 font-mono text-xs"
                    style={{
                      backgroundColor: hex + '18',
                      color: hex,
                      border: `1px solid ${hex}30`,
                    }}
                  >
                    {node.keyMetric}
                  </span>
                </div>

                {/* whyMVP text */}
                <p className="mt-2 text-xs leading-relaxed text-text-secondary line-clamp-2">
                  {node.whyMVP}
                </p>

                {/* Phase badge */}
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: (PHASE_COLORS[node.buildPhase] ?? '#737373') + '18',
                      color: PHASE_COLORS[node.buildPhase] ?? '#737373',
                    }}
                  >
                    阶段 {node.buildPhase}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function MVPTreePage() {
  /* ---- Graph width measurement ---- */
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [graphWidth, setGraphWidth] = useState<number>(960);

  useEffect(() => {
    function measure() {
      if (graphContainerRef.current) {
        setGraphWidth(graphContainerRef.current.clientWidth);
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* ---- Accordion state ---- */
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(
    new Set(['L1']),
  );

  const toggleLayer = (layerId: string) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layerId)) {
        next.delete(layerId);
      } else {
        next.add(layerId);
      }
      return next;
    });
  };

  /* ---- Derived data ---- */
  const componentEdges = useMemo(() => toComponentEdges(mvpEdges), []);

  const layersWithNodes = useMemo(
    () =>
      LAYER_ORDER.map((layerId) => ({
        layerId,
        layerName: LAYER_NAMES[layerId] ?? layerId,
        nodes: getMvpNodesByLayer(layerId),
      })).filter((l) => l.nodes.length > 0),
    [],
  );

  const phaseModulesMap = useMemo(() => {
    const map = new Map<number, MvpNode[]>();
    for (const phase of buildPhases) {
      map.set(phase.phase, getPhaseModules(phase));
    }
    return map;
  }, []);

  return (
    <div className="space-y-20">
      {/* ============================================================ */}
      {/* SECTION 1 — Hero                                               */}
      {/* ============================================================ */}
      <section className="py-16 text-center">
        <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-[-0.02em] text-text-primary">
          MVP 树
        </h1>

        <p className="mt-4 text-xl text-text-body">
          从 3 颗传感器到全身洞察
        </p>

        <p className="mt-3 text-text-secondary">
          无屏手环最小可行产品路径 — 仅需 PPG + 加速度计 + 皮肤温度传感器
        </p>

        <GradientDivider />

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-text-secondary">
          构建可穿戴生理信号处理系统是一项系统工程，涉及硬件选型、信号采集、算法开发、融合分析和用户呈现五个层次。
          即使具备心率胸带的开发经验，从零搭建完整生理学框架仍然需要一条最短验证路径。
          MVP 树参考 Google/Verily Study Watch 的传感器理念（FDA 510(k) 认证无屏研究手环），
          从 PPG、加速度计、皮肤温度三颗传感器出发，筛选出 19 项最高 ROI 的核心指标，
          按 4 个阶段渐进式构建，每阶段产出可独立验证。
        </p>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — 能力概览                                           */}
      {/* ============================================================ */}
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            bigNumber="3 → 19"
            subtitle="3 颗传感器 → 19 项核心指标"
          />
          <StatCard
            bigNumber="4 阶段"
            subtitle="分阶段渐进式构建，每阶段可独立验证"
          />
          <StatCard
            bigNumber="Study Watch 验证"
            subtitle="传感器组合经 FDA 临床研究验证"
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — 指标依赖树                                         */}
      {/* ============================================================ */}
      <section className="rounded-2xl border border-border-subtle bg-surface-elevated p-6">
        <div className="mb-6">
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            指标依赖树
          </h2>
          <p className="mt-1.5 text-sm text-text-secondary">
            从 3 颗传感器出发，经 5 层信号链，汇聚为个性化健康建议
          </p>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {LAYER_ORDER.map((layerId) => {
            const hex = LAYER_COLORS[layerId] ?? '#737373';
            const name = LAYER_NAMES[layerId] ?? layerId;
            return (
              <span
                key={layerId}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: hex + '14',
                  color: hex,
                  border: `1px solid ${hex}30`,
                }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: hex }}
                />
                {layerId} {name}
              </span>
            );
          })}
        </div>

        {/* Graph */}
        <div
          ref={graphContainerRef}
          className="overflow-hidden rounded-xl border border-border-subtle bg-surface"
        >
          <MVPTreeGraph
            nodes={mvpNodes}
            edges={componentEdges}
            width={graphWidth}
            height={650}
          />
        </div>

        <p className="mt-3 text-center text-xs text-text-muted">
          悬停查看节点说明 · 点击跳转模块详情
        </p>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — 分层拆解                                           */}
      {/* ============================================================ */}
      <section>
        <SectionHeading>分层拆解</SectionHeading>

        <div className="space-y-3">
          {layersWithNodes.map(({ layerId, layerName, nodes }) => (
            <LayerAccordionCard
              key={layerId}
              layerId={layerId}
              layerName={layerName}
              nodes={nodes}
              isExpanded={expandedLayers.has(layerId)}
              onToggle={() => toggleLayer(layerId)}
            />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — 构建路线图                                         */}
      {/* ============================================================ */}
      <section>
        <SectionHeading>构建路线图</SectionHeading>
        <p className="mb-8 text-sm text-text-secondary">
          分 4 个阶段，预计 14 周完成核心闭环
        </p>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Timeline spine */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border-subtle" />

          <div className="space-y-8">
            {buildPhases.map((phase) => {
              const phaseHex = PHASE_COLORS[phase.phase] ?? '#737373';
              const modules = phaseModulesMap.get(phase.phase) ?? [];

              return (
                <div key={phase.phase} className="relative flex gap-6">
                  {/* Circle on timeline */}
                  <div
                    className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-surface"
                    style={{ backgroundColor: phaseHex }}
                  >
                    {phase.phase}
                  </div>

                  {/* Content card */}
                  <div className="min-w-0 flex-1 rounded-2xl border border-border-subtle bg-surface-elevated p-5">
                    {/* Phase header */}
                    <div className="mb-2 flex flex-wrap items-baseline gap-2">
                      <h3 className="font-heading text-base font-semibold text-text-primary">
                        {phase.title}
                      </h3>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: phaseHex + '18',
                          color: phaseHex,
                        }}
                      >
                        {phase.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {phase.description}
                    </p>

                    {/* Module tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {modules.map((mod) => {
                        const layerHex = LAYER_COLORS[mod.layer] ?? '#737373';
                        return (
                          <Link
                            key={mod.id}
                            href={`/module/${mod.id}`}
                            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium transition-all hover:scale-[1.03]"
                            style={{
                              backgroundColor: layerHex + '14',
                              color: layerHex,
                              border: `1px solid ${layerHex}30`,
                            }}
                          >
                            {mod.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6 — 参考研究 (Study Watch)                              */}
      {/* ============================================================ */}
      <section>
        <SectionHeading>参考：Google/Verily Study Watch</SectionHeading>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Study Watch specs */}
          <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-6">
            <h3 className="font-heading text-base font-semibold text-text-primary mb-4">
              Study Watch 规格
            </h3>

            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-[#4ADE80] text-xs">●</span>
                <span>
                  <strong className="text-text-body">FDA 510(k) Class II</strong> — 经 FDA 批准的临床级研究手环
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-[#4ADE80] text-xs">●</span>
                <span>
                  <strong className="text-text-body">传感器配置：</strong>多波长 PPG (绿/红/IR)、单导联 ECG、EDA（皮电活动）、6 轴 IMU、皮肤温度、气压计、环境光传感器
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-[#4ADE80] text-xs">●</span>
                <span>
                  <strong className="text-text-body">临床部署：</strong>Project Baseline (10,000+ 参与者，2017-)、All of Us Research Program (NIH，1M+ 目标)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-[#4ADE80] text-xs">●</span>
                <span>
                  <strong className="text-text-body">论文产出：</strong>NPJ Digital Medicine 系列 (2019-2024)，涉及心血管、睡眠、呼吸、COVID-19 早期检测
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-[#4ADE80] text-xs">●</span>
                <span>
                  <strong className="text-text-body">关键优势：</strong>临床级信号质量、连续 7+ 天佩戴、无屏幕设计降低功耗和干扰
                </span>
              </li>
            </ul>
          </div>

          {/* Right: Our MVP comparison */}
          <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-6">
            <h3 className="font-heading text-base font-semibold text-text-primary mb-4">
              我们的 MVP 方案对照
            </h3>

            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-[#60A5FA] text-xs">●</span>
                <span>
                  <strong className="text-text-body">传感器取舍：</strong>保留 PPG（核心）+ IMU（活动/睡眠）+ 温度（恢复/节律），去掉 ECG/EDA/气压计
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-[#60A5FA] text-xs">●</span>
                <span>
                  <strong className="text-text-body">信号链验证：</strong>Study Watch 已证明 PPG-only 通路可输出 HR/HRV/SpO₂/RR/睡眠分期
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-[#60A5FA] text-xs">●</span>
                <span>
                  <strong className="text-text-body">临床级 vs 消费级：</strong>MVP 目标为消费级趋势追踪，非医疗诊断
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-[#60A5FA] text-xs">●</span>
                <span>
                  <strong className="text-text-body">阶段 1-4 对应：</strong>Study Watch 的渐进式验证路径 — 从信号质量到多模态融合到临床验证
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7 — 后续路径                                           */}
      {/* ============================================================ */}
      <section>
        <SectionHeading>后续扩展路径</SectionHeading>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-6">
            <h3 className="font-heading text-base font-semibold text-text-primary">
              心率胸带 → 无屏手环
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              利用已有的胸带 ECG 经验标定 PPG 算法。胸带 ECG 的心率检测精度接近金标准 (99%+)，可作为 PPG 算法的黄金标准校准源，加速信号处理管线的验证和迭代。
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-6">
            <h3 className="font-heading text-base font-semibold text-text-primary">
              CGM 血糖集成
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              连续血糖监测 (Dexcom/Abbott Libre) 接入，引入代谢健康维度。
              血糖数据与心率、HRV、活动量的交叉分析是运动营养和代谢健康的蓝海方向，可显著扩展 MVP 的使用场景。
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-6">
            <h3 className="font-heading text-base font-semibold text-text-primary">
              FDA 临床验证
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              参考 Study Watch 510(k) 路径，消费级向临床级演进。
              在 MVP 完成消费级验证后，可启动临床研究（如睡眠呼吸暂停筛查、房颤检测），申请 FDA 510(k) 或 De Novo 认证，从健康追踪器升级为医疗设备。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/*
 * NOTE: Next.js metadata (generateMetadata / export const metadata) is NOT
 * available in 'use client' components.  To set page title & description for
 * this route, create a minimal server component layout:
 *
 *   // app/mvptree/layout.tsx
 *   import type { Metadata } from 'next'
 *   export const metadata: Metadata = {
 *     title: 'MVP 树 — 生理信号处理框架',
 *     description: '无屏手环最小可行产品路径 — 从 3 颗传感器到 19 项核心指标的渐进式构建路线图',
 *   }
 *   export default function MVPTreeLayout({ children }: { children: React.ReactNode }) {
 *     return <>{children}</>
 *   }
 */
