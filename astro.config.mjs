// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { createGitLastmod, routeFromUrl } from "./scripts/git-lastmod.mjs";

// Pages that carry a `noindex` robots directive on the original site and must
// therefore be excluded from the generated sitemap.
const NOINDEX_PATHS = [
  "/berufshaftpflicht",
  "/lp/berufsmusiker",
  "/neue-bewertung",
];

// Real per-page modification dates, read from git. Never a build timestamp —
// see scripts/git-lastmod.mjs and wiki/aeo-rules.md §6.
const lastmodFor = createGitLastmod();

export default defineConfig({
  site: "https://musikversicherung.com",
  trailingSlash: "never",
  // Emit flat files (kontakt.html instead of kontakt/index.html) so the output
  // mirrors the existing Strato deployment and preserves every URL.
  build: { format: "file" },
  integrations: [
    sitemap({
      filter: (page) =>
        !NOINDEX_PATHS.some((p) => page.replace(/\/$/, "").endsWith(p)),
      // Pages with no trustworthy date (uncommitted, or a shallow clone) are
      // emitted without lastmod rather than with a guessed one.
      serialize: (item) => {
        const lastmod = lastmodFor(routeFromUrl(item.url));
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
