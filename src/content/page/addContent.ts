import { Story } from "../../interfaces";

function checkNaN(hr) {
  return hr.includes("NaN") ? "NOT FOUND" : hr;
}

export function changeProgressBar(totalPercent: string) {
    console.log(totalPercent);
    
  const progressBarWrapper = document.querySelector(
    ".summary-progress-wrapper"
  );
  const progressBar = (
    progressBarWrapper.childNodes[1] as HTMLElement
  ).querySelector(".current-progress") as HTMLElement;
  const progressBarDataNumber = (
    progressBarWrapper.childNodes[3] as HTMLElement
  ).querySelector(".number") as HTMLElement;
  progressBar.style.width = `${checkNaN(totalPercent)}%`;
  progressBarDataNumber.innerText = `${checkNaN(totalPercent)}%`;
}

export function addTotalHrWrapper(
  mainSummaryStats: Element,
  totalClosedHR: string,
  totalHR: string,
  remainingHours: string
) {
  const totalHrWrapper = document.createElement("div");
  totalHrWrapper.className = "summary-stats";
  const totalHrNumber = document.createElement("span");
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
}

export function addNewHrWrapper(mainSummaryStats: Element, totalNewHR: string) {
  const newHrWrapper = document.createElement("div");
  newHrWrapper.className = "summary-stats";
  const newHrNumber = document.createElement("span");
  newHrNumber.className = "number";
  const newHrDescription = document.createElement("span");
  newHrDescription.className = "description";
  newHrNumber.textContent = totalNewHR;
  newHrDescription.innerHTML = "total new<br/>(hrs)";
  newHrWrapper.appendChild(newHrNumber);
  newHrWrapper.appendChild(newHrDescription);
  mainSummaryStats.insertBefore(newHrWrapper, mainSummaryStats.childNodes[7]);
}

export function addQtdNewWrapper(mainSummaryStats: Element, totalNew: number) {
  const qtdNewWrapper = document.createElement("div");
  qtdNewWrapper.className = "summary-stats";
  const qtdNewNumber = document.createElement("span");
  qtdNewNumber.className = "number";
  const qtdNewDescription = document.createElement("span");
  qtdNewDescription.className = "description";
  qtdNewNumber.textContent = `${totalNew}`;
  qtdNewDescription.innerHTML = "new<br/> tasks";
  qtdNewWrapper.appendChild(qtdNewNumber);
  qtdNewWrapper.appendChild(qtdNewDescription);
  mainSummaryStats.insertBefore(qtdNewWrapper, mainSummaryStats.childNodes[7]);
}

export function addDurationWrapper(summary: Element, duration: string) {
  const durationWrapper = document.createElement("div");
  durationWrapper.className = "summary-stats";
  durationWrapper.style.margin = "0px";
  const durationDescription = document.createElement("span");
  durationDescription.className = "description";
  durationDescription.textContent = duration;
  durationWrapper.appendChild(durationDescription);
  summary.insertBefore(durationWrapper, summary.childNodes[0]);
}

export function addStories(storys: Story[]) {
  const taskboardCards = document.querySelectorAll(".taskboard-us");
  taskboardCards.forEach((taskboardCard: HTMLDivElement, index: number) => {
    const title = taskboardCard.querySelector(".us-title") as HTMLElement;
    const story = storys.find((story: Story) => story.name == title.innerText);
    const storyData = document.createElement("ul");
    storyData.innerHTML = `<li>TOTAL (HR): ${checkNaN(
      story.totalHR
    )} (${checkNaN(story.remainingHours)} - ${checkNaN(
      story.totalPercent
    )}%)</li>
        <li>CLOSED (HR): ${checkNaN(
          story.totalClosedHR
        )} / NEW CLOSED: ${checkNaN(story.totalNewHR)}</li>
        <li>TASKS (QTD): ${story.tasks.length} (CLOSED: ${
      story.totalClosed
    } / NEW: ${story.totalNew})</li>`;
    title.appendChild(storyData);
    storyData.style.fontSize = "14px";
    storyData.style.paddingTop = "1rem";
    storyData.style.color = "#4c566a";
    const storyRow = taskboardCard.parentElement.parentElement;
    if (storyRow.classList.contains("row-fold")) {
      storyData.style.display = "none";
    } else {
      storyData.style.display = "block";
    }
    document
      .querySelectorAll(".folding-actions")
      [index].addEventListener("click", () => {
        if (!storyRow.classList.contains("row-fold")) {
          storyData.style.display = "none";
        } else {
          storyData.style.display = "block";
        }
      });
  });
}

export function addTotalTasks(summary: Element, totalTypes: any) {
  const totalTasksWrapper = document.createElement("p");
  const totalOfTotalTypes = Object.values(totalTypes).reduce(
    (acc: number, curr: number) => acc + curr,
    0
  );
  totalTasksWrapper.textContent = `Tasks: ${totalOfTotalTypes} (${Object.entries(
    totalTypes
  )
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ")})`;
  totalTasksWrapper.style.margin = "20px 0";
  summary.appendChild(totalTasksWrapper);
}
