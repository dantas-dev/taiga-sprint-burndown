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
import { createTotalHrWrapper } from "./layout/totalHr";
import { createTotalNewHRWrapper } from "./layout/totalNewHr";
import { createQtdNewWrapper } from "./layout/qtdNew";
import { createDurationWrapper } from "./layout/duration";
import { updateTotalClosedWrapper } from "./layout/totalClosed";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  function checkNaN(hr: string) {
    return hr.includes("NaN") ? "NOT FOUND" : hr;
  }
  function conditionalRemoveElement(id: string) {
    const element = document.querySelector(id);
    if (element) {
      element.remove();
    }
  }

  function clearElements() {
    conditionalRemoveElement('#duration');
    conditionalRemoveElement('#total-hr-wrapper');
    conditionalRemoveElement('#qtd-new-hr-wrapper');
    conditionalRemoveElement('#qtd-total');
    conditionalRemoveElement('#qtd-new');
    conditionalRemoveElement('#qtd-new-hr');
    conditionalRemoveElement('#members-info-wrapper');
    const stories = Array.from(document.querySelectorAll('#stories'));
    stories.forEach((element) => {
      element.remove();
    });
  }

  if (message.action === "getData") {
    clearElements();
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

      updateTotalClosedWrapper(totalClosed);

      createTotalHrWrapper(
        mainSummaryStats,
        totalClosedHR,
        totalHR,
        remainingHours
      );

      createTotalNewHRWrapper(mainSummaryStats, totalNewHR);

      createQtdNewWrapper(mainSummaryStats, totalNew);

      createDurationWrapper(summary, duration);

      // =-=-=-=-= Stories =-=-=-=-=
      const { countTotal } = fillStoriesInfo(storys);
      totalStories = countTotal;
      // =-=-=-=-= Members info =-=-=-=-=

      // Título da produtividade dos membros
      const membersInfoTitle = document.createElement(
        "h3"
      ) as HTMLHeadingElement;
      membersInfoTitle.textContent = "Produtividade Membros";

      membersInfoTitle.style.color = "#008aa8";
      membersInfoTitle.style.padding = "0 0 0.5rem";
      membersInfoTitle.style.fontFamily = "Ubuntu-Medium";
      membersInfoTitle.style.fontSize = "22.4px";

      // Tabela da produtividade dos membros
      const membersInfoTable = document.createElement("table");
      membersInfoTable.id = "members-info";

      fillMembersTable(membersInfoTable, aggregatedMembersInfo);
      membersInfoTable.style.color = "#4c566a";
      membersInfoTable.style.fontSize = "14px";
      membersInfoTable.style.borderCollapse = "collapse";

      membersInfoTable.querySelectorAll("td").forEach((td) => {
        td.style.paddingRight = ".5rem";
        td.style.paddingBottom = ".5rem";
      });

      // Div interna que contém o título e a tabela da produtividade dos membros
      const membersInfoWrapper = document.createElement(
        "div"
      ) as HTMLDivElement;
      membersInfoWrapper.appendChild(membersInfoTitle);
      membersInfoWrapper.appendChild(membersInfoTable);

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
      totalTasksList.style.display = "flex";
      totalTasksList.style.flexDirection = "column";
      totalTasksList.style.gap = ".5rem";
      totalTasksList.style.maxHeight = "100px";
      totalTasksList.style.flexWrap = "wrap";
      totalTasksList.style.maxHeight = "100px";
      totalTasksList.style.fontSize = "14px";
      totalTasksList.style.color = "#4c566a";
      totalTasksWrapper.id = "qtd-total";
      const totalOfTotalTypes = Object.values(totalTypes).reduce(
        (acc: number, curr: number) => acc + curr,
        0
      );
      totalTasksTitle.textContent = `Tasks (${totalOfTotalTypes})`;
      totalTasksList.innerHTML = `${Object.entries(totalTypes)
        .map(([key, value]) => `<li>${key}: ${value}</li>`)
        .join(" ")}`;

      totalTasksWrapper.appendChild(totalTasksTitle);
      totalTasksWrapper.appendChild(totalTasksList);

      // Preenche a variável p ficar disponível para cópia
      totalTasks += `${totalOfTotalTypes} (${Object.entries(totalTypes)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")})`;

      // Div interna que contém a produtividade dos membros e as tasks
      const membersAndTasksInternalWrapper = document.createElement("div");
      membersAndTasksInternalWrapper.appendChild(membersInfoWrapper);
      membersAndTasksInternalWrapper.style.backgroundColor = "#fff";
      membersAndTasksInternalWrapper.style.borderRadius = "3px";
      membersAndTasksInternalWrapper.style.padding = "1rem";
      membersAndTasksInternalWrapper.style.display = "flex";
      membersAndTasksInternalWrapper.style.gap = "5rem";
      membersAndTasksInternalWrapper.appendChild(totalTasksWrapper);

      // Div externa que contém a produtividade dos membros e as tasks
      const membersAndTasksExternalWrapper = document.createElement("div");
      membersAndTasksExternalWrapper.id = 'members-info-wrapper';
      membersAndTasksExternalWrapper.style.padding = "1rem";
      membersAndTasksExternalWrapper.style.backgroundColor = "#f9f9fb";
      membersAndTasksExternalWrapper.appendChild(
        membersAndTasksInternalWrapper
      );

      // Taskboard
      const taskboardInner = document.querySelector(".taskboard-inner");
      taskboardInner.insertBefore(
        membersAndTasksExternalWrapper,
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
