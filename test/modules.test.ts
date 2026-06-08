import { describe, it, expect } from "vitest";
import { modules, getModuleById, getModulesByLayer, getModulesByIds } from "@/data/modules";

describe("modules data", () => {
  it("has 119 modules", () => {
    expect(modules).toHaveLength(119);
  });

  it("all modules have unique IDs", () => {
    const ids = modules.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all modules have required fields", () => {
    for (const m of modules) {
      expect(m.id).toBeTruthy();
      expect(m.layer).toBeTruthy();
      expect(m.name).toBeTruthy();
      expect(m.summary).toBeTruthy();
      expect(m.description).toBeTruthy();
      expect(["high", "medium", "low"]).toContain(m.importance);
      expect(Array.isArray(m.dependsOn)).toBe(true);
      expect(Array.isArray(m.feedsInto)).toBe(true);
      expect(Array.isArray(m.tags)).toBe(true);
      expect(Array.isArray(m.implementations)).toBe(true);
      expect(Array.isArray(m.glossaryTerms)).toBe(true);
      expect(Array.isArray(m.references)).toBe(true);
    }
  });

  it("all modules belong to valid layers", () => {
    const validLayers = ["L0", "L1", "L2", "L3", "L4", "L5"];
    for (const m of modules) {
      expect(validLayers).toContain(m.layer);
    }
  });

  it("summary is at most 200 characters", () => {
    for (const m of modules) {
      expect(m.summary.length).toBeLessThanOrEqual(200);
    }
  });

  it("L0 has exactly 1 module", () => {
    const l0Modules = modules.filter((m) => m.layer === "L0");
    expect(l0Modules).toHaveLength(1);
  });

  it("L1-L5 each have at least 1 module", () => {
    for (const layer of ["L1", "L2", "L3", "L4", "L5"]) {
      const count = modules.filter((m) => m.layer === layer).length;
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("getModuleById", () => {
  it("returns a module for a valid ID", () => {
    const mod = getModuleById("L1:ppg");
    expect(mod).toBeDefined();
    expect(mod!.name).toBeTruthy();
  });

  it("returns undefined for an invalid ID", () => {
    expect(getModuleById("nonexistent")).toBeUndefined();
  });
});

describe("getModulesByLayer", () => {
  it("returns modules for a valid layer", () => {
    const l1Modules = getModulesByLayer("L1");
    expect(l1Modules.length).toBeGreaterThan(0);
    for (const m of l1Modules) {
      expect(m.layer).toBe("L1");
    }
  });

  it("returns empty array for an invalid layer", () => {
    expect(getModulesByLayer("L99")).toEqual([]);
  });
});

describe("getModulesByIds", () => {
  it("returns modules for valid IDs", () => {
    const result = getModulesByIds(["L1:ppg", "L2:hr"]);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("L1:ppg");
  });

  it("filters out invalid IDs", () => {
    const result = getModulesByIds(["L1:ppg", "nonexistent", "L2:hr"]);
    expect(result).toHaveLength(2);
  });

  it("returns empty array for empty input", () => {
    expect(getModulesByIds([])).toEqual([]);
  });
});
