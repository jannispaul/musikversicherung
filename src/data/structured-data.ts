/**
 * schema.org JSON-LD builders, resolved at build time.
 *
 * The site emits a connected graph keyed by stable `@id`s so search engines can
 * relate the entities across pages:
 *
 *   #organization  InsuranceAgency  — the real imprint entity (site-wide)
 *   #website       WebSite          — site-wide
 *   #product       Product          — the insurance offering (home + /reviews)
 *
 * `organizationLd()` is rendered on every page via BaseHead; the page-specific
 * builders below are passed through the `jsonld` prop. Ratings come straight
 * from the live review data in `./reviews`, so nothing goes stale.
 */
import { SITE } from "./site";
import { reviews, reviewCount, averageValue, type Review } from "./reviews";

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const PRODUCT_ID = `${SITE.url}/#product`;
const LOGO_ID = `${SITE.url}/#logo`;
/**
 * The one Person node on the site. The agency's founder and the author
 * credited on every /wissen page are the same human, so they share an `@id`
 * rather than appearing as two lookalike entities (wiki/aeo-rules.md §4).
 */
export const AUTHOR_ID = `${SITE.url}/#heiner-blaskewitz`;

// The wordmark, not the 256x256 touch icon that stood here before: `logo` is
// meant to be the brand mark, and this is the same one the header and footer
// render (src/components/Logo.astro). Rendered by scripts/render-logo.mjs.
const LOGO_URL = `${SITE.url}/images/mv-logo.jpg`;
const EMAIL = "info@musikversicherung.com";

/** JSON-serialise a schema object for injection into a <script> tag. */
function ld(obj: Record<string, unknown>): string {
  return JSON.stringify(obj);
}

/** Site-relative paths become absolute; absolute URLs pass through. */
function absoluteUrl(path?: string): string | undefined {
  if (!path) return undefined;
  return path.startsWith("http") ? path : `${SITE.url}${path}`;
}

/**
 * Site-wide identity: the insurance agent (InsuranceAgency, a LocalBusiness
 * subtype) plus the WebSite node. Emitted on every page from BaseHead.
 */
export function organizationLd(): string {
  return ld({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "InsuranceAgency",
        "@id": ORG_ID,
        name: SITE.name,
        alternateName: "SINFONIMA / I'M SOUND Instrumentenversicherung",
        url: SITE.url,
        logo: { "@type": "ImageObject", "@id": LOGO_ID, url: LOGO_URL },
        image: SITE.defaultOgImage,
        telephone: SITE.phoneLabel,
        email: EMAIL,
        founder: { "@id": AUTHOR_ID },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Wennigser Str. 63",
          postalCode: "30890",
          addressLocality: "Barsinghausen",
          addressCountry: "DE",
        },
        areaServed: { "@type": "GeoShape", name: "Worldwide" },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: SITE.phoneLabel,
          email: EMAIL,
          contactType: "customer service",
          availableLanguage: ["de", "en"],
        },
        sameAs: ["https://www.facebook.com/instrumentenversicherung/"],
      },
      {
        "@type": "Person",
        "@id": AUTHOR_ID,
        name: "Heiner Blaskewitz",
        // Exactly as the author box on every /wissen article renders it.
        jobTitle: "Versicherungsfachmann (BWV)",
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE.url,
        name: SITE.name,
        inLanguage: "de",
        publisher: { "@id": ORG_ID },
      },
    ],
  });
}

function reviewNodes(list: Review[]) {
  return list.map((review) => ({
    "@type": "Review",
    author: { "@type": "Person", name: review.name },
    datePublished: review.date,
    reviewBody: review.review,
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(review.rating),
      bestRating: "5",
      worstRating: "1",
    },
  }));
}

/**
 * The two tariffs, priced as the site prices them: monthly "ab" figures.
 *
 * `minPrice` — not `price` — is what "ab 4,69 € im Monat" actually means. The
 * qualifier is part of the fact ([wiki/business-facts.md] Product), so dropping
 * it in the machine-readable copy would state a premium the product does not
 * charge.
 */
function tariffOffers() {
  const tariff = (name: string, description: string, from: string) => ({
    "@type": "Offer",
    name,
    description,
    priceCurrency: "EUR",
    url: `${SITE.url}/anfrage`,
    offeredBy: { "@id": ORG_ID },
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      minPrice: from,
      priceCurrency: "EUR",
      unitText: "Monat",
    },
  });

  return {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    // Lowest monthly premium across both tariffs; shown on the homepage as
    // "ab 4,69€ / Monat". No `highPrice`: premiums scale with the insured
    // value and no upper figure is published.
    lowPrice: "4.69",
    offerCount: 2,
    url: `${SITE.url}/anfrage`,
    offeredBy: { "@id": ORG_ID },
    offers: [
      tariff(
        "SINFONIMA Instrumentenversicherung",
        "Versicherung für klassische Instrumente",
        "4.69",
      ),
      tariff(
        "I'M SOUND Equipmentversicherung",
        "Rundumschutz für elektronische Instrumente und Musikequipment",
        "6.25",
      ),
    ],
  };
}

interface ProductLdOptions {
  /** Attach the full individual review list (heavy — only for /reviews). */
  includeReviews?: boolean;
  /**
   * Emit the tariff prices. Only true on pages that actually show them —
   * schema never asserts what the page does not display. The homepage shows
   * "ab 4,69€ / Monat"; /reviews shows no price at all.
   */
  includeOffers?: boolean;
}

/**
 * The insurance offering as a Product with its two tariffs and an
 * AggregateRating sourced from the live reviews. Google shows review snippets
 * for Product (not Service/Organization), so the rating lives here — never on
 * the Organization.
 *
 * The tariffs sit inside an `AggregateOffer`, deliberately:
 *
 *  - The published figures are "ab" (from) prices, so they are `minPrice` in a
 *    `UnitPriceSpecification`, never a definite `price`. A flat `price` would
 *    assert a fixed premium the product does not have.
 *  - `AggregateOffer` plus the absence of a definite price keeps these pages in
 *    Google's *product snippet* class (review stars, which is what we want)
 *    rather than the *merchant listing* class, which is a shopping feature that
 *    expects `shippingDetails` and `hasMerchantReturnPolicy`. Neither exists for
 *    an insurance policy, so neither may be asserted.
 *  - No `availability`: an insurance policy is not inventory.
 */
export function productLd({
  includeReviews = false,
  includeOffers = false,
}: ProductLdOptions = {}): string {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": PRODUCT_ID,
    name: "SINFONIMA / I'M SOUND Instrumentenversicherung",
    description: "Deine Versicherung für Instrumente und Equipment.",
    image: SITE.defaultOgImage,
    brand: { "@type": "Brand", name: "Mannheimer Versicherung AG" },
    category: "Musikinstrumentenversicherung",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageValue.toFixed(2),
      reviewCount: reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };

  if (includeOffers) schema.offers = tariffOffers();
  if (includeReviews) schema.review = reviewNodes(reviews);

  return ld(schema);
}

export interface Crumb {
  name: string;
  /** Absolute URL; omit for the current (last) page. */
  item?: string;
}

/** A BreadcrumbList trail. Pass the full path, root first. */
export function breadcrumbLd(trail: Crumb[]): string {
  return ld({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.item ? { item: crumb.item } : {}),
    })),
  });
}

/** One entry of a hub page's visible list. */
export interface ListedPage {
  url: string;
  name: string;
}

/**
 * The pages a hub visibly links, read out of the hub's own markup at build
 * time — never hand-maintained, so the list cannot drift from what the page
 * shows (wiki/aeo-rules.md §4, §5).
 *
 * Matches the card anchors of `src/partials/wissen.html`, in render order.
 */
export function listedPages(hubHtml: string, base = SITE.url): ListedPage[] {
  const cards = hubHtml.matchAll(
    /<a href="(\/[^"]*)"[^>]*class="wissen_item[^"]*"[^>]*>([\s\S]*?)<\/a>/g,
  );
  const pages: ListedPage[] = [];
  for (const [, href, inner] of cards) {
    const title = inner.match(/<div class="wissen_item-content"><div>([\s\S]*?)<\/div>/);
    if (!title) continue;
    pages.push({
      url: `${base}${href}`,
      name: decodeEntities(title[1].replace(/\s+/g, " ").trim()),
    });
  }
  return pages;
}

/** The handful of entities Webflow's export actually emits in card titles. */
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

interface CollectionPageLdOptions {
  name: string;
  description: string;
  /** Absolute canonical URL of the hub page. */
  url: string;
  /**
   * The articles the hub lists, from `listedPages()`. Emitted as an ordered
   * ItemList so the hub-and-spoke structure is machine-readable; every entry
   * is a link the page visibly renders, so this asserts nothing new.
   */
  lists?: ListedPage[];
}

/**
 * A CollectionPage node, for hub pages that list other pages rather than
 * carrying an article of their own.
 *
 * `/wissen` used to claim `Article` here. It is a listing: no publication
 * date, no author box, no lead image — none of the things an Article node
 * asserts, and schema states only what the page shows
 * (wiki/aeo-rules.md §4).
 */
export function collectionPageLd({
  name,
  description,
  url,
  lists,
}: CollectionPageLdOptions): string {
  return ld({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    inLanguage: "de",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    ...(lists?.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: lists.length,
            itemListElement: lists.map((page, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: page.url,
              name: page.name,
            })),
          },
        }
      : {}),
  });
}

interface ArticleLdOptions {
  headline: string;
  description: string;
  /** Absolute canonical URL of the article page. */
  url: string;
  /**
   * The article's own lead image, as written in the partial — site-relative
   * (`/assets/…`) or absolute. Falls back to the site OG image.
   *
   * Prefer the real one: the OG image is not rendered anywhere on a /wissen
   * page, and schema states what the page shows (wiki/aeo-rules.md §4).
   */
  image?: string;
  /**
   * ISO date (YYYY-MM-DD). Must match the date visibly rendered on the page
   * (the `.content_date` div) — never assert a date the page does not show.
   */
  datePublished?: string;
  /**
   * ISO date (YYYY-MM-DD). Pass only when the content actually changed after
   * publication; equal to `datePublished` says nothing and is left off
   * (wiki/aeo-rules.md §6 — never auto-bump this to look fresh).
   */
  dateModified?: string;
  /**
   * Named author. Pass the person the page credits in its "Über den Author"
   * block; omit on pages that credit no one, which attributes to the
   * organisation instead.
   */
  author?: "Heiner Blaskewitz";
}

/** An Article node, for editorial/knowledge pages like /wissen. */
export function articleLd({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}: ArticleLdOptions): string {
  return ld({
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: "de",
    image: absoluteUrl(image) ?? SITE.defaultOgImage,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: { "@id": author ? AUTHOR_ID : ORG_ID },
    publisher: { "@id": ORG_ID },
  });
}
