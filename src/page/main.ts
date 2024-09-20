import { MemberTaskInfo } from "../interfaces";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, data } = message;
  function checkNaN(hr) {
    return hr.includes("NaN") ? "NOT FOUND" : hr;
  }

  function clearOldData(mainTaskboard: HTMLDivElement, summary: HTMLDivElement) {
    if (mainTaskboard) {
      mainTaskboard.style.height = "auto";
    }
    if (summary) {
      summary.style.height = "auto";
      summary.style.overflow = "visible";
      summary.style.display = "flex";
      summary.style.flexDirection = "column";

      const iocaineWrapper = summary.querySelector('.summary-stats.summary-iocaine') as HTMLDivElement
      const closedTasksWrapper = summary.querySelector('.summary-stats.summary-closed-tasks') as HTMLDivElement
      const openTasksWrapper = summary.querySelector('.summary-stats.summary-open-tasks') as HTMLDivElement
      const moveUnfinishedWrapper = summary.querySelector('.summary-stats.summary-move-unfinished') as HTMLDivElement
      const completedPointsWrapper = summary.querySelector('.summary-stats.summary-completed-points') as HTMLDivElement
      const toggleAnalyticsWrapper = summary.querySelector('.stats.toggle-analytics-visibility') as HTMLDivElement
      toggleAnalyticsWrapper.style.marginLeft = '0'
      const largeSummaryWrapper = summary.querySelector('.large-summary-wrapper') as HTMLDivElement
      largeSummaryWrapper.appendChild(toggleAnalyticsWrapper);
      iocaineWrapper.style.display = 'none'
      closedTasksWrapper.style.display = 'none'
      openTasksWrapper.style.display = 'none'
      moveUnfinishedWrapper.style.border = 'none'
      completedPointsWrapper.style.border = 'none'
    }

    const pointsStats = summary.querySelector(".points-per-role-stats");
    if (pointsStats) {
      pointsStats.remove();
    }
  }

  function fillMembersTable(
    table: HTMLTableElement,
    membersInfo: MemberTaskInfo[]
  ) {
    table
      .querySelectorAll("tr:not(:first-child)")
      .forEach((row) => row.remove());
    membersInfo.forEach((member) => {
      const row = document.createElement("tr");
      const memberCell = document.createElement("td");
      memberCell.textContent = member.member;
      row.appendChild(memberCell);
      const tasksCell = document.createElement("td");
      tasksCell.textContent = member.tasks.toString();
      row.appendChild(tasksCell);
      const hoursCell = document.createElement("td");
      hoursCell.textContent = member.hours;
      row.appendChild(hoursCell);
      table.appendChild(row);
    });
  }

  if (action === "receiveDataInPage") {
    const {
      squadName,
      duration,
      totalHR,
      totalClosedHR,
      totalTypes,
      totalClosed,
      totalNew,
      remainingHours,
      totalPercent,
      storys,
      aggregatedMembersInfo,
      totalNewHR,
    } = data;

    const mainTaskboard = document.querySelector(
      ".main.taskboard"
    ) as HTMLDivElement;
    const summary = mainTaskboard.querySelector(
      ".large-summary"
    ) as HTMLDivElement;
    const isBurndownDataWrapper = document.querySelector(
      ".burndown-data-wrapper"
    );
    if (mainTaskboard && summary && !isBurndownDataWrapper) {
      // limpeza
      clearOldData(mainTaskboard, summary);

      //burndownData
      const burndownDataWrapper = document.createElement("div");
      burndownDataWrapper.className = "burndown-data-wrapper";

      // duration
      const durationWrapper = document.createElement("p");
      durationWrapper.textContent = `Duration: ${duration}` || "NOT FOUND";
      burndownDataWrapper.appendChild(durationWrapper);

      // Total Hr
      const totalHrWrapper = document.createElement("p");
      totalHrWrapper.textContent =
        `Total (HR): ${checkNaN(totalClosedHR)} / ${checkNaN(
          totalHR
        )} (${checkNaN(remainingHours)} - ${checkNaN(totalPercent)}%)` ||
        "NOT FOUND";
      burndownDataWrapper.appendChild(totalHrWrapper);

      // total New Hr
      const totalNewHrWrapper = document.createElement("p");
      totalNewHrWrapper.textContent =
        `Total New (HR): ${totalNewHR}` || "NOT FOUND";
      burndownDataWrapper.appendChild(totalNewHrWrapper);

      // Qtd New
      const qtdNewWrapper = document.createElement("p");
      qtdNewWrapper.textContent = `Qtd. New: ${totalNew}` || "NOT FOUND";
      burndownDataWrapper.appendChild(qtdNewWrapper);

      // Total Tasks
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
      burndownDataWrapper.appendChild(totalTasksWrapper);

      // Qtd Closed
      const qtdClosedWrapper = document.createElement("p");
      qtdClosedWrapper.textContent =
        `Qtd. Closed: ${totalClosed}` || "NOT FOUND";
      burndownDataWrapper.appendChild(qtdClosedWrapper);

      const dataFlexContainer = document.createElement("div");
      dataFlexContainer.style.display = "flex";
      dataFlexContainer.style.gap = "1rem";

      // Stories
      const storiesWrapper = document.createElement("div");
      const storiesList = document.createElement("ul");
      storiesList.innerHTML = storys
        .map(
          (story) => `
      <li>
        <strong>${story.name}</strong>
        <ul>
          <li>TOTAL (HR): ${checkNaN(story.totalHR)} (${checkNaN(
            story.remainingHours
          )} - ${checkNaN(story.totalPercent)}%)</li>
          <li>CLOSED (HR): ${checkNaN(
            story.totalClosedHR
          )} / NEW CLOSED: ${checkNaN(story.totalNewHR)}</li>
          <li>TASKS (QTD): ${story.tasks.length} (CLOSED: ${
            story.totalClosed
          } / NEW: ${story.totalNew})</li>
        </ul>
      </li>
    `
        )
        .join("");

      storiesWrapper.appendChild(storiesList);
      storiesWrapper.style.maxHeight = "400px";
      storiesWrapper.style.overflow = "scroll";
      dataFlexContainer.appendChild(storiesWrapper);

      // Members info
      const membersInfoWrapper = document.createElement("div");
      const membersInfoTable = document.createElement("table");

      membersInfoTable.innerHTML = `
      <tr>
      <th>Membro</th>
      <th>Tasks</th>
      <th>Horas</th>
      </tr>`;

      fillMembersTable(membersInfoTable, aggregatedMembersInfo);
      membersInfoWrapper.appendChild(membersInfoTable);

      dataFlexContainer.appendChild(membersInfoWrapper);
      burndownDataWrapper.appendChild(dataFlexContainer);

      summary.appendChild(burndownDataWrapper);
    }
  }
});
