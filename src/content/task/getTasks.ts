import { getTaskInfo } from "./getTaskInfo";

export function getTasks(document) {
  try {
    const tasks = [];
    document.querySelectorAll('.card-inner')
      .forEach((item) => {
        tasks.push(getTaskInfo(item))
      })

    
    return tasks;
  } catch (error) {
    return [];
  }
}