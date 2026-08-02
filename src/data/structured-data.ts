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

const LOGO_URL = `${SITE.url}/assets/63f2893134fa326a6838c84d/63f3e2ae508ba1ff759ac321_touchicon.png`;
const EMAIL = "info@musikversicherung.com";

/** JSON-serialise a schema object for injection into a <script> tag. */
function ld(obj: Record<string, unknown>): string {
  return JSON.stringify(obj);
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
        founder: { "@type": "Person", name: "Heiner Blaskewitz" },
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

interface ProductLdOptions {
  /** Attach the full individual review list (heavy — only for /reviews). */
  includeReviews?: boolean;
}

/**
 * The insurance offering as a Product with its two tariffs and an
 * AggregateRating sourced from the live reviews. Google shows review snippets
 * for Product (not Service/Organization), so the rating lives here — never on
 * the Organization.
 */
export function productLd({ includeReviews = false }: ProductLdOptions = {}): string {
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
    offers: [
      {
        "@type": "Offer",
        name: "SINFONIMA Instrumentenversicherung",
        description: "Versicherung für klassische Instrumente",
        price: "4.69",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${SITE.url}/anfrage`,
        offeredBy: { "@id": ORG_ID },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "4.69",
          priceCurrency: "EUR",
          unitText: "Monat",
        },
      },
      {
        "@type": "Offer",
        name: "I'M SOUND Equipmentversicherung",
        description: "Rundumschutz für elektronische Instrumente und Musikequipment",
        price: "6.25",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${SITE.url}/anfrage`,
        offeredBy: { "@id": ORG_ID },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "6.25",
          priceCurrency: "EUR",
          unitText: "Monat",
        },
      },
    ],
  };

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

interface ArticleLdOptions {
  headline: string;
  description: string;
  /** Absolute canonical URL of the article page. */
  url: string;
}

/** An Article node, for editorial/knowledge pages like /wissen. */
export function articleLd({ headline, description, url }: ArticleLdOptions): string {
  return ld({
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: "de",
    image: SITE.defaultOgImage,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  });
}
