export interface Task {
  type: string;
  title: string;
  hours: string;
  isClosed: boolean;
  isNew: boolean;
  assignedTo: string;
}

export interface Story {
  name: string;
  tasks: Task[];
  totalHR: string;
  totalTypes: { [key: string]: string };
  totalClosed: number;
  totalClosedHR: string;
  totalNew: number;
  totalPercent: string;
  remainingHours: string;
}

export interface TotalTaskInfo {
  totalHR: string;
  totalTypes: { [key: string]: string };
  totalClosed: number;
  totalClosedHR: string;
  totalNew: number;
}

export interface SumStorys {
    totalHR: string,
    totalTypes: {[key: string]: string},
    totalClosed: number,
    totalNew: number,
    totalClosedHR: string
  } 

export interface MemberTaskInfo {
  member: string;
  tasks: number;
  hours: string;
}