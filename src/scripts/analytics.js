// Unified event tracking helper.
//
// Routes a named event to Cloudflare Zaraz (primary) and Umami (secondary).
// Before the domain is proxied through Cloudflare, `zaraz` is undefined; in that
// window we fall back to pushing onto `dataLayer` so a legacy GTM container (or
// Zaraz "data layer compatibility mode") still receives the event. Once Zaraz is
// live we use `zaraz.track()` directly and skip the dataLayer to avoid double
// counting.
//
// Tracking must never break the UX, so everything is wrapped defensively.
//
// @param {string} name  Event name, e.g. "lead_form_submit".
// @param {Object} [props]  Event properties, e.g. { value: 42, currency: "EUR" }.
export function trackEvent(name, props = {}) {
  try {
    if (typeof window === "undefined" || !name) return;

    if (window.zaraz && typeof window.zaraz.track === "function") {
      window.zaraz.track(name, props);
    } else {
      // Pre-Zaraz / legacy-GTM fallback.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: name, ...props });
    }

    if (typeof window.umami !== "undefined") {
      window.umami.track(name, props);
    }
  } catch (err) {
    // Swallow — analytics failures should never surface to the user.
    if (typeof console !== "undefined") console.warn("trackEvent failed", err);
  }
}

// SHA-256 → lowercase hex, via the Web Crypto API. Returns undefined if crypto
// is unavailable (e.g. non-secure context) so callers can degrade gracefully.
export async function sha256Hex(input) {
  try {
    if (!input || typeof crypto === "undefined" || !crypto.subtle) return undefined;
    const bytes = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return undefined;
  }
}

// Normalize an email the way Meta and Google both expect (trim + lowercase),
// then SHA-256 it. The resulting hash matches across Meta Custom Audiences /
// CAPI and Google Customer Match / Enhanced Conversions, so raw email never
// needs to leave the browser.
export async function hashEmail(email) {
  if (!email) return undefined;
  return sha256Hex(String(email).trim().toLowerCase());
}
