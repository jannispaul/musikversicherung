import { creatJSONLD } from "./createJSONLD.js";
const reviewContainer = document.querySelector("[data-name='reviews']");
const averageRatingEl = document.querySelector("[data-name='average-rating']");
const reviewCountEl = document.querySelector("[data-name='review-count']");

// fetch the reviews.json file
fetch("https://musikversicherung.com/new-reviews.json")
  .then((response) => response.json()) // parse the response as JSON
  .then((data) => {
    // Create JSON LD
    const aggregatedData = data[data.length - 1];

    let schema = {
      "@context": "http://schema.org",
      "@type": "Product",
      image: "https://musikversicherung.com/images/og-image.jpg",
      name: "SINFONIMA / I'M SOUND Instrumentenversicherung",
      brand: {
        "@type": "Brand",
        name: "Mannheimer Versicherung AG",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: parseFloat(aggregatedData?.Average.replace(",", ".")),
        reviewCount: aggregatedData?.Count,
      },
      // review: reviewsArray,
      description: "Deine Instrumentenversicherung: Instrumente & Equipment einfach online versichern.",
    };
    creatJSONLD(schema);

    // loop through each review and append it to the DOM
    data.forEach((review) => {
      // Check if its the meta data
      if (review.Count && review.Average) {
        reviewCountEl.innerText = review.Count;
        averageRatingEl.innerText = review.Average;
        return;
      }
      const reviewDiv = document.createElement("div");
      reviewDiv.classList.add("reviews_item", "gradient-border");
      let color;
      const starActive = `<svg width="100%" style="" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.07088 0.612343C9.41462 -0.204115 10.5854 -0.204114 10.9291 0.612346L12.9579 5.43123C13.1029 5.77543 13.4306 6.01061 13.8067 6.0404L19.0727 6.45748C19.9649 6.52814 20.3267 7.62813 19.6469 8.2034L15.6348 11.5987C15.3482 11.8412 15.223 12.2218 15.3106 12.5843L16.5363 17.661C16.744 18.5211 15.7969 19.201 15.033 18.7401L10.5245 16.0196C10.2025 15.8252 9.7975 15.8252 9.47548 16.0196L4.96699 18.7401C4.20311 19.201 3.25596 18.5211 3.46363 17.661L4.68942 12.5843C4.77698 12.2218 4.65182 11.8412 4.36526 11.5987L0.353062 8.2034C-0.326718 7.62813 0.0350679 6.52814 0.927291 6.45748L6.19336 6.0404C6.5695 6.01061 6.89716 5.77543 7.04207 5.43123L9.07088 0.612343Z" fill="#F8C439"></path>
        </svg>`;
      const starInactive = `<svg width="100%" style="" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.07088 0.612343C9.41462 -0.204115 10.5854 -0.204114 10.9291 0.612346L12.9579 5.43123C13.1029 5.77543 13.4306 6.01061 13.8067 6.0404L19.0727 6.45748C19.9649 6.52814 20.3267 7.62813 19.6469 8.2034L15.6348 11.5987C15.3482 11.8412 15.223 12.2218 15.3106 12.5843L16.5363 17.661C16.744 18.5211 15.7969 19.201 15.033 18.7401L10.5245 16.0196C10.2025 15.8252 9.7975 15.8252 9.47548 16.0196L4.96699 18.7401C4.20311 19.201 3.25596 18.5211 3.46363 17.661L4.68942 12.5843C4.77698 12.2218 4.65182 11.8412 4.36526 11.5987L0.353062 8.2034C-0.326718 7.62813 0.0350679 6.52814 0.927291 6.45748L6.19336 6.0404C6.5695 6.01061 6.89716 5.77543 7.04207 5.43123L9.07088 0.612343Z" fill="#ddd"></path>
        </svg>`;
      let stars = "";
      for (let x = 0; x < 5; x++) {
        if (x < review.rating) {
          stars += starActive;
        } else {
          stars += starInactive;
        }
      }

      reviewDiv.innerHTML = `<div><div class="reviews_item-stars" title="${review.rating} von 5 Sternen">${stars}</div></div><div class="reviews_item-body"><p class="reviews_item-p">${review.review}</p><div class="reviews_item-name">${review.name} am ${new Date(review.date).toLocaleDateString("de-DE")}</div></div>`;
      reviewContainer.appendChild(reviewDiv);
    });
  })
  .catch((error) => console.error(error)); // handle any errors
