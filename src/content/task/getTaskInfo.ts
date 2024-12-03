import { Task } from "../../interfaces";

export function getTaskInfo(item: Element): Task {
  const str = item.querySelector<HTMLElement>('.card-title').innerText || '';
  const isClosed = !!item.querySelector('.card-tag[title=closed]');
  const isNew = !!item.querySelector('.card-tag[title=new]');
  const assignedTo = item.querySelector<HTMLImageElement>('.card-user-avatar img').title;
  const memberImageUrl = item.querySelector<HTMLImageElement>('.card-user-avatar img').src;
  
  const regex = /#\d+\[([^\]]+)\]\s*([^\(]+)\s*\(([^)]+)\)/;
  const matches = str.match(regex);

  let type = '';
  let title = '';
  let hours = '';

  if (matches) {
    type = matches[1].trim();
    title = matches[2].trim();
    hours = matches[3].trim().replace('H', '');
  }

  return {
    type,
    title,
    hours,
    isClosed,
    isNew,
    assignedTo,
    memberImageUrl
  }
}