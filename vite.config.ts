import { execFileSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
function buildRevision() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  try {
    return execFileSync("git", ["rev-parse", "--short=7", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "local";
  }
}

const releaseDateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "America/New_York",
});

function nextChapterRelease() {
  try {
    const [version, date] = execFileSync("git", [
      "log", "-1", "--format=%h%n%cI", "--", "next-chapter", "public/games/next-chapter", "scripts/build-next-chapter.mjs",
    ], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().split("\n");
    if (version && date) return { version, date: releaseDateFormat.format(new Date(date)) };
  } catch {
    // Source archives may have no Git history.
  }
  return null;
}

export default defineConfig({
  define: {
    __CLASSARCADE_VERSION__: JSON.stringify(buildRevision()),
    __CLASSARCADE_UPDATE_DATE__: JSON.stringify(releaseDateFormat.format(new Date())),
    __NEXT_CHAPTER_RELEASE__: JSON.stringify(nextChapterRelease()),
  },
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes("use client")
        )
          return;
        warn(warning);
      },
    },
  },
});
