import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
const output = path.resolve("..");
fs.copyFileSync(
  path.join(output, "ClassArcade-review.html"),
  "dist/review.html",
);
fs.mkdirSync(path.join(output, "review-screenshots"), { recursive: true });
const b = await chromium.launch({
  ...(fs.existsSync("/usr/bin/chromium")
    ? { executablePath: "/usr/bin/chromium" }
    : {}),
  headless: true,
  args: ["--no-sandbox"],
});
const results = [];
for (const c of ["a", "b", "c"]) {
  const context = await b.newContext({
    viewport: { width: 1366, height: 768 },
  });
  const p = await context.newPage();
  const cd = await context.newCDPSession(p);
  await cd.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await p.addInitScript(() => {
    window.__metrics = { lcp: 0, cls: 0 };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__metrics.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        if (!e.hadRecentInput) window.__metrics.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await p.goto("http://localhost:4173/?concept=" + c);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1400);
  results.push({
    concept: c,
    ...(await p.evaluate(() => {
      const n = performance.getEntriesByType("navigation")[0];
      return {
        ...window.__metrics,
        domContentLoaded: n.domContentLoadedEventEnd,
        load: n.loadEventEnd,
        resources: performance.getEntriesByType("resource").length,
        transferBytes: performance
          .getEntriesByType("resource")
          .reduce((s, r) => s + r.transferSize, 0),
        heapBytes: performance.memory?.usedJSHeapSize,
      };
    })),
    errors,
  });
  await context.close();
}
const p = await b.newPage({ viewport: { width: 1366, height: 768 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
await p.route("**/*", (r) =>
  r.request().url() === "http://localhost:4173/review.html"
    ? r.continue()
    : r.abort(),
);
await p.goto("http://localhost:4173/review.html");
await p
  .getByRole("button", { name: "B Immersive Gaming", exact: true })
  .click();
await p.getByRole("button", { name: "C Next Generation", exact: true }).click();
await p.getByRole("button", { name: "Compare", exact: true }).click();
await p.screenshot({
  path: path.join(output, "review-screenshots/comparison.png"),
  fullPage: true,
});
console.log("Portable self-contained HTML:", {
  title: await p.title(),
  errors,
  externalResources: await p.evaluate(
    () =>
      performance
        .getEntriesByType("resource")
        .filter((r) => r.name.startsWith("http")).length,
  ),
});
fs.writeFileSync(
  path.join(output, "performance-results.json"),
  JSON.stringify(
    {
      environment:
        "Chromium headless on Linux, 1366x768, 4x CPU slowdown, localhost without network throttling. Single cold browser context per concept; not physical Chromebook benchmark.",
      results,
      portable: { errors },
    },
    null,
    2,
  ),
);
console.log(results);
await b.close();
