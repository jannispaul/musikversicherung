# Musikversicherung.com

Marketing website for **Musikversicherung.com** (SINFONIMA & I'M SOUND instrument
insurance), built with [Astro](https://astro.build/).

This project was migrated from a scraped Webflow export to a maintainable,
componentised Astro codebase. It renders as a fully static site and is deployed
to the Strato server via SFTP by a GitHub Actions workflow.

## Requirements

- Node.js 20+
- npm (a `package-lock.json` is committed)

## Installation

```bash
npm install
```

## Local development

```bash
npm run dev
```

Starts the Astro dev server at http://localhost:4321 with hot-reloading.

> Note: `home.js` and `reviews.js` fetch review data from the production origin
> (`https://musikversicherung.com/reviews.json` and `.../new-reviews.json`).
> Those requests fail locally (cross-origin) but work in production, where they
> are same-origin. Everything else works fully offline.

## Build

```bash
npm run build      # outputs static files to ./dist
npm run preview    # serve the built ./dist locally
```

`dist/` is a build artifact (git-ignored); it is generated in CI and never
committed.

## Deployment

Deployment is automated by **`.github/workflows/deploy.yml`**:

1. On every push to `master` (or manual `workflow_dispatch`), the workflow checks
   out the repo, installs dependencies with `npm ci`, and runs `npm run build`.
2. The generated `dist/` folder is uploaded over SFTP to the Strato server using
   [`Creepios/sftp-action`](https://github.com/Creepios/sftp-action), the same
   deployment mechanism used previously.

### Required GitHub secrets

Reused from the previous workflow — no new secrets are needed:

| Secret         | Purpose                        |
| -------------- | ------------------------------ |
| `FTP_SERVER`   | SFTP host                      |
| `FTP_USERNAME` | SFTP username                  |
| `FTP_PASSWORD` | SFTP password                  |

The upload target is `./musikversicherung/` on the server (unchanged).

## Project structure

```
.
├── astro.config.mjs        # Astro config (static output, flat file URLs, sitemap)
├── public/                 # Served as-is at the site root
│   ├── assets/…            # All Webflow images, fonts, icons, PDFs (paths preserved)
│   ├── images/og-image.jpg # Social-share image
│   ├── reviews.json        # Review data (fetched by the reviews pages)
│   ├── confetti.lottie     # Anfrage success animation
│   └── robots.txt
├── src/
│   ├── components/         # Reusable UI: BaseHead, Navbar, Footer, Logo
│   ├── layouts/
│   │   └── Layout.astro    # HTML shell: <head>, navbar, <slot/>, footer, global JS
│   ├── data/
│   │   └── site.ts         # Nav links, footer links, contact details
│   ├── partials/           # Raw per-page <main> HTML / CSS / inline JS (injected)
│   ├── pages/              # One .astro per route (mirrors the original URLs)
│   │   ├── index.astro, kontakt.astro, faqs.astro, anfrage.astro, …
│   │   ├── wissen.astro + wissen/*.astro   # blog / knowledge base
│   │   └── lp/*.astro                       # landing pages
│   ├── scripts/            # Vanilla JS modules (no jQuery, no webflow.js)
│   │   ├── params.js       # Persist & propagate query params to /anfrage (global)
│   │   ├── track.js        # umami event tracking for [data-track] (global)
│   │   ├── accordion.js    # Animated <details> accordions
│   │   ├── home.js, reviews.js, createJSONLD.js
│   │   ├── anfrage.js, calculator.js, initModals.js   # multi-step Anfrage form
│   │   ├── multi-step-form.js, file-upload.js          # Schaden-melden form
│   │   └── neue-bewertung.js                           # review submission form
│   └── styles/
│       ├── variables.css   # Design tokens (colours, type, spacing, radii, …)
│       ├── webflow.css      # Original Webflow/Client-First stylesheet (base)
│       ├── global.css       # Hoisted base styles + CSS-only mobile nav
│       └── main.css         # Imports the three files above (loaded globally)
└── .github/workflows/
    └── deploy.yml          # Build + SFTP deploy
```

### How pages are assembled

Each route is a small `.astro` file that:

1. imports the shared `Layout` (which renders `<head>` SEO/analytics, the navbar
   and the footer);
2. injects its page-specific `<main>` markup, styles and any inline scripts from
   `src/partials/`;
3. imports only the JS modules that page needs.

The navbar, footer, `<head>`/SEO handling and analytics are defined **once** as
components and shared across all 25 pages.

## Styling

The visual output is preserved exactly. The original Webflow (Client-First)
stylesheet is kept as the base in `src/styles/webflow.css`, with:

- a **design-token layer** (`variables.css`) exposing colours, typography,
  spacing, radii, shadows, breakpoints and transitions as CSS custom properties;
- **consolidated base styles** (`global.css`) that were previously duplicated as
  inline `<style>` blocks in the `<head>` of every page (fluid root font-size,
  Client-First helpers, and the CSS-only mobile navigation).

## JavaScript

All interactivity is plain modern ES modules — **no jQuery and no `webflow.js`**.
The original site's Webflow runtime was unnecessary: the mobile menu is a
CSS-only `:has()` checkbox toggle, FAQ items are native `<details>` elements
(enhanced with a small height-animation module), and there are no Webflow
sliders, tabs or IX2 interactions.

Forms submit to their existing make.com webhooks and toggle the original
`.w-form-done` / `.w-form-fail` states.

## SEO

Per-page titles, meta descriptions, canonical URLs, Open Graph and Twitter tags,
JSON-LD structured data and `robots` directives are all preserved via the
`BaseHead` component. `@astrojs/sitemap` generates `sitemap-index.xml`
(referenced from `robots.txt`), excluding the two `noindex` pages
(`/berufshaftpflicht`, `/lp/berufsmusiker`).
