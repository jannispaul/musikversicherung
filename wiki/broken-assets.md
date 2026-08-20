# Broken assets — files referenced by the site that do not exist

Audited 2026-08-20 across every `/assets/…` and `/images/…` reference in `src/`:
3 of 123 were missing. **All three are fixed**, and the check now runs as a
build gate so the next one cannot ship (§3).

| Asset | Referenced from | State |
| --- | --- | --- |
| `…_Empfehlungen-zu-Auslandsreisen.pdf` | `/faqs` | ✅ restored from git history 2026-08-20 |
| `…_Tips-on-travelling-abroad.pdf` | `/faqs` | ✅ restored from git history 2026-08-20 |
| `/images/mv-logo.jpg` | 12 pages' injected schema | ✅ rendered from the repo wordmark 2026-08-20 |

---

## 1. The two Auslandsreisen guides — `/faqs` (fixed 2026-08-20)

The FAQ answer to **"Was ist bei Auslandsreien zu beachten?"**
(`src/partials/faqs.html:19`) consists of nothing but two PDF links, so while
the files were missing the entry delivered no answer at all in either language.

| Link text | Path |
| --- | --- |
| "diesen Ratgeber" | `/assets/63f2893134fa326a6838c84d/63f3cc4aa77037e28e189bdf_Empfehlungen-zu-Auslandsreisen.pdf` |
| "auf Englisch" | `/assets/63f2893134fa326a6838c84d/63f3cc4aa79e9b5ce26c5796_Tips-on-travelling-abroad.pdf` |

### What the files are

Genuine SINFONIMA publications, verified from the recovered files themselves
(`pdfinfo` / `pdftotext`, 2026-08-20):

- **"SINFONIMA® — Empfehlungen zu Auslandsreisen mit dem Musikinstrument",
  2., aktualisierte Auflage.** 32 pages, PDF 1.3, produced 2018-04-06.
- **"SINFONIMA® — Tips on travelling abroad with your musical instrument",
  Revised 2nd edition.** 32 pages, PDF 1.5, produced 2018-04-24.

These are the insurer's own approved documents. Nothing in them was authored
here, and nothing in them may be rewritten or summarised into site copy without
the owner's word ([CLAUDE.md](../CLAUDE.md) §4).

### Cause — an automated Webflow re-export deleted them

Both files were **added 2025-04-25** (`c238048`) and **deleted 2025-09-01
03:51 UTC** (`6834273`). Both commits are `github-actions[bot]`, both titled
"Updated site from Webflow" — the automated scrape-and-commit job that ran
against the Webflow site.

The deleting commit removed **exactly two files, and they were these two PDFs**,
while the same commit left `dist/faqs.html` still linking to both. The job
dropped the binaries and kept the markup pointing at them.

So this predates and is unrelated to the Astro migration: the Astro rebuild
simply inherited an already-broken state. **The links have been 404 since
2025-09-01 — close to a year.**

### Ranking impact

The English PDF was an indexed, ranking URL: **6.7k impressions / 11 clicks**
in the 16-month GSC window ([keywords.md](keywords.md), English cluster row;
[recon-report.md](recon-report.md), "English demand exists"). It is the best
performing English asset the site has had, and it returned 404 to Google for
most of that window.

### The fix

Both blobs survived in git history under their old `dist/assets/…` paths and
were restored to `public/assets/63f2893134fa326a6838c84d/` on 2026-08-20,
**byte-identical** (`git hash-object` matches the historical blob for both).
The paths in `src/partials/faqs.html` were not touched — keeping them
byte-identical repairs the FAQ answer and the indexed English URL together.

Verified: `npm run build` passes, both PDFs ship in `dist/assets/…`, and every
`.pdf` href in the built `dist/faqs.html` resolves against `dist/`.

The reusable recovery recipe is in §3.

> **NOTE:** this repo is cloned **shallow** in CI and in agent sessions
> (`git rev-parse --is-shallow-repository` → `true`; `scripts/unshallow-git.mjs`
> exists because Cloudflare Pages does the same). A shallow clone here reached
> back only to 2025-09-23 — *after* the deletion — so history searches returned
> nothing and the files looked unrecoverable. **Run `git fetch --unshallow`
> before concluding anything from history.** Unshallowing also revealed two
> branches the shallow clone never fetched (`staging`,
> `strato-deploy-fallback`).

**Typo fixed 2026-08-20** (owner, 2026-08-20): the FAQ question read
"Was ist bei Auslandsrei**en** zu beachten?". Corrected to "Auslandsrei**sen**"
in `src/partials/faqs.html`. It is the `itemprop="name"` of a
`schema.org/Question` node ([aeo-rules.md](aeo-rules.md) §4), so the fix
corrects the visible heading and the machine-readable assertion in one edit.
Single occurrence site-wide; no other page carried the misspelling.

> **OPEN:** whether this guidance should also live on-site as a `/wissen` spoke
> rather than only in a PDF. [aeo-rules.md](aeo-rules.md) §1 lists "facts
> encoded only in … a PDF" as a format answer engines extract badly, and the
> English-content question is already parked as *possible, lowest priority*
> (owner ruling 2026-08-05, [recon-report.md](recon-report.md)). The restore is
> the fix; this is a separate content decision.

---

## 2. `/images/mv-logo.jpg` — twelve pages (fixed 2026-08-20)

`src/partials/berufshaftpflicht.inline.js:27` and all eleven
`src/partials/wissen/*.inline.js:27` build an `Article` JSON-LD node
client-side whose `publisher.logo.url` is
`https://www.musikversicherung.com/images/mv-logo.jpg`. `public/images/`
contains only `og-image.jpg`, so the logo 404s on all twelve pages.

Nothing visible broke; the damage was to machine-readable truth — schema
asserting an image that does not resolve ([aeo-rules.md](aeo-rules.md) §4).

### The fix — rendered from the repo's own wordmark

Unlike the PDFs, this file is **not in git history** (checked across all
branches after unshallowing). The owner supplied the logo on 2026-08-20.

It was not traced or rebuilt by hand: the site already carries the wordmark as
inline SVG in `src/components/Logo.astro`, the same mark the header and footer
render, with the brand colours `#6B46C1` (Musikversicherung) and `#D6BCFA`
(.com). That SVG is the authoritative source, so `mv-logo.jpg` is rendered
straight from it — headless Chromium, white ground, mark centred at 73% width,
1200×468 (the framing and 2.56:1 ratio of the owner's supplied file), JPEG
q92. **No brand asset was invented or approximated.**

The renderer is committed as `scripts/render-logo.mjs` — not wired into any
build, run by hand if the wordmark ever changes. Re-running it reproduces the
committed JPG byte for byte (verified 2026-08-20).

> **OPEN:** if the owner's own `mv-logo.jpg` differs from this render in
> framing or dimensions, drop the original into `public/images/` and it wins.
> This is a faithful reconstruction from the authoritative vector, not a claim
> to be the original file.

### Still open — the schema around it

The dead logo was one symptom of a larger problem in those same twelve files,
and the rest of it stands:

- The node is **injected by script into `<head>` after load**, against the
  standing rule that schema is added through the builders in
  `src/data/structured-data.ts` and the page's `seo.jsonld` array
  ([aeo-rules.md](aeo-rules.md) §4).
- It duplicates the `Article` node that `articleLd()` already emits server-side
  for every `/wissen` page.
- It names **`author: Person "Heiner Blaskewitz"`**, while `articleLd()` names
  the organisation — the exact question [aeo-rules.md](aeo-rules.md) §4 records
  as an open owner decision. Two of our own nodes currently disagree about who
  wrote the page.
- It uses the **www** host, which the rest of the site canonicalises away
  ([recon-report.md](recon-report.md), Phase 0).

> **OPEN:** retire the client-injected `Article` schema in the twelve
> `inline.js` files in favour of the server-side `articleLd()` builder, which
> resolves the dead logo, the duplicate node, the host mismatch and the author
> contradiction at once. Needs the author ruling first.

---

## 3. The build gate (added 2026-08-20)

An automated job deleted two live-linked files and nothing noticed for a year.
It is now a **hard build failure**, not a habit: `scripts/check-assets.mjs`,
wired into `npm run prebuild` (owner ruling, 2026-08-20).

```
"prebuild": "node scripts/unshallow-git.mjs && node scripts/check-assets.mjs"
```

Every `/assets/…` and `/images/…` reference in `src/` must resolve to a file in
`public/`, or the build stops and names the missing path and the file that
references it. On Cloudflare Pages that means a deploy that would have shipped
a 404 fails loudly instead.

What it deliberately handles:

- **Absolute URLs.** `https://www.musikversicherung.com/images/mv-logo.jpg` in
  the `inline.js` schema is matched on its path, so it is covered too.
- **Composed paths.** `BaseHead.astro` builds the favicon and touch-icon hrefs
  from `const ASSET = "/assets/<site-id>"`. The scanner expands string prefix
  constants before matching, which is what keeps those two icons inside the
  check instead of silently unscanned. It also means the bare prefix resolves
  to a directory, which is accepted as a prefix rather than reported.
- **An empty scan is a failure.** If the scanner matches nothing at all it
  exits non-zero rather than reporting a clean site — a broken checker must not
  read as a passing one.

Verified 2026-08-20 by removing each of the favicon, one Auslandsreisen PDF and
`mv-logo.jpg` in turn: the gate failed and named the right file each time, and
passed on the clean tree (124 references).

To run it by hand: `node scripts/check-assets.mjs`.

**Recovering a deleted binary from history** (the other half of the fix):

```bash
git fetch --unshallow                                     # see the NOTE in §1
git rev-list --objects --all | grep -i '<filename>'       # find the blob sha
git cat-file -p <sha> > public/assets/<site-id>/<filename>
git hash-object public/assets/<site-id>/<filename>        # must equal <sha>
```

---

*Back to [index.md](index.md). Related: [keywords.md](keywords.md) for what the
English PDF was earning, [aeo-rules.md](aeo-rules.md) §4 for the schema rules
the logo reference breaks, [recon-report.md](recon-report.md) for the other
migration 404.*
