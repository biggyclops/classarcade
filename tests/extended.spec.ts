import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("mobile navigation exposes favorites, import and teacher mode", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?concept=a");
  await page.getByRole("button", { name: "Favorites", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Favorites", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Navigation role").selectOption("Teacher");
  await expect(
    page.getByText("Teacher workspace", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Import game", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByLabel("Choose game manifest")).toBeVisible();
});
test("detail and settings dialogs pass automated accessibility checks", async ({
  page,
}) => {
  await page.goto("/?concept=a");
  await page
    .getByRole("button", { name: "View Graph Runner", exact: true })
    .click();
  for (const screen of ["detail", "settings"]) {
    if (screen === "settings") {
      await page.getByRole("button", { name: "Close dialog" }).click();
      await page
        .getByRole("button", { name: "Settings", exact: true })
        .first()
        .click();
    }
    const a = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      a.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.failureSummary),
      })),
    ).toEqual([]);
  }
});
test("genre, sort and list view update library results", async ({ page }) => {
  await page.goto("/?concept=b");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("button", { name: "Library", exact: true })
    .click();
  await page.getByLabel("Sort games").selectOption("A–Z");
  await expect(page.locator(".card-caption strong").first()).toHaveText(
    "Algebra Tycoon",
  );
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await expect(page.locator(".games-list")).toBeVisible();
  await page.getByLabel("Genre filter").selectOption("IT support simulator");
  await expect(page.getByRole("button", { name: /^View / })).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "View DeskFault", exact: true }),
  ).toBeVisible();
});
