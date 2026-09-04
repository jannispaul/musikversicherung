// Sticky mobile CTA behaviour.
//
// Reveal the floating "Jetzt anfragen" button once the page hero has scrolled
// out of view, and hide it again when the hero scrolls back in. This is a no-op
// on pages without a `.section_home-header` hero, so the button only appears on
// the home and landing pages. Positioning, breakpoints and the slide/fade
// transition live in `global.css`.
const cta = document.querySelector("[data-sticky-cta]");
const hero = document.querySelector(".section_home-header");

if (cta && hero && "IntersectionObserver" in window) {
  const link = cta.querySelector("a");

  // Only enable (and only ever display, per the mobile media query) once we
  // know there is a hero to react to.
  cta.classList.add("is-active");

  const setVisible = (visible) => {
    cta.classList.toggle("is-in", visible);
    cta.setAttribute("aria-hidden", visible ? "false" : "true");
    if (link) link.tabIndex = visible ? 0 : -1;
  };

  const observer = new IntersectionObserver(
    ([entry]) => setVisible(!entry.isIntersecting),
    { threshold: 0 }
  );
  observer.observe(hero);
}
