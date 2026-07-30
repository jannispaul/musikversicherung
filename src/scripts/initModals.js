export function initModals() {
  // Get the info and modal elements
  // Info buttons for instrument value type
  const valueInfoElements = document.querySelectorAll('[data-name="value-info"]');
  const valueInfoContent = document.querySelector('[modal-content="value-info"]');
  // Info button for coverage überall / stationär
  const coverageInfoElement = document.querySelector('[data-name="coverage-info"]');
  const coverageInfoContent = document.querySelector('[modal-content="coverage-info"]');
  const modalCloseButton = document.querySelector('[data-name="modal-close"]');
  const modal = document.querySelector('[data-name="modal"]');

  // Without the modal container there's nothing to open — bail out early so a
  // missing element can never throw and abort the form's initialisation.
  if (!modal) return;

  function openModal(showValueInfo) {
    modal.style.display = "flex";
    if (valueInfoContent) valueInfoContent.style.display = showValueInfo ? "block" : "none";
    if (coverageInfoContent) coverageInfoContent.style.display = showValueInfo ? "none" : "block";
  }

  // Add a click event listener to the value-info element(s)
  valueInfoElements.forEach((el) => el.addEventListener("click", () => openModal(true)));

  // Add a click event listener to the coverage-info element
  coverageInfoElement?.addEventListener("click", () => openModal(false));

  // Add a click event listener to the modal-close element
  modalCloseButton?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Add a click event listener to the modal-bg element
  modal.addEventListener("click", (e) => {
    if (e.target !== e.currentTarget) return; // Return if children are clicked
    modal.style.display = "none";
  });

  // Add an event listener for the escape key to hide the modal
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modal.style.display = "none";
    }
  });
}
