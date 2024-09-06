import { Task } from "../../interfaces";
import { getTaskInfo } from "./getTaskInfo";

export function getTasks(document: Element): Task[] {
  try {
    const tasks: Task[] = [];
    document.querySelectorAll('.card-inner')
      .forEach((item) => {
        tasks.push(getTaskInfo(item))
      })

    
    return tasks;
  } catch (error) {
    return [];
  }
}