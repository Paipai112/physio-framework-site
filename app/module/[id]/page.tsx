import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getModuleById,
  getModulesByIds,
  getModulesByLayer,
  modules,
} from "@/data/modules";
import { getLayerById } from "@/data/layers";
import { getGlossaryTermsByIds } from "@/data/glossary";
import { getReferencesByIds } from "@/data/references";
import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import DependencyGraph from "@/components/DependencyGraph";
import ImplementationTabs from "@/components/ImplementationTabs";
import ReferenceList from "@/components/ReferenceList";
import DescriptionRenderer from "@/components/DescriptionRenderer";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return modules.map((m) => ({ id: m.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const mod = getModuleById(decodeURIComponent(params.id));
  if (!mod) return { title: "模块未找到" };
  return {
    title: `${mod.name} - 生理信号处理框架`,
    description: mod.summary,
  };
}

const importanceColors: Record<string, string> = {
  high: "bg-amber-500/10 text-amber-400",
  medium: "bg-blue-500/10 text-blue-400",
  low: "bg-slate-500/10 text-slate-400",
};

export default function ModuleDetailPage({ params }: Props) {
  const moduleId = decodeURIComponent(params.id);
  const mod = getModuleById(moduleId);

  if (!mod) {
    notFound();
  }

  const layer = getLayerById(mod.layer);
  const depModules = getModulesByIds(mod.dependsOn);
  const feedModules = getModulesByIds(mod.feedsInto);
  const terms = getGlossaryTermsByIds(mod.glossaryTerms);
  const refs = getReferencesByIds(mod.references);

  const graphNodes = [
    { id: mod.id, label: mod.name, layer: mod.layer },
    ...depModules.map((d) => ({ id: d.id, label: d.name, layer: d.layer })),
    ...feedModules.map((f) => ({ id: f.id, label: f.name, layer: f.layer })),
  ];

  const graphEdges = [
    ...depModules.map((d) => ({ source: d.id, target: mod.id })),
    ...feedModules.map((f) => ({ source: mod.id, target: f.id })),
  ];

  const sameLayerModules = getModulesByLayer(mod.layer).filter(
    (m) => m.id !== mod.id
  );

  const impClass = importanceColors[mod.importance] ?? importanceColors.low;
  const descParagraphs = mod.description.split("\n\n").filter(Boolean);

  // Prev/next navigation
  const allModules = modules;
  const currentIdx = allModules.findIndex((m) => m.id === mod.id);
  const prevModule = currentIdx > 0 ? allModules[currentIdx - 1] : null;
  const nextModule =
    currentIdx < allModules.length - 1 ? allModules[currentIdx + 1] : null;

  return (
    <div className="space-y-10">
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          ...(layer
            ? [
                { label: layer.name, href: `/layer/${mod.layer}` },
                { label: "模块", href: "/module" },
              ]
            : []),
          { label: mod.name },
        ]}
      />

      {/* Module Header */}
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-white">{mod.name}</h1>
          {layer && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${impClass}`}
            >
              {mod.importance === "high"
                ? "核心"
                : mod.importance === "medium"
                  ? "重要"
                  : "辅助"}
            </span>
          )}
          <span className="rounded-full bg-slate-700/50 px-3 py-1 text-xs text-slate-400">
            {mod.layer}
          </span>
        </div>
        <p className="text-lg text-slate-400">{mod.summary}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {mod.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-700/50 px-3 py-1 text-sm text-slate-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">概述</h2>
        <DescriptionRenderer paragraphs={descParagraphs} />
      </section>

      {/* Dependency Graph */}
      {graphNodes.length > 1 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">依赖关系图</h2>
          <DependencyGraph
            nodes={graphNodes}
            edges={graphEdges}
            width={700}
            height={350}
          />
          <p className="mt-2 text-xs text-slate-500">
            滚轮缩放 · 拖拽平移 · 悬停查看 · 点击跳转详情 · 颜色按层级区分
          </p>
        </section>
      )}

      {/* Dependencies & Feeds Into */}
      <div className="grid gap-6 sm:grid-cols-2">
        {depModules.length > 0 && (
          <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
            <h2 className="mb-3 text-lg font-semibold text-white">
              依赖（下级输入）
            </h2>
            <ul className="space-y-2">
              {depModules.map((dep) => (
                <li key={dep.id}>
                  <Link
                    href={`/module/${dep.id}`}
                    className="text-primary-400 hover:text-primary-300 hover:underline"
                  >
                    {dep.name}
                  </Link>
                  <span className="ml-2 text-xs text-slate-500">
                    {dep.summary.slice(0, 60)}...
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {feedModules.length > 0 && (
          <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
            <h2 className="mb-3 text-lg font-semibold text-white">
              供给（上级输出）
            </h2>
            <ul className="space-y-2">
              {feedModules.map((feed) => (
                <li key={feed.id}>
                  <Link
                    href={`/module/${feed.id}`}
                    className="text-primary-400 hover:text-primary-300 hover:underline"
                  >
                    {feed.name}
                  </Link>
                  <span className="ml-2 text-xs text-slate-500">
                    {feed.summary.slice(0, 60)}...
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Implementations */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">实现方案</h2>
        <ImplementationTabs implementations={mod.implementations} />
      </section>

      {/* Glossary Terms */}
      {terms.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-white">相关术语</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {terms.map((term) => (
              <Link
                key={term.id}
                href={`/glossary/${term.id}`}
                className="block rounded-lg border border-slate-700/50 bg-slate-800/20 p-4 transition-colors hover:border-slate-600"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary-400">
                    {term.term}
                  </span>
                  <span className="rounded bg-slate-700/50 px-1.5 py-0.5 text-xs text-slate-400">
                    {term.category}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {term.definition}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {refs.length > 0 && (
        <section>
          <ReferenceList references={refs} />
        </section>
      )}

      {/* Related Modules */}
      {sameLayerModules.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-white">
            同层相关模块
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sameLayerModules.slice(0, 6).map((rel) => (
              <Link
                key={rel.id}
                href={`/module/${rel.id}`}
                className="rounded-lg border border-slate-700/50 bg-slate-800/20 p-4 transition-all hover:border-slate-600 hover:bg-slate-800/40"
              >
                <div className="text-sm font-medium text-white hover:text-primary-400">
                  {rel.name}
                </div>
                <div className="mt-1 line-clamp-1 text-xs text-slate-500">
                  {rel.summary}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Prev / Next Navigation */}
      <nav
        className="flex items-center justify-between border-t border-slate-700/50 pt-6"
        aria-label="模块导航"
      >
        <div>
          {prevModule && (
            <Link
              href={`/module/${prevModule.id}`}
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              &larr; {prevModule.name}
            </Link>
          )}
        </div>
        <Link
          href={layer ? `/layer/${mod.layer}` : "/module"}
          className="text-sm text-slate-500 hover:text-white"
        >
          返回{layer?.name ?? "模块列表"}
        </Link>
        <div>
          {nextModule && (
            <Link
              href={`/module/${nextModule.id}`}
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              {nextModule.name} &rarr;
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
