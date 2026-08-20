# Broken assets — files referenced by the site that do not exist

Three local asset paths are referenced from `src/` but have no file under
`public/`. Each one is a live 404. All three are Webflow-migration leftovers:
the markup came across, the binary did not.

Audited 2026-08-20 across every `/assets/…` and `/images/…` reference in
`src/`: **123 unique local asset references, 3 missing.** The other 120
resolve.

---

## 1. The two Auslandsreisen guides — `/faqs` (reported by owner 2026-08-20)

The FAQ answer to **"Was ist bei Auslandsreien zu beachten?"**
(`src/partials/faqs.html:19`) links to two PDFs:

| Link text | Path | State |
| --- | --- | --- |
| "diesen Ratgeber" | `/assets/63f2893134fa326a6838c84d/63f3cc4aa77037e28e189bdf_Empfehlungen-zu-Auslandsreisen.pdf` | **404** |
| "auf Englisch" | `/assets/63f2893134fa326a6838c84d/63f3cc4aa79e9b5ce26c5796_Tips-on-travelling-abroad.pdf` | **404** |

The answer consists of nothing but those two links, so the FAQ entry currently
delivers no answer at all in either language.

**Cause: the scrape never captured them.** The only PDF that exists in
`public/assets/63f2893134fa326a6838c84d/` is
`63f3cc4977b313c8cedda15b_Beschwerdeverfahren.pdf`, and the archived
pre-Astro site is identical — `origin/old-webflow-site` contains that same one
PDF under `dist/assets/` and neither Auslandsreisen file. So this predates the
Astro migration: the files were lost in the **Webflow → scraped-export** step,
not in the Astro rebuild. There is no copy in this repo's history, on either
branch.

**This is not only a broken link — it is lost ranking.** The English PDF was
an indexed, ranking URL: **6.7k impressions / 11 clicks** in the 16-month GSC
window ([keywords.md](keywords.md), English cluster row;
[recon-report.md](recon-report.md), "English demand exists"). It is the single
best-performing English asset the site has ever had, and it has been returning
404 to Google and to readers ever since the migration. Same class of
regression as the www 404 logged 2026-08-05.

**Fix: restore the two files at those exact paths.** Keeping the paths
byte-identical repairs the FAQ link *and* the indexed English URL in one move.
Do not rename them for tidiness and do not redirect them elsewhere — there is
no equivalent page to redirect to.

> **OPEN:** the owner must supply the two original PDFs. They are Mannheimer /
> SINFONIMA advisory documents about travelling abroad with an instrument
> (CITES rules for Streichinstrumente and similar). They cannot be
> reconstructed here: rewriting insurer guidance in our own words is barred by
> [CLAUDE.md](../CLAUDE.md) §4, and this environment's network egress is
> restricted, so neither the Webflow CDN nor the Wayback Machine is reachable
> to recover the originals. Until the files arrive the links stay as they are —
> a 404 is bad, but a fabricated advisory PDF on a regulated site is worse.

> **OPEN:** the FAQ question is misspelled — "Auslandsrei**en**" should be
> "Auslandsrei**sen**" (`src/partials/faqs.html:19`). It is a plain typo, not a
> wording change, but it is also the `itemprop="name"` of a
> `schema.org/Question` node ([aeo-rules.md](aeo-rules.md) §4), so it is both
> the visible heading and a machine-readable assertion. Fix it together with
> the PDF restore, on the owner's word.

> **OPEN:** whether the guidance should live on-site as a `/wissen` spoke
> rather than only in a PDF. [aeo-rules.md](aeo-rules.md) §1 lists "facts
> encoded only in … a PDF" as a format answer engines extract badly, and the
> English-content question is already parked as *possible, lowest priority*
> (owner ruling 2026-08-05, [recon-report.md](recon-report.md)). Restoring the
> PDFs is the immediate fix; this is the separate content decision.

---

## 2. `/images/mv-logo.jpg` — twelve pages

`src/partials/berufshaftpflicht.inline.js:27` and all eleven
`src/partials/wissen/*.inline.js:27` build an `Article` JSON-LD node
client-side whose `publisher.logo.url` is
`https://www.musikversicherung.com/images/mv-logo.jpg`. `public/images/`
contains only `og-image.jpg`, so the logo 404s on all twelve pages.

Nothing visible breaks; the damage is to machine-readable truth — schema
asserting an image that does not resolve ([aeo-rules.md](aeo-rules.md) §4).

Not fixed here, because the file is one symptom of a larger problem in those
same twelve `inline.js` files, and they should be dealt with together:

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
> would resolve the dead logo, the duplicate node, the host mismatch and the
> author contradiction at once. Needs the author ruling first.

---

## Keeping this from recurring

The migration dropped files and nothing noticed for months. This one command
re-runs the audit — every local asset reference in `src/`, checked against
`public/`:

```bash
grep -rhoE '(/assets/|/images/)[A-Za-z0-9._/%-]+' src/ | sed 's/[),]*$//' | sort -u \
  | while read -r r; do [ -e "public$r" ] || echo "MISSING: $r"; done
```

Run it after any asset move, and before claiming an asset-touching change is
done.

---

*Back to [index.md](index.md). Related: [keywords.md](keywords.md) for what the
English PDF was earning, [aeo-rules.md](aeo-rules.md) §4 for the schema rules
the logo reference breaks, [recon-report.md](recon-report.md) for the other
migration 404.*
