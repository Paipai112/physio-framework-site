import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BreadcrumbNav from "@/components/BreadcrumbNav";

describe("BreadcrumbNav", () => {
  it("renders all crumbs", () => {
    render(
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "层级", href: "/layer" },
          { label: "传感器层" },
        ]}
      />
    );
    // First crumb uses HomeIcon (SVG, no text), subsequent crumbs use labels
    expect(screen.getByText("层级")).toBeInTheDocument();
    expect(screen.getByText("传感器层")).toBeInTheDocument();
  });

  it("last crumb is not a link", () => {
    render(
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "传感器层" },
        ]}
      />
    );
    const lastCrumb = screen.getByText("传感器层");
    expect(lastCrumb.closest("a")).toBeNull();
  });

  it("crumbs with href are clickable links", () => {
    render(
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "层级", href: "/layer" },
          { label: "传感器层" },
        ]}
      />
    );
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(1);
    // Home crumb (icon) and "层级" are both links
    expect(links[0]).toHaveAttribute("href", "/");
  });
});
