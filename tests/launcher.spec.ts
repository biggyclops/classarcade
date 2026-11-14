import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const concept of ["a", "b", "c"]) {
  test(`${concept}: navigation, search, filters, detail and simulated launch`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/?concept=" + concept);
    await expect(page).toHaveTitle(/ClassArcade/);
    await expect(page.locator("main")).toBeVisible();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("button", { name: "Library", exact: true })
      .click();
    await page.getByPlaceholder("Search your library").fill("graph");
    await expect(
      page.getByRole("button", { name: "View Graph Runner", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "View Equation Zero", exact: true }),
    ).toHaveCount(0);
    await page.getByPlaceholder("Search your library").fill("");
    await page.getByLabel("Collection filter").selectOption("Algebra 1B");
    await expect(
      page.getByRole("button", { name: "View Graph Runner", exact: true }),
    ).toHaveCount(0);
    await page.getByLabel("Genre filter").selectOption("Space combat");
    await expect(page.getByRole("button", { name: /^View / })).toHaveCount(1);
    await page
      .getByRole("button", { name: "View Equation Zero", exact: true })
      .click();
    await expect(
      page
        .getByRole("dialog")
        .getByText("Systems of equations", { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Launch preview", exact: true })
      .click();
    await expect(page.getByText("Simulated launch complete")).toBeVisible();
    await page.getByRole("button", { name: "Back to ClassArcade" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
  test(`${concept}: responsive and accessibility`, async ({ page }) => {
    await page.goto("/?concept=" + concept);
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          html: n.html,
          summary: n.failureSummary,
        })),
      })),
    ).toEqual([]);
    for (const width of [1366, 1024, 768, 390]) {
      await page.setViewportSize({ width, height: 844 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `overflow at ${width}`,
      ).toBeTruthy();
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    expect(
      (await page.locator(".constellation").count()) === 0 ||
        (await page
          .locator(".constellation")
          .evaluate((el) => getComputedStyle(el, "::before").animationName)) ===
          "none",
    ).toBeTruthy();
  });
}
test("favorites and collections persist across concepts", async ({ page }) => {
  await page.goto("/?concept=a");
  await page
    .getByRole("button", { name: "Favorite Graph Runner", exact: true })
    .click();
  await page.getByRole("button", { name: "Favorites", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "View Graph Runner", exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Favorites", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "View Graph Runner", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Create collection", exact: true })
    .click();
  await page.getByLabel("Collection name").fill("Friday favorites");
  await page
    .getByRole("dialog")
    .getByText("Graph Runner", { exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Create collection", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /PERSONAL COLLECTION Friday favorites/ }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Create collection", exact: true })
    .click();
  await page.getByLabel("Collection name").fill("Friday favorites");
  await page
    .getByRole("dialog")
    .getByText("Graph Runner", { exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Create collection", exact: true })
    .click();
  await expect(page.getByRole("alert")).toHaveText(
    "Choose a unique collection name.",
  );
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page
    .getByRole("button", { name: "B Immersive Gaming", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("button", { name: "Collections", exact: true })
    .click();
  await page
    .getByRole("button", { name: /PERSONAL COLLECTION Friday favorites/ })
    .click();
  await expect(page.getByRole("button", { name: /^View / })).toHaveCount(1);
});
test("manifest validation, import, preferences and teacher navigation", async ({
  page,
}) => {
  await page.goto("/?concept=a");
  await page
    .getByRole("button", { name: "Import a game", exact: true })
    .click();
  await page.getByLabel("Choose game manifest").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"title":7}'),
  });
  await expect(page.getByRole("alert")).toContainText("valid JSON");
  await page.getByLabel("Choose game manifest").setInputFiles({
    name: "demo.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"title":"Orbit Demo","version":"1.0.0"}'),
  });
  await page.getByRole("button", { name: "Add to local library" }).click();
  await expect(page.getByText("Orbit Demo", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Settings", exact: true })
    .first()
    .click();
  await page.getByRole("switch", { name: "Reduced motion" }).check();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.reload();
  await expect(page.locator(".app")).toHaveClass(/reduce-motion/);
  await page.getByLabel("Navigation role").selectOption("Teacher");
  await expect(
    page.getByText("Teacher workspace", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Assign classroom").selectOption("Algebra 1A");
  await expect(
    page.getByText("Assigned to Algebra 1A · simulated"),
  ).toBeVisible();
});
test("keyboard focus, dialog dismissal and comparison page", async ({
  page,
}) => {
  await page.goto("/?concept=a");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(page.getByPlaceholder("Search your library")).toBeFocused();
  await page
    .getByRole("button", { name: "View Graph Runner", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "View Graph Runner", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Compare", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Three ways to press play." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Explore concept/ }),
  ).toHaveCount(3);
});
