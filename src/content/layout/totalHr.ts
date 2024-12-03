function checkNaN(hr: string) {
  return hr.includes("NaN") ? "NOT FOUND" : hr;
}

export const createTotalHrWrapper = (
  mainSummaryStats: Element,
  totalClosedHR: string,
  totalHR: string,
  remainingHours: string
) => {
  // =-=-=-=-= Total Hr =-=-=-=-=
  const totalHrWrapper = document.createElement("div");
  totalHrWrapper.className = "summary-stats";
  const totalHrNumber = document.createElement("span");
  totalHrNumber.id = "total-hr";
  totalHrWrapper.id = "total-hr-wrapper";
  totalHrNumber.className = "number";
  const totalHrDescription = document.createElement("span");
  totalHrDescription.className = "description";
  totalHrNumber.textContent = `${checkNaN(totalClosedHR)} / ${checkNaN(
    totalHR
  )}`;
  totalHrDescription.innerHTML = `total hrs <br/>(${remainingHours} hrs remaining)`;
  totalHrWrapper.appendChild(totalHrNumber);
  totalHrWrapper.appendChild(totalHrDescription);
  mainSummaryStats.insertBefore(totalHrWrapper, mainSummaryStats.childNodes[0]);
};
