// Renders public/images/mv-logo.jpg from the site's own wordmark.
//
// The logo referenced by the Article schema in src/partials/**/*.inline.js was
// missing (see wiki/broken-assets.md §2). Rather than trace or approximate a
// brand asset, this derives the JPG from the authoritative source already in
// the repo: the inline SVG in src/components/Logo.astro, the same mark the
// header and footer render, with the brand colours #6B46C1 and #D6BCFA.
//
// Not part of any build. Run it by hand if the wordmark ever changes:
//   node scripts/render-logo.mjs
//
// Requires Playwright's Chromium. Where it is not installed this simply
// errors — the committed JPG is what ships, this only regenerates it.
import { readFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SOURCE = join(ROOT, "src/components/Logo.astro");
const OUT = join(ROOT, "public/images/mv-logo.jpg");

// Framing mirrors the logo file supplied by the owner (2026-08-20): white
// ground, wordmark centred, 2.56:1. Changing these changes the shipped logo.
const WIDTH = 1200;
const HEIGHT = 468;
const MARK_WIDTH = 0.73;
const QUALITY = 92;

const source = readFileSync(SOURCE, "utf8");
const match = source.match(/<svg\b[\s\S]*?<\/svg\s*>/);
if (!match) {
  console.error(`[render-logo] no <svg> found in ${SOURCE}`);
  process.exit(1);
}
const svg = match[0].replace(/<\/svg\s*>/, "</svg>");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:#fff}
  .canvas{width:${WIDTH}px;height:${HEIGHT}px;background:#fff;
          display:flex;align-items:center;justify-content:center}
  .mark{width:${Math.round(WIDTH * MARK_WIDTH)}px}
  .mark svg{display:block;width:100%;height:auto}
</style></head><body><div class="canvas"><div class="mark">${svg}</div></div></body></html>`;

// Playwright is not a project dependency — this script is a one-off, not part
// of the build. Resolve it wherever it happens to live: a local install first,
// then a global one.
async function loadChromium() {
  const candidates = ["playwright", "playwright-core"];
  for (const name of candidates) {
    try {
      return (await import(name)).chromium;
    } catch {
      /* try the next one */
    }
  }
  try {
    const { execFileSync } = await import("node:child_process");
    const globalRoot = execFileSync("npm", ["root", "-g"], {
      encoding: "utf8",
    }).trim();
    for (const name of candidates) {
      try {
        const url = pathToFileURL(join(globalRoot, name, "index.mjs")).href;
        return (await import(url)).chromium;
      } catch {
        /* try the next one */
      }
    }
  } catch {
    /* npm not available — fall through to the error below */
  }
  console.error(
    "[render-logo] Playwright not found. Install it with `npm i -D playwright`\n" +
      "              (or `npm i -g playwright`) and re-run. The committed\n" +
      "              public/images/mv-logo.jpg is unaffected either way.",
  );
  process.exit(1);
}

const chromium = await loadChromium();
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  // setContent avoids a file:// round trip, but Chromium still needs a doc URL
  // for relative resolution; there are no external refs here, so about:blank
  // is fine.
  await page.setContent(html, { waitUntil: "load" });
  const canvas = await page.$(".canvas");
  await canvas.screenshot({ path: OUT, type: "jpeg", quality: QUALITY });
} finally {
  await browser.close();
}

console.log(`[render-logo] wrote ${OUT} (${WIDTH}x${HEIGHT})`);
