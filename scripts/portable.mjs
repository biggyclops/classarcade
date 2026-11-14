import fs from "node:fs";
import path from "node:path";
const root = process.cwd(),
  dist = path.join(root, "dist");
let html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const data = (file) => {
  const ext = path.extname(file);
  const mime =
    ext === ".webp"
      ? "image/webp"
      : ext === ".woff"
        ? "font/woff"
        : "application/octet-stream";
  return `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`;
};
const assets = {};
for (const file of fs.readdirSync(path.join(dist, "art")))
  assets["/art/" + file] = data(path.join(dist, "art", file));
const jsMatch = html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/),
  cssMatch = html.match(/<link[^>]*href="([^"]+\.css)"[^>]*>/);
let js = fs
  .readFileSync(path.join(dist, jsMatch[1]), "utf8")
  .replaceAll("</script", "<\\/script");
let css = fs.readFileSync(path.join(dist, cssMatch[1]), "utf8");
css = css.replace(
  /url\((['"]?)(\/[^)'"\s]+)\1\)/g,
  (_, q, url) => `url("${assets[url] || data(path.join(dist, url))}")`,
);
html = html
  .replace(cssMatch[0], () => `<style>${css}</style>`)
  .replace(
    jsMatch[0],
    () =>
      `<script>window.__CLASSARCADE_ASSETS__=${JSON.stringify(assets)};</script><script type="module">${js}</script>`,
  );
const notices = fs
  .readFileSync(path.join(root, "docs/THIRD-PARTY-NOTICES.txt"), "utf8")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");
html = html.replace(
  "</body>",
  () =>
    `<template id="third-party-notices"><pre>${notices}</pre></template></body>`,
);
fs.writeFileSync(path.join(root, "..", "ClassArcade-Immersive.html"), html);
console.log("Portable browser prototype: ../ClassArcade-Immersive.html");
