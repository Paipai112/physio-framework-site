/**
 * Dependency Graph — SINGLE SOURCE OF TRUTH for all module dependencies.
 *
 * Derived from modules-data.ts. No dependency relationship is expressed
 * outside this file; all other consumers (components, pages) import from here.
 */

import { modules } from "./modules-data";
import type { Module } from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A node in the dependency graph representing one module. */
export interface DepNode {
  id: string;
  label: string;
  layer: string;
}

/**
 * A directed edge in the dependency graph.
 *
 * Semantics: `source` depends on `target`.
 * Arrow notation: source → target  means  "target is a dependency of source".
 */
export interface DepEdge {
  source: string;
  target: string;
}

// ---------------------------------------------------------------------------
// Helpers (private)
// ---------------------------------------------------------------------------

/** Build a module lookup map keyed by module id. */
const moduleMap: ReadonlyMap<string, Module> = new Map(
  modules.map((m) => [m.id, m])
);

/** Create a unique edge key string for deduplication. */
const edgeKey = (source: string, target: string): string =>
  `${source}->${target}`;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build the complete dependency graph from every module's `dependsOn` and
 * `feedsInto` arrays. Edges are deduplicated.
 */
export function buildFullDependencyGraph(): {
  nodes: DepNode[];
  edges: DepEdge[];
} {
  const nodes: DepNode[] = modules.map((m) => ({
    id: m.id,
    label: m.name,
    layer: m.layer,
  }));

  const edgeSet = new Set<string>();
  const edges: DepEdge[] = [];

  const addEdge = (source: string, target: string): void => {
    const key = edgeKey(source, target);
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({ source, target });
    }
  };

  for (const m of modules) {
    // dependsOn: this module depends on depId
    for (const depId of m.dependsOn) {
      addEdge(m.id, depId);
    }

    // feedsInto: feedId depends on this module
    for (const feedId of m.feedsInto) {
      addEdge(feedId, m.id);
    }
  }

  return { nodes, edges };
}

/**
 * Return dependency neighbors for a single module.
 *
 * - `dependsOn`: modules this module depends on
 * - `feedsInto`: modules that depend on this module
 * - `all`: concatenation of both arrays
 *
 * Returns empty arrays when the module is not found.
 */
export function getDependencyNeighbors(moduleId: string): {
  dependsOn: string[];
  feedsInto: string[];
  all: string[];
} {
  const mod = moduleMap.get(moduleId);

  if (!mod) {
    return { dependsOn: [], feedsInto: [], all: [] };
  }

  return {
    dependsOn: [...mod.dependsOn],
    feedsInto: [...mod.feedsInto],
    all: [...mod.dependsOn, ...mod.feedsInto],
  };
}

/**
 * Build a subgraph centered on a single module.
 *
 * Includes:
 * - The center module itself
 * - All modules it depends on
 * - All modules that depend on (are fed by) it
 *
 * Only edges where BOTH endpoints belong to the resulting node set are
 * included.
 */
export function getModuleSubgraph(moduleId: string): {
  nodes: DepNode[];
  edges: DepEdge[];
} {
  const center = moduleMap.get(moduleId);

  if (!center) {
    return { nodes: [], edges: [] };
  }

  const neighborIds = new Set([
    moduleId,
    ...center.dependsOn,
    ...center.feedsInto,
  ]);

  // Also find modules that reference this one — handles data inconsistency
  // where A.dependsOn lists B but B.feedsInto doesn't list A (or vice versa).
  for (const mod of modules) {
    if (mod.dependsOn.includes(moduleId) || mod.feedsInto.includes(moduleId)) {
      neighborIds.add(mod.id);
    }
  }

  const { nodes: allNodes, edges: allEdges } = buildFullDependencyGraph();

  const nodes: DepNode[] = allNodes.filter((n) => neighborIds.has(n.id));

  const edges: DepEdge[] = allEdges.filter(
    (e) => neighborIds.has(e.source) && neighborIds.has(e.target)
  );

  return { nodes, edges };
}

/**
 * Return every edge where BOTH `source` and `target` are in `moduleIds`.
 */
export function getEdgesForModules(moduleIds: string[]): DepEdge[] {
  const idSet = new Set(moduleIds);
  const { edges: allEdges } = buildFullDependencyGraph();

  return allEdges.filter((e) => idSet.has(e.source) && idSet.has(e.target));
}
