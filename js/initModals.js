export function initModals() {
  // Get the info and modal elements
  // Info buttons for instrument value type
  let valueInfoElements = document.querySelectorAll('[data-name="value-info"]');
  const valueInfoContent = document.querySelector('[modal-content="value-info"]');
  // Info button for coverage überall / stationär
  const coverageInfoElement = document.querySelector('[data-name="coverage-info"]');

  const coverageInfoContent = document.querySelector('[modal-content="coverage-info"]');
  const modalCloseButton = document.querySelector('[data-name="modal-close"]');
  const modal = document.querySelector('[data-name="modal"]');

  // Add a click event listener to the info element
  valueInfoElements.forEach((el) =>
    el.addEventListener("click", () => {
      modal.style.display = "flex";
      valueInfoContent.style.display = "block";
      coverageInfoContent.style.display = "none";
    })
  );

  // Add a click event listener to the info element
  coverageInfoElement.addEventListener("click", () => {
    modal.style.display = "flex";

    valueInfoContent.style.display = "none";
    coverageInfoContent.style.display = "block";
  });

  // add a click event listener to the modal-close element
  modalCloseButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // add a click event listener to the modal-bg element
  modal.addEventListener("click", (e) => {
    if (e.target !== e.currentTarget) return; // Return if children are clicked
    modal.style.display = "none";
  });

  // add an event listener for the escape key to hide the modal
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modal.style.display = "none";
    }
  });
}
