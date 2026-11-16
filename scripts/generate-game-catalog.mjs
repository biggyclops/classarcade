import { readdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("public/games");
const output = path.resolve("src/generated-games.json");
const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
const games = [];
// Retain saved favorites/progress when another folder is added to the library.
const previous = JSON.parse(await readFile(output, "utf8").catch(() => "[]"));
const previousIds = new Map(previous.map((game) => [game.launchUrl, game.id]));
let nextId = Math.max(999, ...previous.map((game) => game.id)) + 1;

for (const entry of entries.filter((item) => item.isDirectory() && !item.name.startsWith("_"))) {
  const folder = path.join(root, entry.name);
  try {
    await access(path.join(folder, "index.html"));
    const manifest = JSON.parse(await readFile(path.join(folder, "game.json"), "utf8"));
    if (!manifest.title || !manifest.skill) throw new Error("title and skill are required");
    games.push({
      id: previousIds.get(`/games/${entry.name}/index.html`) ?? nextId++,
      title: String(manifest.title),
      short: String(manifest.short || manifest.title).toUpperCase(),
      genre: String(manifest.genre || "Browser game"),
      skill: String(manifest.skill),
      description: String(manifest.description || "A classroom browser game."),
      color: String(manifest.color || "#85c9bb"),
      time: String(manifest.time || "10 min"),
      progress: 0,
      classroom: Array.isArray(manifest.classroom) ? manifest.classroom.map(String) : [],
      cover: manifest.cover ? `/games/${entry.name}/${manifest.cover}` : undefined,
      launchUrl: `/games/${entry.name}/index.html`,
    });
  } catch (error) {
    console.warn(`Skipping games/${entry.name}: ${error.message}`);
  }
}

await writeFile(output, `${JSON.stringify(games, null, 2)}\n`);
console.log(`Discovered ${games.length} drop-in game${games.length === 1 ? "" : "s"}.`);
