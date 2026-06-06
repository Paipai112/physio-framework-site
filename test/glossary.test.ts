import { describe, it, expect } from "vitest";
import { glossaryTerms, getGlossaryTermById, getGlossaryTermsByIds } from "@/data/glossary";
import { references } from "@/data/references";

describe("glossary data", () => {
  it("has at least 40 terms", () => {
    expect(glossaryTerms.length).toBeGreaterThanOrEqual(40);
  });

  it("all terms have unique IDs", () => {
    const ids = glossaryTerms.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all terms have required fields", () => {
    for (const t of glossaryTerms) {
      expect(t.id).toBeTruthy();
      expect(t.term).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(t.definition).toBeTruthy();
      expect(Array.isArray(t.references)).toBe(true);
    }
  });

  it("EEG term references ref-eeg-basics (not ref-niedermeyer)", () => {
    const eeg = getGlossaryTermById("eeg");
    expect(eeg).toBeDefined();
    expect(eeg!.references).toContain("ref-eeg-basics");
    expect(eeg!.references).not.toContain("ref-niedermeyer");
  });

  it("all referenced IDs in glossary exist in references", () => {
    const refIds = new Set(references.map((r) => r.id));

    for (const t of glossaryTerms) {
      for (const refId of t.references) {
        expect(refIds.has(refId)).toBe(true);
      }
    }
  });
});

describe("getGlossaryTermById", () => {
  it("returns a term for valid ID", () => {
    const term = getGlossaryTermById("ppg");
    expect(term).toBeDefined();
    expect(term!.term).toBe("PPG");
  });

  it("returns undefined for invalid ID", () => {
    expect(getGlossaryTermById("nonexistent")).toBeUndefined();
  });
});

describe("getGlossaryTermsByIds", () => {
  it("returns terms for valid IDs", () => {
    const result = getGlossaryTermsByIds(["ppg", "hr"]);
    expect(result).toHaveLength(2);
  });

  it("filters out invalid IDs", () => {
    const result = getGlossaryTermsByIds(["ppg", "nonexistent"]);
    expect(result).toHaveLength(1);
  });
});
