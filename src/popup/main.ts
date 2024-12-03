import { renderMembersInfos } from "./helpers";

function activateCopyButton() {
  if (document.getElementById("copyData")) {
    return ((document.getElementById("copyData") as HTMLInputElement).disabled =
      false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0].url;
    const allowedUrls = ["taiga"];

    if (!allowedUrls.some((url) => currentUrl.includes(url))) {
      document.getElementById("error").style.display = "block";
      document.getElementById("copyData").style.display = "none";
    } else {
      document.getElementById("copyData").style.display = "block";
      document.getElementById("error").style.display = "none";
    }
  });

  chrome.runtime.sendMessage(
    { action: "getData" },
    ({
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
      totalTasks,
      totalStories,
    }) => {
      (
        document.getElementById("copyData") as HTMLInputElement
      ).addEventListener("click", () => {
        const allFields = 
      `Data: ${new Date().toLocaleDateString("pt-br")}\n`+
      `SQUAD: ${squadName}\n`+
      `DURATION: ${duration}\n`+
      `TOTAL (HR): ${totalClosedHR} / ${totalHR} (${remainingHours} - ${totalPercent}%)\n`+
      `TOTAL NEW (HR): ${totalNewHR}\n`+
      `TOTAL (TASKS): ${totalTasks}\n`+
      `QTD. CLOSED: ${totalClosed}\n`+
      `QTD. NEW: ${totalNew}\n\n`+
      `STORIES:\n${totalStories}\n\n`+
      `PRODUTIVIDADE DA SQUAD: \n${renderMembersInfos(aggregatedMembersInfo)}`
    ;
        navigator.clipboard.writeText(allFields);
      });
      activateCopyButton();
    }
  );
});