import { Task, TotalTaskInfo } from "../../interfaces";
import { sumTimes } from "../time/sumTimes";

export function getTotalTasksInfos(tasks: Task[]): TotalTaskInfo {
  let totalHR = '0.00';
  let totalClosedHR = '0.00';
  let totalClosed = 0;
  let totalNew = 0;
  let totalNewHR = '0.00'
  let totalClosedNewHR = '0.00';
  const totalTypes = {};

  tasks.forEach((task) => {
    totalHR = sumTimes(totalHR, task.hours);
    totalTypes[task.type] = (totalTypes[task.type] || 0) + 1;
    totalClosed += task.isClosed ? 1 : 0;
    totalNew += task.isNew ? 1 : 0;

    totalNewHR = task.isNew ? sumTimes(totalNewHR, task.hours) : totalNewHR;
    totalClosedHR = task.isClosed ? sumTimes(totalClosedHR, task.hours) : totalClosedHR;
    totalClosedNewHR = (task.isNew && task.isClosed) ? sumTimes(totalClosedNewHR, task.hours) : totalClosedNewHR
  });

  return {
    totalHR,
    totalTypes,
    totalClosed,
    totalClosedHR,
    totalNew,
    totalNewHR,
    totalClosedNewHR,
  };
}