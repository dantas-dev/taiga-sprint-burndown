export interface Task {
  type: string;
  title: string;
  hours: string;
  isClosed: boolean;
  isNew: boolean;
  assignedTo: string;
  memberImageUrl: string;
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
  totalNewHR: string,
  totalClosedNewHR: string,
}

export interface TotalTaskInfo {
  totalHR: string;
  totalTypes: { [key: string]: string };
  totalClosed: number;
  totalClosedHR: string;
  totalNew: number;
  totalNewHR: string,
  totalClosedNewHR: string,
}

export interface SumStorys {
    totalHR: string,
    totalTypes: any,
    totalClosed: number,
    totalNew: number,
    totalClosedHR: string
    totalNewHR: string,
  } 

export interface MemberTaskInfo {
  member: string;
  img: string;
  tasks: number;
  hours: string;
}
