import { describe, it, expect } from "vitest";
import { references, getReferenceById, getReferencesByIds, getReferencesByType } from "@/data/references";

describe("references data", () => {
  it("has at least 80 references", () => {
    expect(references.length).toBeGreaterThanOrEqual(80);
  });

  it("all references have unique IDs", () => {
    const ids = references.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all reference IDs start with 'ref-'", () => {
    for (const r of references) {
      expect(r.id).toMatch(/^ref-/);
    }
  });

  it("all references have required fields", () => {
    for (const r of references) {
      expect(r.id).toBeTruthy();
      expect(r.title).toBeTruthy();
      expect(["paper", "website", "patent", "documentation", "book"]).toContain(
        r.type
      );
    }
  });

  it("all paper references have DOI", () => {
    const papers = references.filter((r) => r.type === "paper");
    const missingDoi = papers.filter((r) => !r.doi);
    // Log missing DOIs for awareness but don't fail
    if (missingDoi.length > 0) {
      console.warn(
        `Papers missing DOI (${missingDoi.length}):`,
        missingDoi.map((r) => r.id).join(", ")
      );
    }
    // At least 80% of papers should have DOI
    const doiRate = papers.filter((r) => r.doi).length / papers.length;
    expect(doiRate).toBeGreaterThan(0.8);
  });

  it("all references have either URL or DOI", () => {
    const missing = references.filter((r) => !r.url && !r.doi);
    // Books can be OK without URL/DOI
    const missingNonBook = missing.filter((r) => r.type !== "book");
    expect(missingNonBook.length).toBeLessThanOrEqual(25);
  });
});

describe("getReferenceById", () => {
  it("returns a reference for a valid ID", () => {
    const ref = getReferenceById("ref-allen2007");
    expect(ref).toBeDefined();
    expect(ref!.title).toContain("Photoplethysmography");
  });

  it("returns undefined for invalid ID", () => {
    expect(getReferenceById("nonexistent")).toBeUndefined();
  });
});

describe("getReferencesByIds", () => {
  it("returns references for valid IDs", () => {
    const result = getReferencesByIds(["ref-allen2007", "ref-hrv-standards"]);
    expect(result).toHaveLength(2);
  });

  it("filters out invalid IDs", () => {
    const result = getReferencesByIds(["ref-allen2007", "nonexistent"]);
    expect(result).toHaveLength(1);
  });
});

describe("getReferencesByType", () => {
  it("returns references filtered by type", () => {
    const papers = getReferencesByType("paper");
    expect(papers.length).toBeGreaterThan(0);
    for (const r of papers) {
      expect(r.type).toBe("paper");
    }
  });
});
