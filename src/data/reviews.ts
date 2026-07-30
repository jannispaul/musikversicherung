/**
 * Static review data, resolved at build time.
 *
 * Reviews used to be fetched client-side from `/reviews.json`. With the Astro
 * migration they are now baked into the HTML at build: this module reads
 * `public/reviews.json` (the same file the mv-review automation prepends new
 * reviews to), computes the aggregate rating, and exposes helpers to render
 * the review cards and the schema.org JSON-LD.
 *
 * `public/reviews.json` is newest-first, shape: { date, name, rating, review }.
 */
import reviewsData from "../../public/reviews.json";

export interface Review {
  date: string;
  name: string;
  rating: number | string;
  review: string;
}

export const reviews: Review[] = reviewsData as Review[];

export const reviewCount = reviews.length;

const ratingSum = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);

/** Numeric average, e.g. 4.96 */
export const averageValue = reviewCount ? ratingSum / reviewCount : 0;

/** German-formatted average for display, e.g. "4,96" */
export const averageDisplay = averageValue.toFixed(2).replace(".", ",");

const STAR_ACTIVE = `<svg width="100%" style="" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.07088 0.612343C9.41462 -0.204115 10.5854 -0.204114 10.9291 0.612346L12.9579 5.43123C13.1029 5.77543 13.4306 6.01061 13.8067 6.0404L19.0727 6.45748C19.9649 6.52814 20.3267 7.62813 19.6469 8.2034L15.6348 11.5987C15.3482 11.8412 15.223 12.2218 15.3106 12.5843L16.5363 17.661C16.744 18.5211 15.7969 19.201 15.033 18.7401L10.5245 16.0196C10.2025 15.8252 9.7975 15.8252 9.47548 16.0196L4.96699 18.7401C4.20311 19.201 3.25596 18.5211 3.46363 17.661L4.68942 12.5843C4.77698 12.2218 4.65182 11.8412 4.36526 11.5987L0.353062 8.2034C-0.326718 7.62813 0.0350679 6.52814 0.927291 6.45748L6.19336 6.0404C6.5695 6.01061 6.89716 5.77543 7.04207 5.43123L9.07088 0.612343Z" fill="#F8C439"></path></svg>`;
const STAR_INACTIVE = `<svg width="100%" style="" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.07088 0.612343C9.41462 -0.204115 10.5854 -0.204114 10.9291 0.612346L12.9579 5.43123C13.1029 5.77543 13.4306 6.01061 13.8067 6.0404L19.0727 6.45748C19.9649 6.52814 20.3267 7.62813 19.6469 8.2034L15.6348 11.5987C15.3482 11.8412 15.223 12.2218 15.3106 12.5843L16.5363 17.661C16.744 18.5211 15.7969 19.201 15.033 18.7401L10.5245 16.0196C10.2025 15.8252 9.7975 15.8252 9.47548 16.0196L4.96699 18.7401C4.20311 19.201 3.25596 18.5211 3.46363 17.661L4.68942 12.5843C4.77698 12.2218 4.65182 11.8412 4.36526 11.5987L0.353062 8.2034C-0.326718 7.62813 0.0350679 6.52814 0.927291 6.45748L6.19336 6.0404C6.5695 6.01061 6.89716 5.77543 7.04207 5.43123L9.07088 0.612343Z" fill="#ddd"></path></svg>`;

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function starsFor(rating: number): string {
  let out = "";
  for (let i = 0; i < 5; i++) out += i < rating ? STAR_ACTIVE : STAR_INACTIVE;
  return out;
}

const dateFormatter = new Intl.DateTimeFormat("de-DE");
function formatDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : dateFormatter.format(parsed);
}

/**
 * Render the review cards as an HTML string, byte-compatible with the markup
 * the old client-side `reviews.js` produced.
 */
export function renderReviewItems(list: Review[] = reviews): string {
  return list
    .map((review) => {
      const rating = Number(review.rating) || 0;
      return `<div class="reviews_item gradient-border"><div><div class="reviews_item-stars" title="${rating} von 5 Sternen">${starsFor(
        rating,
      )}</div></div><div class="reviews_item-body"><p class="reviews_item-p">${escapeHtml(
        review.review,
      )}</p><div class="reviews_item-name">${escapeHtml(review.name)} am ${formatDate(
        review.date,
      )}</div></div></div>`;
    })
    .join("");
}

interface JsonLdOptions {
  /** Include the individual reviews array (heavy). Defaults to true. */
  includeReviews?: boolean;
}

/**
 * schema.org Product JSON-LD with an AggregateRating and (optionally) the
 * individual Review entries. Returned as a JSON string ready for injection.
 */
export function reviewsJsonLd(
  list: Review[] = reviews,
  { includeReviews = true }: JsonLdOptions = {},
): string {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    image: "https://musikversicherung.com/images/og-image.jpg",
    name: "SINFONIMA / I'M SOUND Instrumentenversicherung",
    brand: { "@type": "Brand", name: "Mannheimer Versicherung AG" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageValue.toFixed(2),
      reviewCount: reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    description: "Deine Versicherung für Instrumente und Equipment.",
  };

  if (includeReviews) {
    schema.review = list.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      datePublished: review.date,
      reviewBody: review.review,
      reviewRating: {
        "@type": "Rating",
        bestRating: "5",
        ratingValue: String(review.rating),
        worstRating: "1",
      },
    }));
  }

  return JSON.stringify(schema);
}
