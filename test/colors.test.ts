import { describe, it, expect } from "vitest";
import {
  LAYER_COLORS,
  getLayerHex,
  layerBorderColors,
  layerBadgeColors,
} from "@/data/colors";

describe("layer colors", () => {
  it("has hex colors for all 5 layers", () => {
    expect(LAYER_COLORS).toHaveProperty("L1");
    expect(LAYER_COLORS).toHaveProperty("L2");
    expect(LAYER_COLORS).toHaveProperty("L3");
    expect(LAYER_COLORS).toHaveProperty("L4");
    expect(LAYER_COLORS).toHaveProperty("L5");
  });

  it("getLayerHex returns the correct color", () => {
    expect(getLayerHex("L1")).toBe("#ef4444");
    expect(getLayerHex("L5")).toBe("#8b5cf6");
  });

  it("getLayerHex returns fallback for unknown layer", () => {
    expect(getLayerHex("L99")).toBe("#64748b");
  });

  it("layerBorderColors has entries for all layers", () => {
    for (const id of ["L1", "L2", "L3", "L4", "L5"]) {
      expect(layerBorderColors[id]).toBeTruthy();
    }
  });

  it("layerBadgeColors has entries for all layers", () => {
    for (const id of ["L1", "L2", "L3", "L4", "L5"]) {
      expect(layerBadgeColors[id]).toBeTruthy();
    }
  });
});
