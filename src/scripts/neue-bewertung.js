// Custom submit handler for the "Neue Bewertung" (review) form.
// Submits via fetch to the automations webhook and toggles success/error states.
import { trackEvent } from "./analytics.js";

let form = document.querySelector("form");
const formContent = document.querySelector("[data-name='form']");
const successEl = document.querySelector("[data-name='success']");
const errorEl = document.querySelector("[data-name='error']");
let requestUrl = form.action;

form.addEventListener("submit", function (event) {
  console.log(event);
  event.preventDefault();
  let formData = new FormData(form);

  const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  fetch(requestUrl, requestOptions)
    .then(function (response) {
      // If response is ok
      if (response.ok) {
        // console.log("fetch response ok");
        formContent.style.display = "none";
        errorEl.style.display = "none";
        successEl.style.display = "block";

        // Engagement signal only — do NOT map this to a Meta/GA ad conversion.
        trackEvent("review_submit");
      }
    }) // If there is an error log it to console and reidrect to fehler page
    ["catch"](function (error) {
      //   console.error("Error: ", error);
      formContent.style.display = "block";
      errorEl.style.display = "block";
      successEl.style.display = "none";
    });
});