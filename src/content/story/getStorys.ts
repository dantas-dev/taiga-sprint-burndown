import { Story } from "../../interfaces";
import { calculatePercentage } from "../calculatePercentage";
import { getTasks } from "../task/getTasks";
import { getTotalTasksInfos } from "../task/getTotalTasksInfos";
import { parseTime } from "../time/parseTime";
import { subtractTimes } from "../time/subtractTimes";

export function getStorys(): Story[] {
  try {
    const storys: Story[] = [];
    document
      .querySelectorAll('.taskboard-row')
      .forEach((item) => {
        const tasks = getTasks(item);
        const { totalHR, totalTypes, totalClosed, totalNew, totalClosedHR } = getTotalTasksInfos(tasks);

        const totalPercent = calculatePercentage(parseTime(totalClosedHR), parseTime(totalHR));
        const remainingHours = subtractTimes(totalClosedHR, totalHR);

        // console.log(item.querySelector('.us-title')?.innerText || 'NOT FOUND', tasks);
        storys.push({
          name: (item.querySelector('.us-title') as HTMLElement)?.innerText || 'NOT FOUND',
          tasks,
          totalHR,
          totalTypes,
          totalClosed,
          totalClosedHR,
          totalNew,
          totalPercent,
          remainingHours,
        })
      });

    return storys;
  } catch (error) {
    // console.log(error);
    return [];
  }
}