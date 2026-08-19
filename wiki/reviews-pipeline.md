# Reviews pipeline — form to page

How a customer review gets from `/neue-bewertung` onto `/reviews` and the
homepage, and where the chain is currently broken.

The review corpus is a load-bearing asset: it feeds the count and average in
[business-facts.md](business-facts.md), the `aggregateRating` and `review`
nodes in the Product JSON-LD ([aeo-rules.md](aeo-rules.md) §4), and the trust
argument against competitors who show three testimonials
([competitors.md](competitors.md)). A frozen corpus quietly ages all three.

---

## The chain as built

1. **Form.** `/neue-bewertung` posts `Rating`, `Name`, `Review` to
   `https://automations.arise.so/webhooks/mv-review`
   (`src/partials/neue-bewertung.html:1`, submitted by fetch in
   `src/scripts/neue-bewertung.js`).
2. **Worker.** The `automations` Cloudflare Worker (separate repo, not this
   one) handles the webhook in `src/handlers/mv-review.ts`. Empty `Name` →
   `200` silently (spam filter). Otherwise it:
   a. sends the notification mail *"Neue Bewertung auf Musikversicherung.com"*
      to `info@musikversicherung.com` + `jannis@arise.so`;
   b. reads the reviews JSON from this repo via the GitHub Contents API,
      prepends the new entry (`{date, name, rating, review}`, newest first) and
      commits it to `master` as `Add review from <name>`;
   c. legacy step: dispatches `upload-to-sftp.yml` — non-fatal, and that
      workflow no longer exists here.
3. **Rebuild.** The push to `master` triggers the Cloudflare Pages build.
4. **Render.** `src/data/reviews.ts` imports `public/reviews.json` at build
   time, computes count and average, and bakes the cards and the JSON-LD into
   `/reviews` (`src/pages/reviews.astro`) and the homepage preview.

**The email is sent before the commit.** A notification mail therefore proves
only that step 2a ran — never that the review landed.

## Where it broke

The Worker writes to the path in its `GITHUB_REVIEWS_PATH` var. Pre-migration
that was `dist/reviews.json` (the Webflow-era build directory, SFTP'd to
Strato). The Astro migration moved the corpus to `public/reviews.json`
(`d4f03c2`, 2026-07-30) and the Worker repo was updated to match the same day
(`05537ba`, *"mv-review: target public/reviews.json, drop SFTP dispatch"*).

**That Worker change was never deployed.** The live Worker was last deployed
2026-06-05 (Cloudflare API `modified_on`, read 2026-08-19), so it still targets
`dist/reviews.json` — a path that is in `.gitignore` and that the Astro build
neither reads nor ships.

Confirmed by the first real review since the migration: commit `b78da23` on
`origin/master`, 2026-08-19 14:58, writes a **fresh one-entry array** to
`dist/reviews.json` (the old file having been deleted by the migration), while
`public/reviews.json` stays at 1082 entries, newest 2026-05-27, untouched since
the seed commit `5289eb7`. The notification mail for it arrived at 14:58 and
matches the Worker's `buildNotificationText` byte for byte — it came from the
Worker, **not** from Make.

Consequences:

- Reviews submitted after 2026-07-30 do not reach the site. One lost so far.
- Each submission still pushes to `master`, so Pages rebuilds for nothing.
- `dist/reviews.json` is now tracked in git despite being gitignored.

## Make scenario 1174328 — dormant, not dead

`MV.com Review 23-03-08` (`eu1.make.com/39723/scenarios/1174328`) is still
`isActive: true` (Make API, read 2026-08-19). It is webhook-triggered and the
form no longer points at it, so it does not fire — 4 lifetime executions. Its
write targets are a Google Sheet and Strato SFTP (`reviews.json` +
`new-reviews.json`), both obsolete since the move to Cloudflare Pages. It did
not produce the 2026-08-19 mail.

> **OPEN:** whether to deactivate 1174328 outright. Leaving an active scenario
> pointed at a dead host is harmless today but is a second, contradicting
> source of truth for the same corpus.

## Fixing it

Deploy the `automations` Worker from its current `master` (the code fix is
already committed there). Then, in this repo, replay the lost review into
`public/reviews.json` and untrack `dist/reviews.json`. Verify by comparing the
newest entry in `public/reviews.json` against the newest notification mail —
not by trusting that a mail arrived.

## Related

- [business-facts.md](business-facts.md) — the review count and average as
  facts, and their provenance.
- [aeo-rules.md](aeo-rules.md) — why the ratings may only assert what the page
  displays.
- `docs/anfrage-flows.md` — the sibling `/anfrage` flow through the same Worker.
