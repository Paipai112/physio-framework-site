import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ReferenceList from "@/components/ReferenceList";
import type { Reference } from "@/data/types";

const mockRefs: Reference[] = [
  {
    id: "ref-allen2007",
    title: "Photoplethysmography and its application in clinical physiological measurement",
    authors: "Allen J",
    year: 2007,
    type: "paper",
    doi: "10.1088/0967-3334/28/3/R01",
    zhSummary: "PPG光电容积描记技术综述",
  },
  {
    id: "ref-max30102",
    title: "MAX30102 High-Sensitivity Pulse Oximeter and Heart-Rate Sensor",
    authors: "Maxim Integrated",
    year: 2019,
    type: "documentation",
    url: "https://www.maximintegrated.com",
    zhSummary: "MAX30102芯片技术文档",
  },
];

describe("ReferenceList", () => {
  it("renders heading", () => {
    render(<ReferenceList references={mockRefs} />);
    expect(screen.getByText("参考文献")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(
      <ReferenceList references={mockRefs} title="引用文献" />
    );
    expect(screen.getByText("引用文献")).toBeInTheDocument();
  });

  it("renders article titles", () => {
    render(<ReferenceList references={mockRefs} />);
    expect(
      screen.getByText(/Photoplethysmography and its application/)
    ).toBeInTheDocument();
  });

  it("renders authors", () => {
    render(<ReferenceList references={mockRefs} />);
    expect(screen.getByText(/Allen J/)).toBeInTheDocument();
  });

  it("renders zhSummary for references that have it", () => {
    render(<ReferenceList references={mockRefs} />);
    expect(screen.getByText("PPG光电容积描记技术综述")).toBeInTheDocument();
  });

  it("returns null for empty references", () => {
    const { container } = render(<ReferenceList references={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
