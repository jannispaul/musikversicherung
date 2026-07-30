let slug = window.location.pathname;
let headline = document.querySelector("h1").textContent;
let description = document.querySelector('meta[name="description"]').content;
let imageSource = document.querySelector("[data-element='article-image']").src;
let date = "2024-06-12";
let dateModified = "2024-06-12";

let schema = { 
  "@context": "https://schema.org",
  "@type": "Article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.musikversicherung.com" + slug
  },
  "headline": headline,
  "description": description,  
  "image": imageSource,  
  "author": {
    "@type": "Person",
    "name": "Heiner Blaskewitz"
  },  
  "publisher": {
    "@type": "Organization",
    "name": "Musikversicherung.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.musikversicherung.com/images/mv-logo.jpg"
    }
  },
  "datePublished": date,
  "dateModified": dateModified
}

const script = document.createElement("script");
script.type = "application/ld+json";
script.text = JSON.stringify(schema);

document.getElementsByTagName('head')[0].appendChild(script);