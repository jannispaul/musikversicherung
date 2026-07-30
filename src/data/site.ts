/** Site-wide constants shared across layout, navigation and footer. */
export const SITE = {
  url: "https://musikversicherung.com",
  name: "Musikversicherung.com",
  /** Default social share image (kept identical to the original meta tags). */
  defaultOgImage: "https://musikversicherung.com/images/og-image.jpg",
  phoneLabel: "+49 172 511 3611",
  phoneHref: "tel:+491725113611",
} as const;

/** Primary navigation, in the original order. */
export const NAV_LINKS = [
  { href: "/wissen", label: "Wissen" },
  { href: "/faqs", label: "FAQ" },
  { href: "/schaden-melden", label: "Schaden melden" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

/** Footer "Links" column. */
export const FOOTER_LINKS = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/versicherungsbedingungen", label: "Versicherungsbedingungen" },
  {
    href: "/assets/63f2893134fa326a6838c84d/63f3cc4977b313c8cedda15b_Beschwerdeverfahren.pdf",
    label: "Beschwerden",
  },
] as const;

/**
 * Numeric-entity–obfuscated `info@musikversicherung.com` mailto anchor, copied
 * verbatim from the original site to preserve its anti-scraping behaviour.
 */
export const OBFUSCATED_EMAIL_LINK =
  '<a href="mailto:&#105&#110&#102&#111&#64&#109&#117&#115&#105&#107&#118&#101&#114&#115&#105&#99&#104&#101&#114&#117&#110&#103&#46&#99&#111&#109" title="&#105&#110&#102&#111&#64&#109&#117&#115&#105&#107&#118&#101&#114&#115&#105&#99&#104&#101&#114&#117&#110&#103&#46&#99&#111&#109">&#105&#110&#102&#111&#64&#109&#117&#115&#105&#107&#118&#101&#114&#115&#105&#99&#104&#101&#114&#117&#110&#103&#46&#99&#111&#109</a>';
