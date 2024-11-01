import { MemberTaskInfo } from "../interfaces";

export function renderMembersInfos(membersInfos: MemberTaskInfo[]) {
  return membersInfos.reduce((acc, curr) => {
    return acc + `Membro: ${curr.member} | HRs: ${curr.hours} | Tasks: ${curr.tasks}\n`;
  }, '')
}
