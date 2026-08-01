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
