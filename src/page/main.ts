import { MemberTaskInfo, Story } from "../interfaces";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, data } = message;
  function checkNaN(hr) {
    return hr.includes("NaN") ? "NOT FOUND" : hr;
  }

  function clearOldData(
    mainTaskboard: HTMLDivElement,
    summary: HTMLDivElement
  ) {
    if (mainTaskboard) {
      mainTaskboard.style.height = "auto";
    }
    if (summary) {
      summary.style.height = "auto";
      summary.style.overflow = "visible";
      summary.style.display = "flex";
      summary.style.flexDirection = "column";

      const iocaineWrapper = summary.querySelector(
        ".summary-stats.summary-iocaine"
      ) as HTMLDivElement;
      const openTasksWrapper = summary.querySelector(
        ".summary-stats.summary-open-tasks"
      ) as HTMLDivElement;
      const moveUnfinishedWrapper = summary.querySelector(
        ".summary-stats.summary-move-unfinished"
      ) as HTMLDivElement;
      const completedPointsWrapper = summary.querySelector(
        ".summary-stats.summary-completed-points"
      ) as HTMLDivElement;
      const toggleAnalyticsWrapper = summary.querySelector(
        ".stats.toggle-analytics-visibility"
      ) as HTMLDivElement;
      toggleAnalyticsWrapper.style.marginLeft = "0";
      const largeSummaryWrapper = summary.querySelector(
        ".large-summary-wrapper"
      ) as HTMLDivElement;
      largeSummaryWrapper.appendChild(toggleAnalyticsWrapper);
      iocaineWrapper.remove();
      openTasksWrapper.remove();
      moveUnfinishedWrapper.style.border = "none";
      completedPointsWrapper.style.border = "none";
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
      duration,
      totalHR,
      totalClosedHR,
      totalTypes,
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
    if (mainTaskboard && summary) {
      // limpeza
      clearOldData(mainTaskboard, summary);

      const mainSummaryStats = summary.querySelector(".main-summary-stats");

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

      // Total Hr
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
      mainSummaryStats.insertBefore(
        totalHrWrapper,
        mainSummaryStats.childNodes[0]
      );

      // total New Hr
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
      mainSummaryStats.insertBefore(
        newHrWrapper,
        mainSummaryStats.childNodes[7]
      );

      // Qtd New
      const qtdNewWrapper = document.createElement("div");
      qtdNewWrapper.className = "summary-stats";
      const qtdNewNumber = document.createElement("span");
      qtdNewNumber.className = "number";
      const qtdNewDescription = document.createElement("span");
      qtdNewDescription.className = "description";
      qtdNewNumber.textContent = totalNew;
      qtdNewDescription.innerHTML = "new<br/> tasks";
      qtdNewWrapper.appendChild(qtdNewNumber);
      qtdNewWrapper.appendChild(qtdNewDescription);
      mainSummaryStats.insertBefore(
        qtdNewWrapper,
        mainSummaryStats.childNodes[7]
      );

      // duration
      const durationWrapper = document.createElement("div");
      durationWrapper.className = "summary-stats";
      durationWrapper.style.margin = "0px";
      const durationDescription = document.createElement("span");
      durationDescription.className = "description";
      durationDescription.textContent = duration;
      durationWrapper.appendChild(durationDescription);
      summary.insertBefore(durationWrapper, summary.childNodes[0]);

      // Stories
      const taskboardCards = document.querySelectorAll(".taskboard-us");
      taskboardCards.forEach((taskboardCard: HTMLDivElement, index: number) => {
        const title = taskboardCard.querySelector(".us-title") as HTMLElement;
        const story = storys.find(
          (story: Story) => story.name == title.innerText
        );
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
        const storyRow = taskboardCard.parentElement.parentElement
        if (storyRow.classList.contains('row-fold')) {
          storyData.style.display = 'none'
        } else {
          storyData.style.display = 'block'
        }
        document.querySelectorAll('.folding-actions')[index].addEventListener('click', () => {          
          if (!storyRow.classList.contains('row-fold')) {
            storyData.style.display = 'none'
          } else {
            storyData.style.display = 'block'
          }
        })
      });

      const taskboardInner = document.querySelector('.taskboard-inner');
      const membersWrapper = document.createElement('div')

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
        totalTasksWrapper.style.margin = '20px 0'
      summary.appendChild(totalTasksWrapper);

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
      membersInfoTable.style.color = '#4c566a';
      membersInfoTable.style.fontSize = '14px';
      membersInfoTable.style.borderCollapse = 'collapse';

      membersInfoTable.querySelectorAll('th').forEach(th => {
        th.style.padding = '.5rem'
        th.style.border = '1px solid #434456'
        th.style.background = '#434456'
        th.style.color = '#fff'

      })
      membersInfoTable.querySelectorAll('td').forEach(td => {
        td.style.padding = '.5rem'
        td.style.border = '1px solid #4c566a'
      })
      membersInfoTable.querySelectorAll('tr').forEach(tr => {
        tr.style.padding = '.5rem'
      })

      membersInfoWrapper.appendChild(membersInfoTable);
      membersInfoWrapper.style.backgroundColor = '#f9f9fb';
      membersInfoWrapper.style.border = '1px solid transparent';
      membersInfoWrapper.style.borderRadius = '3px';
      membersInfoWrapper.style.padding = '1rem';

      membersWrapper.appendChild(membersInfoWrapper)
      taskboardInner.insertBefore(membersWrapper, taskboardInner.childNodes[5]);
    }
  }
});
