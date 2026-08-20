// Prebuild gate: every local asset the site references must exist in public/.
//
// Why this exists: on 2025-09-01 an automated "Updated site from Webflow"
// commit deleted two PDFs while leaving the /faqs markup still linking to
// them. Nothing noticed, and the links served 404 — including an indexed URL
// earning 6.7k impressions — for close to a year. See wiki/broken-assets.md.
//
// A missing asset is a broken page, so this fails the build rather than
// warning. Scope is deliberately narrow: absolute /assets/… and /images/…
// paths, which is how every Webflow-migrated reference in src/ is written,
// including the absolute https://…/images/… URLs in the inline.js schema.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "src");
const PUBLIC = join(ROOT, "public");

// Matches the path portion whether it stands alone (href="/images/x.jpg") or
// sits inside an absolute URL ("https://host/images/x.jpg"). The character
// class stops at quotes, spaces, commas and parens, so srcset lists and
// CSS url(...) wrappers split correctly.
const ASSET_RE = /\/(?:assets|images)\/[A-Za-z0-9._/%-]+/g;

// Some references are composed from a directory constant rather than written
// out, e.g. BaseHead.astro's `const ASSET = "/assets/<site-id>"` used as
// `${ASSET}/favicon.png`. Expanding those first is what keeps the favicon and
// touch icon inside the check instead of silently unscanned.
const PREFIX_DECL_RE =
  /\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*["'](\/(?:assets|images)\/[A-Za-z0-9._/%-]*)["']/g;

function expandPrefixes(text) {
  let out = text;
  for (const [, name, value] of text.matchAll(PREFIX_DECL_RE)) {
    out = out.split("${" + name + "}").join(value);
  }
  return out;
}

// Files that can carry a reference. Anything else in src/ is not markup.
const SCANNED = new Set([".html", ".astro", ".css", ".js", ".ts", ".json"]);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (SCANNED.has(entry.name.slice(entry.name.lastIndexOf("."))))
      out.push(full);
  }
  return out;
}

const refs = new Map(); // asset path -> Set of source files referencing it

for (const file of walk(SRC)) {
  const text = expandPrefixes(readFileSync(file, "utf8"));
  for (const match of text.matchAll(ASSET_RE)) {
    const path = match[0];
    if (!refs.has(path)) refs.set(path, new Set());
    refs.get(path).add(relative(ROOT, file));
  }
}

// A scan that finds nothing means the scanner broke, not that the site is
// clean. Treat it as a failure so it cannot pass silently.
if (refs.size === 0) {
  console.error(
    "[prebuild] asset check found no /assets/ or /images/ references at all.\n" +
      "           That means this script is broken, not that src/ is clean.",
  );
  process.exit(1);
}

const missing = [];
for (const [path, sources] of refs) {
  const onDisk = join(PUBLIC, path);
  // A match that resolves to a directory is the leftover of a prefix constant
  // (the declaration itself still matches after expansion), not a file
  // reference. A path that resolves to nothing at all is the bug we are here
  // to catch, directory or not.
  if (existsSync(onDisk)) continue;
  missing.push({ path, sources: [...sources].sort() });
}

if (missing.length > 0) {
  missing.sort((a, b) => a.path.localeCompare(b.path));
  console.error(
    `\n[prebuild] ${missing.length} referenced asset(s) missing from public/:\n`,
  );
  for (const { path, sources } of missing) {
    console.error(`  ${path}`);
    for (const source of sources) console.error(`      ← ${source}`);
  }
  console.error(
    "\n  Each of these serves a 404. Restore the file, or remove the reference.\n" +
      "  A deleted asset may still be in git history — see wiki/broken-assets.md\n" +
      "  for the recovery recipe (and note that a shallow clone hides it).\n",
  );
  process.exit(1);
}

console.log(
  `[prebuild] asset check ok — ${refs.size} referenced assets, all present`,
);
