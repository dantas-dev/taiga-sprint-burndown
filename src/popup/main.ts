import { fillMembersTable } from "./fillMembersTable";

function checkNaN(hr) {
  return hr.includes("NaN") ? "NOT FOUND" : hr;
}

function activateCopyButton() {
  return ((document.getElementById("copyData") as HTMLInputElement).disabled =
    false);
}

document.getElementById("copyData").addEventListener("click", () => {
  const data = document.getElementById("data").innerText || "NOT FOUND";
  const membersInfo =
    document.getElementById("members-info").innerText || "NOT FOUND";

  const allFields = `${data}\n\n${membersInfo}`;
  navigator.clipboard.writeText(allFields);
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0].url;
    const allowedUrls = ["taiga"];

    if (!allowedUrls.some((url) => currentUrl.includes(url))) {
      document.getElementById("error").style.display = "block";
      document.getElementById("content").style.display = "none";
    } else {
      document.getElementById("content").style.display = "block";
      document.getElementById("error").style.display = "none";
    }
  });

  document.getElementById("refresh").addEventListener("click", () => {
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
      }) => {
        activateCopyButton();

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];

          chrome.tabs.sendMessage(activeTab.id, {
            action: "receiveDataInPage",
            data: {
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
            },
          });
        });
      }
    );
  });
});
