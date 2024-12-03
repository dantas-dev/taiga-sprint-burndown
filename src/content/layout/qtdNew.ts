export const createQtdNewWrapper = (
  mainSummaryStats: Element,
  totalNew: number
) => {
  const qtdNewWrapper = document.createElement("div");
  qtdNewWrapper.className = "summary-stats";
  const qtdNewNumber = document.createElement("span");
  qtdNewWrapper.id = "qtd-new";
  qtdNewNumber.className = "number";
  const qtdNewDescription = document.createElement("span");
  qtdNewDescription.className = "description";
  qtdNewNumber.textContent = `${totalNew}`;
  qtdNewDescription.innerHTML = "new<br/> tasks";
  qtdNewWrapper.appendChild(qtdNewNumber);
  qtdNewWrapper.appendChild(qtdNewDescription);
  mainSummaryStats.insertBefore(qtdNewWrapper, mainSummaryStats.childNodes[7]);
};
