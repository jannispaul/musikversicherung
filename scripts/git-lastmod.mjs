// Per-page `lastmod` for the sitemap, derived from git's last-commit time.
//
// Google uses <lastmod> as a crawl-scheduling hint, but only from sites where
// it is consistently accurate — and it discounts the signal entirely for sites
// that bump it on every deploy. wiki/aeo-rules.md §6 says the same thing more
// strongly: an auto-bumped date is a fabrication, not an optimisation.
//
// So the date has to come from a real record of when the content changed. This
// module reads it from git, and — importantly — emits NOTHING when it cannot
// trust that record, rather than falling back to a build timestamp. A sitemap
// with no lastmod is merely uninformative; a sitemap where all 23 pages claim
// they changed at deploy time is wrong, and costs the signal permanently.
//
// Two cases where the record cannot be trusted:
//
//   1. No git (tarball checkout, no binary on PATH).
//   2. A shallow clone — every path resolves to the single fetched commit, so
//      every page would report the same date. Cloudflare Pages clones shallow
//      by default, which is why `npm run prebuild` unshallows first; see
//      scripts/unshallow-git.mjs.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

/** Run git, returning trimmed stdout, or null if git fails or is missing. */
function git(...args) {
  try {
    return execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * The files whose history counts as "this page's content changed".
 *
 * Deliberately only the page's own two sources: the `.astro` file (title,
 * description, canonical, JSON-LD) and its `.html` partial (the body copy).
 *
 * Shared layouts, components and stylesheets are excluded on purpose. Editing
 * Layout.astro does not modify the content of every page, and letting it bump
 * all 23 dates at once would recreate the auto-bump this module exists to
 * avoid — just on a slower clock. Page-specific CSS (index.css, faqs.css …) is
 * excluded for the same reason: restyling is not a content change.
 */
function sourcesFor(route) {
  const slug = route === "" ? "index" : route;
  return [`src/pages/${slug}.astro`, `src/partials/${slug}.html`].filter((rel) =>
    existsSync(path.join(ROOT, rel)),
  );
}

/** Committer date of the last commit touching `rel`, ISO 8601, or null. */
function lastCommitISO(rel) {
  // Empty stdout (not an error) means the path exists on disk but has no
  // commit yet — a new, uncommitted page. That page gets no lastmod.
  return git("log", "-1", "--format=%cI", "--", rel) || null;
}

/** `https://host/wissen/foo` → `wissen/foo`; the homepage → `""`. */
export function routeFromUrl(url) {
  return new URL(url).pathname.replace(/^\/+/, "").replace(/\/+$/, "");
}

/**
 * Build the route → lastmod lookup. Returns a function giving an ISO date
 * string, or undefined when no trustworthy date exists for that route.
 */
export function createGitLastmod() {
  if (git("rev-parse", "--git-dir") === null) {
    console.warn(
      "[sitemap] git unavailable — emitting no <lastmod>. This is the safe " +
        "fallback: a missing date beats a wrong one.",
    );
    return () => undefined;
  }

  if (git("rev-parse", "--is-shallow-repository") === "true") {
    console.warn(
      "[sitemap] shallow clone — emitting no <lastmod>, because every page " +
        "would report the same commit date. Run `git fetch --unshallow` " +
        "before building (npm run prebuild does this automatically).",
    );
    return () => undefined;
  }

  const cache = new Map();

  return (route) => {
    if (cache.has(route)) return cache.get(route);

    // Compare as instants, not strings: %cI carries the committer's local UTC
    // offset, so two dates written either side of a DST change do not sort
    // lexically. Normalise the winner to UTC for an unambiguous <lastmod>.
    const times = sourcesFor(route)
      .map(lastCommitISO)
      .filter(Boolean)
      .map((iso) => Date.parse(iso))
      .filter((t) => Number.isFinite(t));

    const lastmod = times.length
      ? new Date(Math.max(...times)).toISOString()
      : undefined;

    cache.set(route, lastmod);
    return lastmod;
  };
}
