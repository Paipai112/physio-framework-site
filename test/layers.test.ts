import { describe, it, expect } from "vitest";
import { layers, getLayerById } from "@/data/layers";

describe("layers data", () => {
  it("has 6 layers (L0-L5)", () => {
    expect(layers).toHaveLength(6);
  });

  it("has correct layer IDs in order", () => {
    const ids = layers.map((l) => l.id);
    expect(ids).toEqual(["L0", "L1", "L2", "L3", "L4", "L5"]);
  });

  it("all layers have required fields", () => {
    for (const l of layers) {
      expect(l.id).toBeTruthy();
      expect(l.name).toBeTruthy();
      expect(l.description).toBeTruthy();
      expect(l.icon).toBeTruthy();
    }
  });

  it("L0 is human body / signal source", () => {
    expect(layers[0].id).toBe("L0");
    expect(layers[0].name).toContain("人体");
  });

  it("L5 is AI coach layer", () => {
    expect(layers[5].id).toBe("L5");
    expect(layers[5].name).toContain("AI");
  });
});

describe("getLayerById", () => {
  it("returns layer for valid ID", () => {
    const l1 = getLayerById("L1");
    expect(l1).toBeDefined();
    expect(l1!.name).toBe("传感器层");
  });

  it("returns undefined for invalid ID", () => {
    expect(getLayerById("L99")).toBeUndefined();
  });
});
