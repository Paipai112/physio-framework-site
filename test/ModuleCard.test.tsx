import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ModuleCard from "@/components/ModuleCard";

const mockModule = {
  id: "L2:hr",
  layer: "L2",
  name: "心率 (HR)",
  summary: "心脏每分钟搏动次数",
  description: "心率是评估心血管功能和运动强度的基础指标。",
  importance: "high" as const,
  dependsOn: ["L1:ppg", "L1:ecg"],
  feedsInto: ["L3:hrv-analysis"],
  tags: ["心血管", "基础"],
  implementations: [
    {
      type: "mainstream" as const,
      name: "PPG心率检测",
      vendor: "Generic",
      description: "从PPG信号峰峰间隔计算心率",
      pros: ["无创", "连续监测"],
      cons: ["运动伪影影响精度"],
      citations: [],
    },
  ],
  glossaryTerms: ["hr", "bpm"],
  references: ["ref-allen2007"],
};

describe("ModuleCard", () => {
  it("renders module name", () => {
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByText("心率 (HR)")).toBeInTheDocument();
  });

  it("renders summary", () => {
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByText("心脏每分钟搏动次数")).toBeInTheDocument();
  });

  it("renders layer badge", () => {
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByText("L2")).toBeInTheDocument();
  });

  it("renders implementation badge", () => {
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByText("1个方案")).toBeInTheDocument();
  });

  it("is a link to module detail", () => {
    render(<ModuleCard module={mockModule} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/module/L2:hr");
  });
});
