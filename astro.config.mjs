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
  // CSS pipeline runs on lightningcss (Astro 7's default minifier). It is
  // stricter than esbuild — it rejected the invalid `a:not(> *)` selector in
  // global.css, which has since been removed.
  //
  // `targets` pins a broad browser range (≈ 2018+) so lightningcss keeps the
  // vendor prefixes the migrated Webflow CSS relies on and even adds beneficial
  // ones (`-webkit-sticky` for old Safari) instead of stripping them for a
  // modern-only default. Versions are encoded as `major << 16`.
  //
  // Known, accepted delta vs the old esbuild minifier: lightningcss drops the
  // redundant `-webkit-backdrop-filter` on the two frosted-glass rules (it treats
  // the `-webkit-` + unprefixed pair as redundant, and vite's pipeline applies
  // that regardless of `targets`). Impact is negligible — only Safari < 18, and
  // only a subtle blur behind a 90%-opaque white navbar. Everything else is
  // byte-equivalent to esbuild. To restore exact parity instead, swap the block
  // below for `build: { cssMinify: "esbuild" }`.
  vite: {
    css: {
      transformer: "lightningcss",
      lightningcss: {
        targets: {
          safari: 12 << 16,
          ios_saf: 12 << 16,
          chrome: 64 << 16,
          firefox: 67 << 16,
          edge: 79 << 16,
        },
      },
    },
  },
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
