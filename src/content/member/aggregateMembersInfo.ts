import { MemberTaskInfo, Story } from "../../interfaces";
import { formatTime } from "../time/formatTime";
import { parseTime } from "../time/parseTime";

export function aggregateMembersInfo(storys: Story[]): MemberTaskInfo[] {
  const memberMap: { [member: string]: { member: string; hours: number; tasks: number } } = {};

  storys.forEach(story => {
    story.tasks.forEach(task => {
      const { assignedTo, hours } = task;
      if (assignedTo !== 'Not assigned') {
        if (!memberMap[assignedTo]) {
          memberMap[assignedTo] = { member: assignedTo, hours: 0, tasks: 0 };
        }
        memberMap[assignedTo].hours += parseTime(hours);
        memberMap[assignedTo].tasks += 1;
      }
    });
  });

  return Object.values(memberMap).map(({ member, hours, tasks }) => ({
    member,
    hours: formatTime(hours),
    tasks
  }));
}