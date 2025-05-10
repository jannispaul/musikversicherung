import { initModals } from "./initModals.js";

// Used on anfrage.html
// Modified multi-step-form script

(function () {
  // window.addEventListener("DOMContentLoaded", (event) => {
  //
  // Variables
  // DOM Elements
  //
  const form = document.querySelector("[data-form='multi-step'] form");
  const formName = form.dataset.name;
  const steps = document.querySelectorAll("[data-form='step']");
  const success = document.querySelector("[data-form='success']");
  const errorElement = document.querySelector("[data-form='error']");
  //  const backButtons = document.querySelectorAll("[data-form='back-btn']");
  const nextButtons = document.querySelectorAll("[data-form='next-btn']");
  const submitButtons = document.querySelectorAll("[data-form='submit-btn']");
  const stepIndicators = document.querySelectorAll("[data-form='step-indicator']");

  // These element get evaluated
  const conditionHolderElements = document.querySelectorAll("[data-condition-name]");
  // These elementes get shown / hidden
  const conditionalElements = document.querySelectorAll("[data-condition-el]");
  const repeatableItem = document.querySelector("[data-repeat='item']");
  // const addRepeatableButton = document.querySelectorAll(
  //   "[data-repeat='add-item']"
  // );
  // const deleteRepeatableButton = document.querySelectorAll(
  //   "[data-repeat='delete-item']"
  // );

  // Start at the first step
  let currentStep = 0;

  //
  // Functions
  //

  // Chech if element is visble (does not work on fixed elements)
  function isVisible(el) {
    return !(el.offsetParent === null);
    // return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  // Find items in array that have the same name tag
  function isOneChecked(array, name) {
    return array.find((item) => {
      return item.name === name && item.checked;
    });
  }
  // Make sure all conditional logic is displayed correctely
  function updateLogic() {
    conditionHolderElements.forEach((el) => {
      updateConditionalElements(el);
    });
  }

  // Show active step and update step indicator
  function showActiveStep(params) {
    steps.forEach((el, index) => {
      index === currentStep ? (el.style.display = "block") : (el.style.display = "none");
      index === currentStep ? stepIndicators[index]?.classList.add("active") : stepIndicators[index]?.classList.remove("active");
    });
    // form.scrollIntoView();
    window.scrollTo({ top: 0 });

    // Make sure all conditional fields are displayed correctely
    updateLogic();
    // Validate step in the background
    validateStepWithoutOverlays();
  }

  // Validate the current step
  function validateStep(hideValidationOverlays = false) {
    let isValid = true;

    // Get all required inputs, textareas and selects
    const requiredFields = Array.from(steps[currentStep].querySelectorAll("input[required], textarea[required], select[required]"));

    // Loop over requiered fields
    for (let i = 0; i < requiredFields.length; i++) {
      // Only validate if visible
      if (!isVisible(requiredFields[i])) continue;

      // Trigger browser validity check
      const fieldIsValid = hideValidationOverlays ? requiredFields[i].checkValidity() : requiredFields[i].reportValidity();

      // Field is invalid stop
      if (!fieldIsValid) return (isValid = false);
    }
    return isValid;
  }

  function validateStepWithoutOverlays(params) {
    // console.log("validate silent");
    const hideValidationOverlays = true;
    if (!validateStep(hideValidationOverlays)) {
      nextButtons.forEach((button) => button.classList.add("disabled"));
      submitButtons?.forEach((button) => button.classList.add("disabled"));
    } else {
      nextButtons.forEach((button) => button.classList.remove("disabled"));
      submitButtons?.forEach((button) => button.classList.remove("disabled"));
    }
  }

  // Hide all elements with data-condition attribute
  function hideConditionalElements() {
    conditionalElements.forEach((el) => (el.style.display = "none"));
  }

  // Go to previous step
  function prevStep() {
    currentStep > 0 && currentStep--;
    showActiveStep();
  }
  // Go to next step
  function nextStep() {
    // Dont go if fields are invalid
    if (!validateStep()) return;

    currentStep < steps.length && currentStep++;
    showActiveStep();
  }

  function addInstrumentsToFormData(formData) {
    let instrumentNodes = document.querySelectorAll("[data-repeat='item']");
    //   let instrumentData = [];
    let instrumentsString = "";
    //   var materials = $("input[name*=material]");
    instrumentNodes.forEach((el, index) => {
      const name = el.querySelector("[name*='Instrument']")?.value;
      const value = el.querySelector("[name*='Instrumentenwert']")?.value;
      const valueType = el.querySelector("[name*='Wertart']:checked")?.value;
      if (name && value && valueType) {
        instrumentsString += name + "\n" + valueType + "\n" + value + "\n\n";
      }
    });
    //   formData.append("Instruments", JSON.stringify(instrumentData));
    formData.append("Instruments", instrumentsString);
    return formData;
  }

  // Submit form
  function submitForm(e) {
    //   e.preventDefault();

    let formData = new FormData(form);

    // Dont submit if fields are invalid
    if (!validateStep()) return;

    addInstrumentsToFormData(formData);

    // Display the key/value pairs
    // for (const pair of formData.entries()) {
    //   console.log(`${pair[0]}, ${pair[1]}`);
    // }

    const status = document.querySelector("[data-form='submit']");
    if (status) {
      status.innerHTML = "Sendet...";
      status.disabled = true; // Add form .submitting state class for styling
    }

    // Submit object as json
    const requestOptions = {
      method: "POST",
      // "Content-Type": "application/json",
      // body: JSON.stringify(formData),
      body: formData,
      redirect: "follow",
    };

    const requestUrl = form.action; // Get action url

    //   formData.getAll("files").forEach((file, index) => {
    //     if (index > 9) return;
    //     formData.append("file-" + index, file);
    //   });
    // console.log(formData.get("files"));

    fetch(requestUrl, requestOptions)
      .then(async function (response) {
        // If response is ok
        if (response.ok) {
          // console.log("fetch response ok");
          form.style.display = "none";
          errorElement.style.display = "none";
          success.style.display = "block";

          // Clear saved formdata from localstorage
          localStorage.removeItem(formName);

          window.scrollTo({ top: 0, behavior: "smooth" });
          // Custom success, needs to be after the scroll with slight delay
          // Otherwise the animation wont play ( dotlottie intersection observer)
          setTimeout(() => {
            playSuccessLottie(); //
          }, 300);
        }
      }) // If there is an error log it to console and reidrect to fehler page
      ["catch"](function (error) {
        console.error("Error: ", error);
        success.style.display = "none";
        errorElement.style.display = "block";
      });
  }

  // Docs: https://github.com/LottieFiles/dotlottie-web/blob/main/packages/wc/README.md
  function playSuccessLottie() {
    const lotties = document.querySelectorAll("dotlottie-wc");
    lotties.forEach((lottie) => {
      console.log("play lottie", lottie, lottie.dotLottie);
      lottie.style.opacity = 1;
      lottie.dotLottie.play();
    });
    setTimeout(() => {
      lotties.forEach((lottie) => {
        lottie.dotLottie.play();
      });
    }, 3600);
  }

  // Conversion data needs to be added before sumbit since google tag manager liststens for click on button, not submit event
  submitButtons.forEach((button) => {
    button.addEventListener("focus", () => {
      console.log("focused"); // only triggered on focus
      addConversionData();
    });

    button.addEventListener("mouseover", () => {
      console.log("mouse over"); // triggered on hover
      addConversionData();
    });
  });

  /**
   * Adds conversion data to the global dataLayer object for analytics.
   *
   * This function calculates the lead value based on form data and pushes an event
   * to the dataLayer for tracking purposes. It uses the 'Email' and 'Versicherung'
   * fields from the formData to determine the specific insurance type and calculate
   * the lead value accordingly. The calculated lead value, along with the email, is
   * added to the dataLayer under the event name 'lead_form_submit'.

   */

  function addConversionData() {
    let formData = new FormData(form);
    if (!window.dataLayer || !formData) return;

    const email = formData.get("Email");
    const insurance = formData.get("Versicherung");
    let sinfonimaValue = 0;
    let imsoundValue = formData.get("Gesamtwert");
    const provisionFactor = 0.12; // 12% provision

    formData.entries().forEach((entry) => {
      // console.log(entry[0], entry[1]);
      if (entry[0].includes("Instrumentenwert")) {
        sinfonimaValue += parseInt(entry[1]);
      }
    });

    let value = insurance === "SINFONIMA" ? sinfonimaValue : imsoundValue;
    // Versicherungssumme grob ist abhängig von der Versicherungssumme und Versicherungstyp
    let insuranceFactor = insurance === "SINFONIMA" || value > "50000" ? 0.012 : 0.015;

    // Sum up all values in values array
    let leadValue = value * insuranceFactor * provisionFactor || 0;
    console.log("leadValue", leadValue, insuranceFactor, value);

    window.dataLayer.push({
      event: "lead_form_submit",
      "lead-value": Math.round(leadValue * 100) / 100,
      email: email,
    });
  }
  //
  // Conditional logic
  //

  function updateConditionalElements(el) {
    let conditionElement;
    // Check if el or a child of it holds condition
    el.dataset.conditionName ? (conditionElement = el) : (conditionElement = el.querySelector("[data-condition-name]"));

    if (!conditionElement?.dataset) return;

    // Get all conditional Elements
    let conditionHolders = document.querySelectorAll(`[data-condition-el="${conditionElement.dataset.conditionName}"]`);

    // Get selected/checked value
    const value = conditionElement.querySelector(":checked")?.value;

    // Get conditions from conditionholders

    conditionHolders.forEach((holder) => {
      const conditionValues = holder?.dataset?.condition.split(",").map((item) => item.trim());

      // Check if any condtion is met
      function meetsAnyCondition(arrayOfConditions, activeValue) {
        // // If there is no value set treat it as true
        // console.log("condition", activeValue);
        // // arrayOfConditions.forEach((condition) => {
        // //   if (!activeValue && Array.from(condition)[0] === "!") return true;
        // // });
        return arrayOfConditions.some((condition) =>
          // if the condition starts with ! its negated
          Array.from(condition)[0] === "!" ? condition.substring(1) !== activeValue : condition === activeValue
        );
      }
      // Check if any condition is true
      const conditionIsMet = meetsAnyCondition(conditionValues, value);
      if (!conditionElement) return;

      // If no condtion is true or the element is not visible hide the dependant element
      if (!conditionIsMet) {
        holder.style.display = "none";
      } else {
        holder.style.display = "block";
      }
    });
  }

  //
  // Auto save
  //

  // Helper function for saving data to inditfy fields by name or id
  function getName(field) {
    if (field.name.length > 0) {
      return field.name;
    }
    if (field.id.length > 0) {
      return field.id;
    }
    return null;
  }

  function saveDataToLocalStorage(event) {
    // Only run for fields in the [data-auto-save] form
    if (!event.target.closest("[data-form='multi-step']")) return;

    // Get an ID for the field
    var name = getName(event.target);
    if (!name) return;

    // Get existing data from localStorage
    let saved = localStorage.getItem(formName);
    saved = saved ? JSON.parse(saved) : {};

    // Add the field to the localStorage object
    // If it's a checkbox, use on/off values
    // Otherwise, save the value
    if (event.target.type === "checkbox") {
      saved[name] = event.target.checked ? "on" : "off";
    } else {
      saved[name] = event.target.value;
    }
    // Save the object back to localStorage
    localStorage.setItem(formName, JSON.stringify(saved));
  }

  // Load saved form data from localStorage
  function loadDataFromLocalStorage() {
    // console.log("loading");
    // Get data from localStorage
    let saved = localStorage.getItem(formName);
    if (!saved) return;
    saved = JSON.parse(saved);
    // Get all of the form fields
    let fields = document.querySelectorAll("[data-auto-save] input, [data-auto-save] textarea, [data-auto-save] select");

    // Loop through each field and load any saved data in localStorage
    Array.prototype.slice.call(fields).forEach(function (field) {
      // fields.forEach(function (field) {
      // If the field has no usable ID, skip it
      let name = getName(field);
      if (!name) return;

      // Skip the files input as the File object cannot be stored in localstorage
      if (name.includes("files")) return;

      // If there's no saved data in localStorage, skip it
      if (!saved[name]) return;

      // Set the field value to the saved data in localStorage
      // If it's a checkbox, set it's checked state
      // If it's a radio button and its value matches, set its checked state
      // Otherwise, set the value
      if (field.type === "checkbox") {
        field.checked = saved[name] === "on" ? true : false;
      } else if (field.type === "radio") {
        field.checked = saved[name] === field.value ? true : false;
      } else {
        field.value = saved[name];
      }
    });

    // Make sure all conditional fields are displayed correctely
    updateLogic();
  }

  //
  // Generators
  //
  // Get all

  let repeatableCount = 1;
  function getAllRepeatables(params) {
    return document.querySelectorAll("[data-repeat='item']");
  }
  function deleteRepeatable(repeatableItem) {
    // console.log("remove");
    if (getAllRepeatables().length <= 1) return;
    repeatableItem.remove();
    repeatableCount--;
    validateStepWithoutOverlays();
  }
  function addRepeatable() {
    repeatableCount++;
    //   console.log("add");
    const items = document.querySelectorAll("[data-repeat='item']");
    let clone = repeatableItem.cloneNode(true);
    let inputs = clone.querySelectorAll("input");
    // Reset all inputs
    inputs.forEach((input, index) => {
      if (input.type === "text" || input.type === "number") {
        input.value = "";
        input.name += repeatableCount;
      } else if (input.type === "radio") {
        input.checked = false;
        input.name += repeatableCount;
        input.id += repeatableCount;
      }
    });

    items[items.length - 1].after(clone);
    validateStepWithoutOverlays();
    initModals();
    // repeatableItem.after(repeatableItem.cloneNode(true));
  }

  //
  // Setup the form
  //
  function initiateForm() {
    loadDataFromLocalStorage();
    hideConditionalElements();
    showActiveStep();
    validateStepWithoutOverlays();
    initModals();
  }
  // Run once on startup
  initiateForm();

  //
  // Event listeners
  //

  // Listen for input events
  document.addEventListener(
    "input",
    function (event) {
      validateStepWithoutOverlays();
      saveDataToLocalStorage(event);
    },
    false
  );

  // Event listener for enter key
  document.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      handleClicksAndEnter(event);
    }
  });
  // Event listener for clicks
  document.addEventListener("click", handleClicksAndEnter);

  function handleClicksAndEnter(event) {
    // Click of next button
    if (event.target.matches("[data-form='next-btn']")) {
      nextStep();
    }
    // Click of back button
    if (event.target.matches("[data-form='back-btn']")) {
      prevStep();
    }
    // Click on conditional logic element trigger
    if (event.target.closest("[data-condition]")) {
      updateConditionalElements(event.target.closest("[data-condition]"));
    }
    // Click on conditional logic element trigger
    if (event.target.closest("[data-repeat='delete-item']")) {
      deleteRepeatable(event.target.closest("[data-repeat='item']"));
    }
    // Click on conditional logic element trigger
    if (event.target.closest("[data-repeat='add-item']")) {
      addRepeatable(event.target.closest("[data-repeat='add-item']"));
    }
    // Click of back button
    if (event.target.matches("[data-form='submit-btn']")) {
      submitForm();
    }
  }

  // When select choice is changed
  document.addEventListener(
    "change",
    function (event) {
      validateStepWithoutOverlays();
      // Click on conditional logic element trigger
      if (event.target.closest("[data-condition-name]")) {
        updateConditionalElements(event.target.closest("[data-condition-name]"));
      }
    },
    true
  );
  // });
})();
