(() => {
  //
  // Variables
  //
  const form = document.querySelector("[data-form='multi-step'] form");
  const steps = document.querySelectorAll("[data-form='step']");
  const backButtons = document.querySelectorAll("[data-form='back-btn']");
  const nextButtons = document.querySelectorAll("[data-form='next-btn']");
  const submitButton = document.querySelector("[data-form='submit-btn']");
  const formName = form?.dataset.name;
  const success =
    document.querySelector("[data-form='success']") ||
    document.querySelector(".w-form-done");
  const error =
    document.querySelector("[data-form='error']") ||
    document.querySelector(".w-form-fail");
  const stepIndicators = document.querySelectorAll(
    "[data-form='step-indicator']"
  );
  const currentStep = document.querySelector("[data-form='current-step']");
  const totalSteps = document.querySelector("[data-form='total-steps']");

  // These element get evaluated
  const conditionHolderElements = document.querySelectorAll(
    "[data-condition-name]"
  );
  // These elementes get shown / hidden
  const conditionalElements = document.querySelectorAll("[data-condition]");

  // Start at the first step
  let currentStepIndex = 0;
  let urlParams = Object.fromEntries(new URLSearchParams(location.search));

  //
  // Functions
  //

  /**
   * Chech if element is visble (does not work on fixed elements)
   * @param {HTMLElement} el
   * @returns {boolean} true if element is visble
   */
  function isVisible(el) {
    return !(el.offsetParent === null);
    // return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }
  /**
   * Sets the number of total steps in element with data-form="total-steps"
   */
  function setTotalSteps() {
    if (!totalSteps) return;
    totalSteps.innerText = steps.length;
  }

  /**
   * Sets the current Step number in element with data-form="current-step"
   */
  function updateCurrentStep() {
    if (!currentStep) return;
    currentStep.innerText = currentStepIndex + 1;
  }

  /**
   * Make sure all conditional logic is displayed correctely
   */
  function updateConditionalElements() {
    conditionHolderElements.forEach((el) => {
      updateConditionalElements(el);
    });
  }

  /**
   * Show active step
   * And: update step indicator, update condtional elements, and validated
   */
  function showActiveStep() {
    steps.forEach((el, index) => {
      index === currentStepIndex
        ? (el.style.display = "block")
        : (el.style.display = "none");
      index === currentStepIndex
        ? stepIndicators[index]?.classList.add("active")
        : stepIndicators[index]?.classList.remove("active");
    });

    // Update number of current Step
    updateCurrentStep();
    // Make sure all conditional fields are displayed correctely
    updateConditionalElements();
    // Validate step in the background
    validateStepWithoutOverlays();
    //Scroll to top of page / step
    scrollToTop();
  }

  /**
   * Validates all input in the current step
   * User will get prompted if no value is passed to function
   * If any required input is not valid returns false
   * @param {boolean} hideValidationOverlays
   * @returns {boolean} isValid - true if all inputs are valid
   */
  function validateStep(hideValidationOverlays = false) {
    let isValid = true;

    // Get all required inputs, textareas and selects
    const requiredFields = Array.from(
      steps[currentStepIndex].querySelectorAll(
        "input[required], textarea[required], select[required]"
      )
    );

    // Loop over requiered fields
    for (let i = 0; i < requiredFields.length; i++) {
      // Only validate if visible
      if (!isVisible(requiredFields[i])) continue;

      // Trigger browser validity check with or without promting user
      const fieldIsValid = hideValidationOverlays
        ? requiredFields[i].checkValidity()
        : requiredFields[i].reportValidity();

      // Field is invalid stop
      if (!fieldIsValid) return (isValid = false);
    }
    return isValid;
  }

  /**
   * Runs validateStep()
   * Validating all inputs in the current step without prompting the user
   * If any required input is not valid the disabled class gets added to all next and submit buttons
   * Else the disabled class gets removed from next and submit buttons
   */
  function validateStepWithoutOverlays() {
    // console.log("validate silent");
    const hideValidationOverlays = true;
    if (!validateStep(hideValidationOverlays)) {
      nextButtons?.forEach((button) => button.classList.add("disabled"));
      submitButton?.classList.add("disabled");
    } else {
      nextButtons?.forEach((button) => button.classList.remove("disabled"));
      submitButton?.classList.remove("disabled");
    }
  }
  /**
   * Hide all elements with data-condition attribute
   */
  function hideConditionalElements() {
    conditionalElements.forEach((el) => (el.style.display = "none"));
  }

  /**
   * Helper function to scroll to top
   */
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * Go to previous step
   */
  function prevStep() {
    currentStepIndex > 0 && currentStepIndex--;
    showActiveStep();
  }
  /**
   * Go to next step
   * @returns
   */
  function nextStep() {
    // Dont go if fields are invalid
    if (!validateStep()) return;

    currentStepIndex < steps.length && currentStepIndex++;
    showActiveStep();
  }

  /**
   * Submit the form to the specified action URL
   * @returns
   */
  function submitForm(e) {
    // Prevent if not submit button
    // if (!e?.target.closest(["data-form='submit-btn'"])) {
    //   e.preventDefault();
    // }
    // e.stopPropagation();

    // let formData = new FormData(form);

    // Dont submit if fields are invalid
    if (!validateStep()) return;

    const status = document.querySelector("[data-form='submit']");
    if (status) {
      status.innerHTML = status.dataset.wait && "Please wait...";
      status.disabled = true; // Add form .submitting state class for styling
    }

    // Submitting form
    form.submit();

    // // Submit object as json
    // const requestOptions = {
    //   method: "POST",
    //   body: formData,
    //   redirect: "follow",
    // };

    // Get action url
    const requestUrl = form.action;

    fetch(requestUrl, requestOptions)
      .then(function (response) {
        // If response is ok
        if (response.ok) {
          // console.log("fetch response ok");

          // Clear saved formdata from localstorage
          localStorage.removeItem(formName);

          // Hide form and show success
          form.style.display = "none";
          if (success) {
            success.style.display = "block";
          }
          scrollToTop();
        }
      }) // If there is an error log it to console and show error
      ["catch"](function (errorMessage) {
        console.error("Error: ", errorMessage);
        success.style.display = "none";
        error.style.display = "block";
      });
  }

  /**
   * Conditional Logic
   * Update all conditional elements. Triggered on click of an element with condition attribute
   * @param {HTMLElement} el - Element that has a data-condition or data-condition-name attribute.
   * @returns
   */
  function updateConditionalElements(el) {
    let conditionElement;
    // Check if el or a child of it holds condition
    el?.dataset.conditionName
      ? (conditionElement = el)
      : (conditionElement = el?.querySelector("[data-condition-name]"));

    if (!conditionElement?.dataset) return;

    // Get all conditional Elements
    let conditionHolders = document.querySelectorAll(
      `[data-condition-el="${conditionElement.dataset.conditionName}"]`
    );

    // Get selected/checked value
    const value = el.querySelector(":checked")?.value;

    /**
     * Check if any condtion is met
     * @param {Array[string]} arrayOfConditions
     * @param {string|number} activeValue
     * @returns
     */
    function meetsAnyCondition(arrayOfConditions, activeValue) {
      return arrayOfConditions.some((condition) =>
        // if the condition starts with ! its negated
        Array.from(condition)[0] === "!"
          ? condition.substring(1) !== activeValue
          : condition === activeValue
      );
    }

    // Get conditions from conditionholders
    conditionHolders.forEach((holder) => {
      const conditionValues = holder?.dataset?.condition
        .split(",")
        .map((item) => item.trim());

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

  /**
   * Auto save
   * Save all input filed data to localStorage under the form name
   * Load data from localStorage and populate inputs
   */

  /**
   * Helper function to get name or id of input filed
   * @param {HTMLElement} field - Input field
   * @returns
   */
  function getName(field) {
    if (field.name.length > 0) {
      return field.name;
    }
    if (field.id.length > 0) {
      return field.id;
    }
    return null;
  }

  /**
   * Saves data to localStorage on input event
   * @param {InputEvent} event
   * @returns
   */
  function saveDataToLocalStorage(event) {
    // console.log(event);
    if (event.target.closest("[data-auto-save='exclude']")) return;
    // Only run for fields in the [data-auto-save] form
    if (!event.target.closest("[data-auto-save]")) return;

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

  /**
   * Writes an object with data structured as key: name of input, value: value of input
   * @param {[HTMLElement]} arrayOfInputs
   * @param {{string: string|number}} objectWithData
   */

  function writeDataToInputs(arrayOfInputs, objectWithData) {
    // Loop through each field and load any saved data in localStorage
    Array.prototype.slice.call(arrayOfInputs).forEach((field) => {
      // If the field has no usable ID, skip it
      let name = getName(field);
      if (!name) return;

      // Skip the files input as the File object cannot be stored in localstorage
      if (name.includes("files")) return;

      // If there's no saved data in localStorage, skip it
      if (!objectWithData[name]) return;

      // Set the field value to the saved data in localStorage
      // If it's a checkbox, set it's checked state
      // If it's a radio button and its value matches, set its checked state
      // Otherwise, set the value
      if (field.type === "checkbox") {
        field.checked = objectWithData[name] === "on" ? true : false;
      } else if (field.type === "radio") {
        field.checked = objectWithData[name] === field.value ? true : false;
      } else {
        field.value = objectWithData[name];
      }
    });
  }
  /**
   * Load saved form data from localStorage
   * @returns
   */
  function loadDataFromLocalStorage() {
    // console.log("loading");
    // Get data from localStorage
    let saved = localStorage.getItem(formName);
    if (!saved) return;
    saved = JSON.parse(saved);
    // Get all of the form fields
    let fields = document.querySelectorAll(
      "[data-auto-save] input, [data-auto-save] textarea, [data-auto-save] select"
    );

    writeDataToInputs(fields, saved);
  }

  /**
   * Handle URL parameters
   * Set data from URL params to inputs
   */
  function setInputsFromURLParams() {
    if (!urlParams) return;

    const allFields = document.querySelectorAll("input, textarea, select");

    writeDataToInputs(allFields, urlParams);
  }

  /**
   * Setup the form
   */
  function initiateForm() {
    hideConditionalElements();
    setTotalSteps();
    loadDataFromLocalStorage();
    setInputsFromURLParams();
    updateConditionalElements();
    showActiveStep();
    validateStepWithoutOverlays();
  }

  initiateForm();

  //
  // Event Listeners
  //

  document.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      handleClicksAndEnter(event);
    }
  });

  /**
   * Event listener for clicks
   */
  document.addEventListener("click", handleClicksAndEnter);

  /**
   * Handles click and enter key press events, delegates events, and runs various functions
   * @listens to click and enter key press
   * @param {MouseEvent|KeyboardEvent} event
   */
  function handleClicksAndEnter(event) {
    // Prevent focused buttons from triggering both keypress and click event
    event.preventDefault();

    // Click of next button
    if (event.target.matches("[data-form='next-btn']")) {
      console.log("nextbtn");
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

  document.addEventListener("input", handleInputEvents, false);

  /**
   * Runs when input event is triggered
   * @param {InputEvent} event
   */
  function handleInputEvents(event) {
    validateStepWithoutOverlays();
    saveDataToLocalStorage(event);
  }

  /**
   * Change event listener is triggered when select choice is changed
   */
  document.addEventListener("change", handleChangeEvents, true);

  /**
   * Hanles changeEvent when a input, select, textarea value is changed
   * @param {ChangeEvent} event
   */
  function handleChangeEvents(event) {
    validateStepWithoutOverlays();
    // Click on conditional logic element trigger
    if (event.target.closest("[data-condition-name]")) {
      updateConditionalElements(event.target.closest("[data-condition-name]"));
    }
  }
})();
