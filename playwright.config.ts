import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
export default defineConfig({
  testDir: "./tests",
  workers: 1,
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile: fileURLToPath(
          new URL("../test-results.json", import.meta.url),
        ),
      },
    ],
  ],
  use: {
    baseURL: process.env.CLASSARCADE_URL || "http://localhost:5173",
    launchOptions: {
      ...(existsSync("/usr/bin/chromium")
        ? { executablePath: "/usr/bin/chromium" }
        : {}),
      args: ["--no-sandbox"],
    },
    viewport: { width: 1366, height: 768 },
  },
  outputDir: tmpdir() + "/classarcade-playwright",
});
