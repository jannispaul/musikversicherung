// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Pages that carry a `noindex` robots directive on the original site and must
// therefore be excluded from the generated sitemap.
const NOINDEX_PATHS = ["/berufshaftpflicht", "/lp/berufsmusiker"];

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
    }),
  ],
});
