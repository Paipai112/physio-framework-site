import { describe, it, expect } from "vitest";
import { modules, getModuleById } from "@/data/modules";
import { references, getReferenceById } from "@/data/references";
import { glossaryTerms, getGlossaryTermById } from "@/data/glossary";

describe("cross-reference integrity", () => {
  it("all dependsOn module IDs exist", () => {
    const allIds = new Set(modules.map((m) => m.id));
    for (const m of modules) {
      for (const depId of m.dependsOn) {
        expect(allIds.has(depId)).toBe(true);
      }
    }
  });

  it("all feedsInto module IDs exist", () => {
    const allIds = new Set(modules.map((m) => m.id));
    for (const m of modules) {
      for (const feedId of m.feedsInto) {
        expect(allIds.has(feedId)).toBe(true);
      }
    }
  });

  it("all module reference IDs exist in references", () => {
    const refIds = new Set(references.map((r) => r.id));
    for (const m of modules) {
      for (const refId of m.references) {
        expect(refIds.has(refId)).toBe(true);
      }
    }
  });

  it("all module glossary term IDs exist", () => {
    const termIds = new Set(glossaryTerms.map((t) => t.id));
    for (const m of modules) {
      for (const termId of m.glossaryTerms) {
        expect(termIds.has(termId)).toBe(true);
      }
    }
  });

  it("no dangling citations in module descriptions", () => {
    const CITATION_RE = /\[(ref-[a-z0-9-]+)\]/g;
    const refIds = new Set(references.map((r) => r.id));

    for (const m of modules) {
      let match;
      while ((match = CITATION_RE.exec(m.description)) !== null) {
        expect(refIds.has(match[1])).toBe(true);
      }
    }
  });

  it("all implementation citations exist in references", () => {
    const refIds = new Set(references.map((r) => r.id));
    for (const m of modules) {
      for (const impl of m.implementations) {
        for (const citeId of impl.citations) {
          expect(refIds.has(citeId)).toBe(true);
        }
      }
    }
  });
});

describe("data consistency", () => {
  it("no module references itself in dependsOn", () => {
    for (const m of modules) {
      expect(m.dependsOn).not.toContain(m.id);
    }
  });

  it("no module references itself in feedsInto", () => {
    for (const m of modules) {
      expect(m.feedsInto).not.toContain(m.id);
    }
  });

  it("all implementations have at least 1 pro and 1 con", () => {
    for (const m of modules) {
      for (const impl of m.implementations) {
        expect(impl.pros.length).toBeGreaterThanOrEqual(1);
        expect(impl.cons.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("all implementation types are valid", () => {
    for (const m of modules) {
      for (const impl of m.implementations) {
        expect(["mainstream", "advanced"]).toContain(impl.type);
      }
    }
  });

  it("module IDs follow correct format (Lx:name)", () => {
    for (const m of modules) {
      expect(m.id).toMatch(/^L[0-5]:.+$/);
    }
  });
});
