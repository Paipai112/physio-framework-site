import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ImplementationTabs from "@/components/ImplementationTabs";
import type { Implementation } from "@/data/types";

const mockImpls: Implementation[] = [
  {
    type: "mainstream",
    name: "Pan-Tompkins算法",
    vendor: "Generic",
    description: "经典的QRS波检测算法",
    pros: ["计算效率高", "实时性好"],
    cons: ["对噪声敏感"],
    citations: [],
  },
  {
    type: "advanced",
    name: "深度学习QRS检测",
    vendor: "Research",
    description: "基于CNN的QRS检测",
    pros: ["准确率高", "抗噪性强"],
    cons: ["计算量大", "需训练数据"],
    citations: [],
  },
];

describe("ImplementationTabs", () => {
  it("renders empty state when no implementations", () => {
    render(<ImplementationTabs implementations={[]} />);
    expect(screen.getByText("暂无实现方案")).toBeInTheDocument();
  });

  it("renders tab buttons", () => {
    render(<ImplementationTabs implementations={mockImpls} />);
    expect(screen.getByRole("button", { name: "Pan-Tompkins算法" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "深度学习QRS检测" })).toBeInTheDocument();
  });

  it("shows first implementation by default", () => {
    render(<ImplementationTabs implementations={mockImpls} />);
    expect(screen.getByText("提供方: Generic")).toBeInTheDocument();
  });

  it("shows vendor name", () => {
    render(<ImplementationTabs implementations={mockImpls} />);
    expect(screen.getByText("提供方: Generic")).toBeInTheDocument();
  });

  it("shows type badge", () => {
    render(<ImplementationTabs implementations={mockImpls} />);
    expect(screen.getByText("主流方案")).toBeInTheDocument();
  });

  it("renders pros list", () => {
    render(<ImplementationTabs implementations={mockImpls} />);
    expect(screen.getByText("计算效率高")).toBeInTheDocument();
    expect(screen.getByText("实时性好")).toBeInTheDocument();
  });

  it("renders cons list", () => {
    render(<ImplementationTabs implementations={mockImpls} />);
    expect(screen.getByText("对噪声敏感")).toBeInTheDocument();
  });

  it("switches tab on click", () => {
    render(<ImplementationTabs implementations={mockImpls} />);
    fireEvent.click(screen.getByRole("button", { name: "深度学习QRS检测" }));
    expect(screen.getByText("基于CNN的QRS检测")).toBeInTheDocument();
  });
});
