import { MemberTaskInfo, Story } from "../interfaces";
import { calculatePercentage } from "./calculatePercentage";
import { getDuration } from "./getDuration";
import { aggregateMembersInfo } from "./member/aggregateMembersInfo";
import { getStorys } from "./story/getStorys";
import { sumStorys } from "./story/sumStorys";
import { parseTime } from "./time/parseTime";
import { subtractTimes } from "./time/subtractTimes";
import { getSquadName } from "./squad/getSquadName";
import { fillMembersTable } from "./member/fillMembersTable";
import { clearOldData } from "./clearOldData";
import { fillStoriesInfo } from "./story/fillStoriesInfo";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  function checkNaN(hr: string) {
    return hr.includes("NaN") ? "NOT FOUND" : hr;
  }

  if (message.action === "getData") {
    const squadName = getSquadName();
    const duration = getDuration();
    const storys = getStorys();
    const {
      totalHR,
      totalTypes,
      totalClosed,
      totalNew,
      totalClosedHR,
      totalNewHR,
    } = sumStorys(storys);
    const aggregatedMembersInfo = aggregateMembersInfo(storys);

    const totalPercent = calculatePercentage(
      parseTime(totalClosedHR),
      parseTime(totalHR)
    );
    const remainingHours = subtractTimes(totalClosedHR, totalHR);

    const mainTaskboard = document.querySelector(
      ".main.taskboard"
    ) as HTMLDivElement;
    const summary = mainTaskboard.querySelector(
      ".large-summary"
    ) as HTMLDivElement;

    let totalTasks = "";
    let totalStories = "";
    let membersInfoText = "";
    if (mainTaskboard && summary) {
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

      // =-=-=-=-= Total Closed =-=-=-=-=
      const totalClosedWrapper = document.querySelector(
        ".summary-closed-tasks"
      );
      const totalClosedNumber = totalClosedWrapper.childNodes[0] as HTMLElement;
      totalClosedNumber.innerText = `${totalClosed}`;


      // =-=-=-=-= Total Hr =-=-=-=-=
      const totalHrWrapper = document.createElement("div");
      totalHrWrapper.className = "summary-stats";
      const totalHrNumber = document.createElement("span");
      totalHrNumber.id = "total-hr";
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


      // =-=-=-=-= total New Hr =-=-=-=-=
      const newHrWrapper = document.createElement("div");
      newHrWrapper.className = "summary-stats";
      const newHrNumber = document.createElement("span");
      newHrNumber.className = "number";
      newHrNumber.id = "qtd-new-hr";
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


      // =-=-=-=-= Qtd New =-=-=-=-=
      const qtdNewWrapper = document.createElement("div");
      qtdNewWrapper.className = "summary-stats";
      const qtdNewNumber = document.createElement("span");
      qtdNewNumber.id = "qtd-new";
      qtdNewNumber.className = "number";
      const qtdNewDescription = document.createElement("span");
      qtdNewDescription.className = "description";
      qtdNewNumber.textContent = `${totalNew}`;
      qtdNewDescription.innerHTML = "new<br/> tasks";
      qtdNewWrapper.appendChild(qtdNewNumber);
      qtdNewWrapper.appendChild(qtdNewDescription);
      mainSummaryStats.insertBefore(
        qtdNewWrapper,
        mainSummaryStats.childNodes[7]
      );


      // =-=-=-=-= Duration =-=-=-=-=
      const durationWrapper = document.createElement("div");
      durationWrapper.className = "summary-stats";
      durationWrapper.style.margin = "0px";
      const durationDescription = document.createElement("span");
      durationDescription.id = "duration";
      durationDescription.className = "description";
      durationDescription.textContent = duration;
      durationWrapper.appendChild(durationDescription);
      summary.insertBefore(durationWrapper, summary.childNodes[0]);


      // =-=-=-=-= Stories =-=-=-=-=
      fillStoriesInfo(storys, totalStories);

      const taskboardInner = document.querySelector(".taskboard-inner");


      // =-=-=-=-= Members info =-=-=-=-=
      const tasksProductivityContainer = document.createElement("div");
      tasksProductivityContainer.style.padding = "1rem";
      tasksProductivityContainer.style.backgroundColor = "#f9f9fb";

      const tasksProductivityWrapper = document.createElement("div");
      const membersInfoTable = document.createElement("table");
      membersInfoTable.id = "members-info";

      const membersInfoTitle = document.createElement(
        "h3"
      ) as HTMLHeadingElement;
      membersInfoTitle.textContent = "Produtividade Membros";
      membersInfoTitle.style.color = "#008aa8";
      membersInfoTitle.style.padding = "0 0 0.5rem";
      membersInfoTitle.style.fontFamily = "Ubuntu-Medium";
      membersInfoTitle.style.fontSize = "22.4px";

      fillMembersTable(membersInfoTable, aggregatedMembersInfo);
      membersInfoTable.style.color = "#4c566a";
      membersInfoTable.style.fontSize = "14px";
      membersInfoTable.style.borderCollapse = "collapse";

      membersInfoTable.querySelectorAll("td").forEach((td) => {
        td.style.paddingRight = ".5rem";
        td.style.paddingBottom = ".5rem";
      });

      const membersInfoWrapper = document.createElement("div") as HTMLDivElement;

      membersInfoWrapper.appendChild(membersInfoTitle);
      membersInfoWrapper.appendChild(membersInfoTable);

      tasksProductivityWrapper.appendChild(membersInfoWrapper)
      tasksProductivityWrapper.style.backgroundColor = "#fff";
      tasksProductivityWrapper.style.borderRadius = "3px";
      tasksProductivityWrapper.style.padding = "1rem";
      tasksProductivityWrapper.style.display = "flex";
      tasksProductivityWrapper.style.gap = "5rem";

      
      // =-=-=-=-= Total Tasks =-=-=-=-=
      const totalTasksTitle = document.createElement(
        "h3"
      ) as HTMLHeadingElement;
      totalTasksTitle.style.color = "#008aa8";
      totalTasksTitle.style.padding = "0 0 0.5rem";
      totalTasksTitle.style.fontFamily = "Ubuntu-Medium";
      totalTasksTitle.style.fontSize = "22.4px";
      
      const totalTasksWrapper = document.createElement("div");
      const totalTasksList = document.createElement("ul");
      totalTasksList.style.display = 'flex';
      totalTasksList.style.flexDirection = 'column';
      totalTasksList.style.gap = '.5rem';
      totalTasksList.style.maxHeight = '100px';
      totalTasksList.style.flexWrap = 'wrap';
      totalTasksList.style.maxHeight = '100px';
      totalTasksList.style.fontSize = '14px';
      totalTasksList.style.color = '#4c566a';
      totalTasksWrapper.id = "qtd-total";
      const totalOfTotalTypes = Object.values(totalTypes).reduce(
        (acc: number, curr: number) => acc + curr,
        0
      );
      totalTasksTitle.textContent = `Tasks (${totalOfTotalTypes})`;
      totalTasksList.innerHTML = `${Object.entries(totalTypes)
        .map(([key, value]) => `<li>${key}: ${value}</li>`).join(' ')}`;

      totalTasksWrapper.appendChild(totalTasksTitle)
      totalTasksWrapper.appendChild(totalTasksList)

      tasksProductivityWrapper.appendChild(totalTasksWrapper)
      
      tasksProductivityContainer.appendChild(tasksProductivityWrapper);
      taskboardInner.insertBefore(
        tasksProductivityContainer,
        taskboardInner.childNodes[5]
      );
    }

    sendResponse({
      squadName,
      duration,
      storys,
      totalHR,
      totalTypes,
      totalClosed,
      totalNew,
      totalClosedHR,
      totalPercent,
      remainingHours,
      aggregatedMembersInfo,
      totalNewHR,
      totalTasks,
      totalStories,
      membersInfoText,
    });
  }
});
