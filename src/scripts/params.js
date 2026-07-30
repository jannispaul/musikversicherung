// Save all query parameters to localStorage
const params = new URLSearchParams(window.location.search);
params.forEach((value, key) => {
  localStorage.setItem(`qp_${key}`, value);
});

// Rebuild query string from localStorage
const storedParams = new URLSearchParams();
Object.keys(localStorage).forEach((key) => {
  if (key.startsWith("qp_")) {
    storedParams.set(key.slice(3), localStorage.getItem(key));
  }
});

// Append stored query params to all matching links
document.querySelectorAll('a[href^="/anfrage"]').forEach((link) => {
  const url = new URL(link.href, window.location.origin);
  storedParams.forEach((value, key) => {
    url.searchParams.set(key, value); // preserve or override existing values
  });
  link.href = url.toString();
});
