import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CitationMarker from "@/components/CitationMarker";

describe("CitationMarker", () => {
  it("renders nothing when citationIds is empty", () => {
    const { container } = render(<CitationMarker citationIds={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a single citation", () => {
    render(<CitationMarker citationIds={["ref-allen2007"]} />);
    expect(screen.getByText("[allen2007]")).toBeInTheDocument();
  });

  it("renders multiple citations", () => {
    render(
      <CitationMarker citationIds={["ref-allen2007", "ref-tamura2014"]} />
    );
    expect(screen.getByText("[allen2007]")).toBeInTheDocument();
    expect(screen.getByText("[tamura2014]")).toBeInTheDocument();
  });

  it("links to references page", () => {
    render(<CitationMarker citationIds={["ref-allen2007"]} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/references#ref-allen2007");
  });
});
