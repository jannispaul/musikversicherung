export function creatJSONLD(schema) {
  // Create a script tag
  const script = document.createElement("script");

  // Set the type attribute to "application/ld+json"
  script.setAttribute("type", "application/ld+json");

  script.textContent = JSON.stringify(schema);

  // Get the head element
  const head = document.querySelector("head");

  // Append the script tag to the head
  head.appendChild(script);
}
