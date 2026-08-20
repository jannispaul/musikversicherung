# Broken assets — files referenced by the site that do not exist

Audited 2026-08-20 across every `/assets/…` and `/images/…` reference in `src/`:
**123 unique local asset references, 3 missing.** Two are fixed; one is open.

| Asset | Referenced from | State |
| --- | --- | --- |
| `…_Empfehlungen-zu-Auslandsreisen.pdf` | `/faqs` | ✅ restored 2026-08-20 |
| `…_Tips-on-travelling-abroad.pdf` | `/faqs` | ✅ restored 2026-08-20 |
| `/images/mv-logo.jpg` | 12 pages' injected schema | ❌ open, see §2 |

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

**Recovering a deleted binary from history:**

```bash
git rev-list --objects --all | grep -i 'Auslandsreisen'   # find the blob sha
git cat-file -p <sha> > public/assets/<site-id>/<filename>
git hash-object public/assets/<site-id>/<filename>        # must equal <sha>
```

> **NOTE:** this repo is cloned **shallow** in CI and in agent sessions
> (`git rev-parse --is-shallow-repository` → `true`; `scripts/unshallow-git.mjs`
> exists because Cloudflare Pages does the same). A shallow clone here reached
> back only to 2025-09-23 — *after* the deletion — so history searches returned
> nothing and the files looked unrecoverable. **Run `git fetch --unshallow`
> before concluding anything from history.** Unshallowing also revealed two
> branches the shallow clone never fetched (`staging`,
> `strato-deploy-fallback`).

> **OPEN:** the FAQ question is misspelled — "Auslandsrei**en**" should be
> "Auslandsrei**sen**" (`src/partials/faqs.html:19`). A plain typo, but also the
> `itemprop="name"` of a `schema.org/Question` node
> ([aeo-rules.md](aeo-rules.md) §4), so it is both the visible heading and a
> machine-readable assertion. Not changed unilaterally; owner's word.

> **OPEN:** whether this guidance should also live on-site as a `/wissen` spoke
> rather than only in a PDF. [aeo-rules.md](aeo-rules.md) §1 lists "facts
> encoded only in … a PDF" as a format answer engines extract badly, and the
> English-content question is already parked as *possible, lowest priority*
> (owner ruling 2026-08-05, [recon-report.md](recon-report.md)). The restore is
> the fix; this is a separate content decision.

---

## 2. `/images/mv-logo.jpg` — twelve pages (open)

`src/partials/berufshaftpflicht.inline.js:27` and all eleven
`src/partials/wissen/*.inline.js:27` build an `Article` JSON-LD node
client-side whose `publisher.logo.url` is
`https://www.musikversicherung.com/images/mv-logo.jpg`. `public/images/`
contains only `og-image.jpg`, so the logo 404s on all twelve pages.

Unlike the PDFs, **this file is not in git history** — checked across all
branches after unshallowing. It has to be supplied or re-pointed.

Nothing visible breaks; the damage is to machine-readable truth — schema
asserting an image that does not resolve ([aeo-rules.md](aeo-rules.md) §4).

Not fixed here, because the dead logo is one symptom of a larger problem in
those same twelve files, and they should be dealt with together:

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

## Keeping this from recurring

An automated job deleted two live-linked files and nothing noticed for a year.
This command re-runs the audit — every local asset reference in `src/`, checked
against `public/`:

```bash
grep -rhoE '(/assets/|/images/)[A-Za-z0-9._/%-]+' src/ | sed 's/[),]*$//' | sort -u \
  | while read -r r; do [ -e "public$r" ] || echo "MISSING: $r"; done
```

Run it after any asset move, and before calling an asset-touching change done.

> **OPEN:** whether to wire this into `npm run prebuild` as a hard failure.
> It would have caught this on the next deploy instead of a year later. Cheap,
> but it makes the build fail on the one asset still missing (§2), so it should
> land together with the `mv-logo.jpg` resolution rather than before it.

---

*Back to [index.md](index.md). Related: [keywords.md](keywords.md) for what the
English PDF was earning, [aeo-rules.md](aeo-rules.md) §4 for the schema rules
the logo reference breaks, [recon-report.md](recon-report.md) for the other
migration 404.*
