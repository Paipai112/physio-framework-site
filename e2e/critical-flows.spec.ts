import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/生理信号处理框架/);
  });

  test("has hero heading", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "系统化生理信号处理" })
    ).toBeVisible();
  });

  test("navigates to layer from hero CTA", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "探索五层架构" }).click();
    await expect(page).toHaveURL(/\/layer\/L1/);
    await expect(
      page.getByRole("heading", { name: "传感器层" })
    ).toBeVisible();
  });

  test("navigates to module list from hero CTA", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "查看所有模块" }).click();
    await expect(page).toHaveURL(/\/module/);
  });

  test("layer flow diagram shows all 5 layers", async ({ page }) => {
    await page.goto("/");
    const links = page.locator('a[href^="/layer/L"]');
    await expect(links).toHaveCount(5);
  });
});

test.describe("Layer pages", () => {
  test("layer list shows L1-L5", async ({ page }) => {
    await page.goto("/layer");
    await expect(page.getByText("传感器层")).toBeVisible();
    await expect(page.getByText("AI教练")).toBeVisible();
  });

  test("layer detail shows modules", async ({ page }) => {
    await page.goto("/layer/L2");
    await expect(
      page.getByRole("heading", { name: "基础指标层" })
    ).toBeVisible();
  });

  test("invalid layer shows 404", async ({ page }) => {
    await page.goto("/layer/L99");
    await expect(page.getByText("404")).toBeVisible();
  });
});

test.describe("Module pages", () => {
  test("module list shows modules", async ({ page }) => {
    await page.goto("/module");
    await expect(page.getByText("全部模块")).toBeVisible();
  });

  test("module detail shows content", async ({ page }) => {
    await page.goto("/module/L1:ppg");
    await expect(page.getByText("PPG")).toBeVisible();
  });

  test("invalid module shows 404", async ({ page }) => {
    await page.goto("/module/nonexistent");
    await expect(page.getByText("404")).toBeVisible();
  });
});

test.describe("Glossary pages", () => {
  test("glossary list shows terms", async ({ page }) => {
    await page.goto("/glossary");
    await expect(page.getByText("术语词典")).toBeVisible();
  });

  test("glossary detail shows definition", async ({ page }) => {
    await page.goto("/glossary/hrv");
    await expect(
      page.getByRole("heading", { name: "HRV" })
    ).toBeVisible();
  });
});

test.describe("References page", () => {
  test("shows all reference types", async ({ page }) => {
    await page.goto("/references");
    await expect(page.getByText("参考文献总汇")).toBeVisible();
    await expect(page.getByText("学术论文")).toBeVisible();
    await expect(page.getByText("技术文档")).toBeVisible();
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("mobile menu opens and closes", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByLabel("打开菜单");
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(page.getByLabel("关闭菜单")).toBeVisible();
    await page.getByText("模块").click();
    await expect(page).toHaveURL(/\/module/);
  });
});
