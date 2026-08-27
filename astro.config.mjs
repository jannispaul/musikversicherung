// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { createGitLastmod, routeFromUrl } from "./scripts/git-lastmod.mjs";

// Paths excluded from the generated sitemap. A sitemap should list only
// canonical, indexable URLs, so this covers two cases:
//   - noindex pages (`/berufshaftpflicht`, `/neue-bewertung`);
//   - `/lp/berufsmusiker`, which is crawlable (index,follow) but cross-canonical
//     to `/lp/sinfonima` — advertising a non-canonical URL in the sitemap would
//     send Search Console a mixed signal.
// The robots `noindex` meta itself is set per-page via `seo.robots`, not here.
const SITEMAP_EXCLUDE_PATHS = [
  "/berufshaftpflicht",
  "/neue-bewertung",
  "/lp/berufsmusiker",
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
        !SITEMAP_EXCLUDE_PATHS.some((p) => page.replace(/\/$/, "").endsWith(p)),
      // Pages with no trustworthy date (uncommitted, or a shallow clone) are
      // emitted without lastmod rather than with a guessed one.
      serialize: (item) => {
        const lastmod = lastmodFor(routeFromUrl(item.url));
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
