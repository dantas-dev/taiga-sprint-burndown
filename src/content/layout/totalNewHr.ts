export const createTotalNewHRWrapper = (
  mainSummaryStats: Element,
  totalNewHR: string
) => {
  // =-=-=-=-= total New Hr =-=-=-=-=
  const newHrWrapper = document.createElement("div");
  newHrWrapper.className = "summary-stats";
  newHrWrapper.id = "qtd-new-hr";
  const newHrNumber = document.createElement("span");
  newHrNumber.className = "number";
  const newHrDescription = document.createElement("span");
  newHrDescription.className = "description";
  newHrNumber.textContent = totalNewHR;
  newHrDescription.innerHTML = "total new<br/>(hrs)";
  newHrWrapper.appendChild(newHrNumber);
  newHrWrapper.appendChild(newHrDescription);
  mainSummaryStats.insertBefore(newHrWrapper, mainSummaryStats.childNodes[7]);
};
