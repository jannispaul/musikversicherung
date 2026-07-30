// Postbuild: inline each page's above-the-fold ("critical") CSS and defer the
// full stylesheet so it no longer blocks first paint.
//
// The site loads one ~87 KB Webflow stylesheet, render-blocking on every page.
// Beasties (the maintained `critters` fork) walks the *built* HTML, extracts the
// CSS rules that actually apply to the initial view, inlines those into <head>,
// and rewrites the <link> to load asynchronously — with a <noscript> fallback.
//
// Running on dist/ (not source) keeps Astro's hashing/minification pipeline
// intact and guarantees the extraction matches what ships. `pruneSource: false`
// leaves the full stylesheet untouched, so the async load restores every rule
// (hover states, other breakpoints, below-the-fold sections): worst case is a
// brief unstyled flash of not-yet-critical content, never a missing style.
import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";
import Beasties from "beasties";

const DIST = new URL("../dist/", import.meta.url);

const beasties = new Beasties({
  path: DIST.pathname, // resolve /_astro/*.css against the build output
  publicPath: "/",
  preload: "media", // <link media="print" onload="this.media='all'"> + <noscript>
  pruneSource: false, // keep the full external sheet so async load restores all rules
  reduceInlineStyles: false, // leave Astro's per-page inline <style> (index.css etc.) alone
  mergeStylesheets: false,
  logLevel: "warn",
});

let processed = 0;
for await (const entry of glob("**/*.html", { cwd: DIST })) {
  const file = new URL(entry, DIST);
  const html = await readFile(file, "utf8");
  const out = await beasties.process(html);
  if (out !== html) {
    await writeFile(file, out);
    processed++;
  }
}

console.log(`✅ inlined critical CSS in ${processed} page(s)`);
