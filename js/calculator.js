// Handles all calculations and conditions extending the multi-step-form script on anfrage.html
function initCalculator() {
  // Variables
  // Dom Elements
  const valueInput = document.querySelector("input[name='Gesamtwert']");
  const priceElement = document.querySelector("[data-name='price']");
  const personalOfferDisclaimer = document.querySelector("[data-name='personal']");
  const discountSection = document.querySelector("[data-name='discount-section']");
  const priceSection = document.querySelector("[data-name='price-section']");
  const insuranceButtons = document.querySelectorAll("input[name='Versicherung']");
  const intervalButtons = document.querySelectorAll("input[name='Zahlung']");
  const coverageSection = document.querySelector("[data-name='coverage-section']");

  const sinfonimaWording = document.querySelector("[data-name='sinfonima-wording']");
  const iamsoundWording = document.querySelector("[data-name='iamsound-wording']");

  const discountCodeInput = document.querySelector("[data-name='discount-code']");
  const discountPriceElement = document.querySelector("[data-name='discount-price']");

  const listDisclaimerElement = document.querySelector("[data-name='list-disclaimer']");
  const nextDisclaimerElement = document.querySelector("[data-name='next-disclaimer']");
  const secureSection = document.querySelector("[data-name='secure-section']");

  const proberaumInputs = document.querySelectorAll("[name='Proberaum']");
  const bewohntInputs = document.querySelectorAll("[name='Bewohnt']");
  const flowInputs = document.querySelectorAll("input[name='flow']");

  const requestSuccess = document.querySelector("[data-success='request']");
  const onlineSuccess = document.querySelector("[data-success='online']");
  const incompleteSuccess = document.querySelector("[data-success='incomplete']");
  const formElement = document.querySelector("form");

  // Variables
  let interval;
  let insurance;
  let value;
  let calculatedPrice;
  let discountPrice;
  let coverage;
  let enteredCode;

  coverageSection.style.display = "none";
  discountSection.style.display = "none";
  incompleteSuccess.style.display = "none";

  // Event handlers
  discountCodeInput.addEventListener("keyup", calculatePrice);
  valueInput.addEventListener("keyup", calculatePrice);
  intervalButtons.forEach((el) => el.addEventListener("input", calculatePrice));
  insuranceButtons.forEach((el) => el.addEventListener("input", calculatePrice));
  coverageSection.addEventListener("click", calculatePrice);
  // coverageSection.addEventListener("click", calculatePrice);
  secureSection.addEventListener("click", calculatePrice);
  proberaumInputs.forEach((el) => el.addEventListener("input", calculatePrice));
  bewohntInputs.forEach((el) => el.addEventListener("click", calculatePrice));
  flowInputs.forEach((el) => el.addEventListener("input", calculatePrice));

  // Main function that gets run when input changes happen
  function calculatePrice() {
    // console.log("calculating");
    interval = document.querySelector("input[name='Zahlung']:checked")?.value;
    insurance = document.querySelector("input[name='Versicherung']:checked")?.value;
    // Cleaning up dots and everything after comma
    let sanatizedValue = valueInput.value.replace(/\.(?:\d{1,2})$/, "");
    value = parseInt(sanatizedValue.replace(".", ""));

    coverage = document.querySelector("input[name='Deckung']:checked")?.value;
    enteredCode = discountCodeInput?.value;
    const codes = ["tzouitxbq21", "jntpvoe21"]; // Obfuscated using obfuscateString function below: synthswap10 and IM_SUMMIT_2023 (need to be lowercase)

    // Show / hide "Instrumente" vs Equipment
    if (insurance === "IM SOUND") {
      sinfonimaWording.style.display = "none";
      iamsoundWording.style.display = "inline";
      discountSection.style.display = "block";
    } else {
      sinfonimaWording.style.display = "inline";
      iamsoundWording.style.display = "none";
      discountSection.style.display = "none";
      // console.log("reuest");
      updateSuccessMessage("request");
    }
    if (value && insurance === "IM SOUND") {
      priceSection.style.display = "block";
    }
    // Hide if there is no value, no interval, no insurance or sinfonima is selected
    if (!value || value === 0 || !interval || !insurance || insurance === "SINFONIMA") {
      priceSection.style.display = "none";
      personalOfferDisclaimer.style.display = "none";
      coverageSection.style.display = "none";
    }

    // Sinfonima pauschal Preis
    if ((value <= 3000) & (insurance === "SINFONIMA")) {
      calculatedPrice = 53.55;
      personalOfferDisclaimer.style.display = "none";
      coverageSection.style.display = "none";
    } else if (value <= 40000 && insurance === "IM SOUND") {
      // Regular calculation
      calculatedPrice = value * 0.01785;

      // If IM SOUND over 20000€
      if (value > 20000) {
        // Show option for stationär
        coverageSection.style.display = "block";

        // Only stationär
        if (coverage === "Stationaer") {
          calculatedPrice = value * 0.00714;
        }
      } else {
        coverageSection.style.display = "none";
      }

      // If price is lower than minimum set minimum
      calculatedPrice = Math.max(calculatedPrice, 71.4);
      personalOfferDisclaimer.style.display = "none";
    } else if ((value > 40000 && insurance === "IM SOUND") || (value > 3000 && insurance === "SINFONIMA")) {
      // Hide pricesection and show personal offer disclaimer
      priceSection.style.display = "none";
      coverageSection.style.display = "none";
      personalOfferDisclaimer.style.display = "block";
    }

    // Function to obfuscate discount code
    function obfuscateString(inputString) {
      let obfuscatedString = "";
      for (let i = 0; i < inputString.length; i++) {
        let charCode = inputString.charCodeAt(i);
        obfuscatedString += String.fromCharCode(charCode + 1);
      }
      return obfuscatedString;
    }

    // Discount code validtion and forcing yearly interval
    let obfuscatedCode = obfuscateString(enteredCode.toLowerCase());

    // Check if code is valid by comparing entered code with array of possible codes
    function validateCode(codeString) {
      let codeIsValid = false;
      codes.forEach((code) => {
        if (code === codeString) {
          codeIsValid = true;
        }
      });
      return codeIsValid;
    }
    // Is true if code is valid, otherwise false
    const validCode = validateCode(obfuscatedCode);

    // If the discount code is correct
    if (validCode && insurance === "IM SOUND") {
      // If code is synthswap only yearly payment is available
      if (obfuscatedCode === codes[0]) {
        // Discount is only available on yearly paid plans
        // Selects yearly and disables the interval radio buttons
        document.querySelector("input[value='Jaehrlich']").checked = true;
        updateCustomRadioAppearence();
        // Disabled the mothly option
        intervalButtons[0].disabled = true;
        interval = "Jährlich";
        // Calculate discount price
        discountPrice = value * 0.016065;
        // Set minimum yearly discounted price
        discountPrice = Math.max(discountPrice, 23.8);
        coverageSection.style.display = "none";
      } else {
        // Replace calculated with discount price
        // coverageSection.style.display = "none";
        discountPrice = calculatedPrice * 0.9;
        discountPrice = calculateMonthlyPrice(discountPrice);
      }

      // Set discount price in HTML
      discountPriceElement.innerHTML = formatToGerman(discountPrice) + " €";
      discountPriceElement.style.display = "block";

      // Set regular price in HTML
      priceElement.innerHTML = formatToGerman(calculatedPrice) + " €";
      priceElement.style.textDecoration = "line-through";
      priceElement.style.opacity = "0.5";
    } else {
      // Enale interval radio button, hide discount price and show regular price
      intervalButtons.forEach((button) => (button.disabled = false));
      priceElement.style.textDecoration = "none";
      priceElement.style.opacity = "1";
      discountPriceElement.style.display = "none";
      discountPrice = null;
    }

    function calculateMonthlyPrice(price) {
      // Divide to monlthy price for montly payment and add 5%
      if (interval === "Monatlich" && !intervalButtons[0].disabled) {
        return (price / 12) * 1.05;
      }
      return price;
    }
    calculatedPrice = calculateMonthlyPrice(calculatedPrice);

    // Round to 2 decimal points
    calculatedPrice = Math.round(calculatedPrice * 100) / 100;

    // Set price in HTML
    priceElement.innerHTML = formatToGerman(calculatedPrice) + " €";

    // 3 Different flows for IM SOUND
    // online / online partial / request
    // Variables: DOM Elements
    const requestflowItems = document.querySelectorAll("[data-flow='request']");
    const onlineflowItems = document.querySelectorAll("[data-flow='online']");
    // For users that could finish online but choose an email offer instead
    const onlinePartialFlowItems = document.querySelectorAll("[data-flow='online-partial']");
    let flow = document.querySelector("[name='flow']:checked")?.value;

    //const flowInput = document.querySelector("input[name='flow']");
    let beitragInput = document.querySelector("input[name='Beitrag']");

    // Show online flow elements and hide request flow items
    if (value <= 20000 && insurance === "IM SOUND") {
      console.log("Flow: (potentially) online", flow, value, insurance);

      if (flow === "online") {
        console.log("Flow: fully online", flow, value, insurance);
        onlinePartialFlowItems.forEach((item) => (item.style.display = "block"));
        onlineflowItems.forEach((item) => (item.style.display = "block"));
        requestflowItems.forEach((item) => (item.style.display = "none"));
        updateSuccessMessage("online");
      } else if (flow === "online-partial") {
        console.log("Flow: online partial", flow, value, insurance);
        onlineflowItems.forEach((item) => (item.style.display = "none"));
        requestflowItems.forEach((item) => (item.style.display = "block"));
        updateSuccessMessage("request");
      }
      onlinePartialFlowItems.forEach((item) => (item.style.display = "block"));

      // Get final price
      let finalPrice = discountPrice ? discountPrice : calculatedPrice;
      // Create Beitrag input
      createBeitragInput(beitragInput, finalPrice);

      // If value is over 10.000€ show disclaimer that list must be provided
      if (value > 10000 && flow === "online") {
        listDisclaimerElement.style.display = "block";
        nextDisclaimerElement.style.display = "none";
      } else {
        listDisclaimerElement.style.display = "none";
        nextDisclaimerElement.style.display = "block";
      }
    } else {
      console.log("Flow: Request", flow, value, insurance);
      // Show request flow and hide online flow
      beitragInput && beitragInput.remove();
      // Hide all elements exclusive to full online funnel
      requestflowItems.forEach((item) => (item.style.display = "block"));
      onlinePartialFlowItems.forEach((item) => (item.style.display = "none"));
      onlineflowItems.forEach((item) => (item.style.display = "none"));
      listDisclaimerElement.style.display = "none";
      nextDisclaimerElement.style.display = "none";
      updateSuccessMessage("request");
    }

    // Check if security question are answered correctly
    let schloss = document.querySelector("[name='Schloss20mm']:checked")?.value;
    let schliesszylinder = document.querySelector("[name='Schliesszylinder']:checked")?.value;
    let sicherheitsbeschlaege = document.querySelector("[name='Sicherheitsbeschlaege']:checked")?.value;
    let pilzkopfverriegelung = document.querySelector("[name='Pilzkopfverriegelung']:checked")?.value;
    let fenster = document.querySelector("[name='Fenster']:checked")?.value;
    let proberaum = document.querySelector("[name='Proberaum']:checked")?.value;
    let bewohnt = document.querySelector("[name='Bewohnt']:checked")?.value;

    // If certain questions are answered with "Nein" then set flow to incomplete
    if ((insurance === "IM SOUND" && proberaum === "Nein" && flow === "online") || (insurance === "IM SOUND" && bewohnt === "Ja" && flow === "online")) {
      // Online Flow: Kein Proberaum or bewohnt
      createSecurityInput("sicher");
      updateSuccessMessage("online");
    } else if (proberaum === "Ja" && bewohnt === "Nein" && flow === "online") {
      if (schloss === "Nein" || schliesszylinder === "Nein" || sicherheitsbeschlaege === "Nein" || (fenster === "Ja" && pilzkopfverriegelung === "Nein")) {
        // Incomplete flow
        // console.log("incomplete");
        // flowInput.value = "incomplete";
        createSecurityInput("unsicher");
        updateSuccessMessage("incomplete");
      } else {
        // Online Flow: Proberaum is sicher
        createSecurityInput("sicher");
        updateSuccessMessage("online");
      }
    }

    // End of full online Process
  }

  function createSecurityInput(securityValue) {
    let securityInput = document.querySelector("input[name='Sicherheit']");
    // If it doesnt exist yet, create it
    if (!securityInput) {
      // Create the input element
      securityInput = document.createElement("input");
      securityInput.setAttribute("type", "hidden");
      securityInput.setAttribute("name", "Sicherheit");

      // Add the input element to the beginning of the form
      formElement.prepend(securityInput);
    }

    securityInput.value = securityValue;
  }

  // Create an input to set Beitrag
  function createBeitragInput(beitragInput, finalPrice) {
    // If it doesnt exist yet, create it
    if (!beitragInput) {
      // Create the input element
      const inputElement = document.createElement("input");
      inputElement.setAttribute("type", "hidden");
      inputElement.setAttribute("name", "Beitrag");
      inputElement.value = formatToGerman(finalPrice) + " €";

      // Add the input element to the beginning of the form
      formElement.prepend(inputElement);
    }

    beitragInput = document.querySelector("input[name='Beitrag']");
    beitragInput.value = formatToGerman(finalPrice) + " €";
  }

  // Function to format number to german
  function formatToGerman(number) {
    return number.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Get all custom radio buttons
  let customRadioButton = document.querySelectorAll(".w-radio-input");

  function updateSuccessMessage(sectionString) {
    // console.log("updating success message");
    sectionString === "request" ? (requestSuccess.style.display = "block") : (requestSuccess.style.display = "none");
    sectionString === "online" ? (onlineSuccess.style.display = "block") : (onlineSuccess.style.display = "none");
    sectionString === "incomplete" ? (incompleteSuccess.style.display = "block") : (incompleteSuccess.style.display = "none");
  }
  function setUserMeta() {
    let meta = navigator.userAgent ? navigator.userAgent : "" + navigator.oscpu ? navigator.oscpu : "";
    if (!meta) return;
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "hidden");
    inputElement.setAttribute("name", "meta");

    inputElement.setAttribute("value", meta);

    // Add the input element to the beginning of the form
    formElement.prepend(inputElement);
  }
  setUserMeta();

  // Run calculator once to show price in case data was loaded from localStorage
  calculatePrice();

  // Update the custom webflow radio buttons
  function updateCustomRadioAppearence() {
    // Update the checked ones with webflow classes
    customRadioButton.forEach((el) => (el.nextSibling.checked == true ? el.classList.add("w--redirected-checked") : el.classList.remove("w--redirected-checked")));
  }
  updateCustomRadioAppearence();
}
document.addEventListener("DOMContentLoaded", initCalculator);
