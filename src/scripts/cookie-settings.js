// Footer "Cookie-Einstellungen" button.
//
// Reopens the Cookiebot consent dialog so visitors can review or change their
// choices. This replaces Cookiebot's persistent floating badge, which is hidden
// via `#CookiebotWidget` in `global.css`. `Cookiebot` is loaded site-wide in
// BaseHead.astro; we guard on it in case consent scripts are blocked.
document.querySelectorAll("[data-cookie-settings]").forEach((button) => {
  button.addEventListener("click", () => {
    if (window.Cookiebot && typeof window.Cookiebot.renew === "function") {
      window.Cookiebot.renew();
    }
  });
});
