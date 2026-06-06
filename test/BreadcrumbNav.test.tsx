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
    expect(screen.getAllByText("首页")[0]).toBeInTheDocument();
    expect(screen.getAllByText("层级")[0]).toBeInTheDocument();
    expect(screen.getAllByText("传感器层")[0]).toBeInTheDocument();
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
    const crumbs = screen.getAllByText("传感器层");
    const lastCrumb = crumbs[crumbs.length - 1];
    expect(lastCrumb.closest("a")).toBeNull();
  });

  it("crumbs with href are clickable links", () => {
    render(
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "传感器层" },
        ]}
      />
    );
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute("href", "/");
  });
});
