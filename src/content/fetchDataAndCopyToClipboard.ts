export function fetchDataAndCopyToClipboard() {
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
        const allFields = 
          `Data: ${new Date().toLocaleDateString("pt-br")}\n` +
          `SQUAD: ${squadName}\n` +
          `DURATION: ${duration}\n` +
          `TOTAL (HR): ${totalClosedHR} / ${totalHR} (${remainingHours} - ${totalPercent}%)\n` +
          `TOTAL NEW (HR): ${totalNewHR}\n` +
          `TOTAL (TASKS): ${totalTasks}\n` +
          `QTD. CLOSED: ${totalClosed}\n` +
          `QTD. NEW: ${totalNew}\n` +
          `STORIES\n${totalStories}\n\n`;
        navigator.clipboard.writeText(allFields);
      }
    );
  }
  