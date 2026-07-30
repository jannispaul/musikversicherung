// Fire a named umami event for every element carrying a [data-track] attribute.
// Previously an inline <script> duplicated on every page; now loaded once globally.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-track]").forEach((element) => {
    if (typeof umami !== "undefined") {
      umami.track(element.getAttribute("data-track"));
    }
  });
});
