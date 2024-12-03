import { Story } from "../../interfaces";

function checkNaN(hr: string) {
  return hr.includes("NaN") ? "NOT FOUND" : hr;
}

export function fillStoriesInfo(stories: Story[]) {
  let totalStories = '';
  const taskboardCards = document.querySelectorAll(".taskboard-us");
  taskboardCards.forEach((taskboardCard: HTMLDivElement, index: number) => {
    const title = taskboardCard.querySelector(".us-title") as HTMLElement;
    const story = stories.find((story: Story) => story.name == title.innerText);
    const storyData = document.createElement("ul");
    storyData.id = "stories";
    storyData.innerHTML = `<li>TOTAL (HR): ${checkNaN(
      story.totalHR
    )} (${checkNaN(story.remainingHours)} - ${checkNaN(
      story.totalPercent
    )}%)</li>
        <li>CLOSED (HR): ${checkNaN(story.totalClosedHR)}</li>
        </li>NEW CLOSED (HR): ${checkNaN(story.totalNewHR)}</li>
        <li>TASKS (QTD): ${story.tasks.length} (CLOSED: ${
      story.totalClosed
    } / NEW: ${story.totalNew})</li>`;
    title.appendChild(storyData);
    storyData.style.fontSize = "10px";
    storyData.style.paddingTop = "1rem";
    storyData.style.color = "#4c566a";
    const storyRow = taskboardCard.parentElement.parentElement;
    totalStories +=
      story.name.replace("\n", " ") + "\n" + storyData.innerText + "\n\n";
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

  return {
    countTotal: totalStories,
  }
}
