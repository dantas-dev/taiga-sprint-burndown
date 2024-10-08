import { MemberTaskInfo } from "../../interfaces";

function fillMembersTable(
  table: HTMLTableElement,
  membersInfo: MemberTaskInfo[]
) {
  table
    .querySelectorAll("tr:not(:first-child)")
    .forEach((row) => row.remove());
  membersInfo.forEach((member) => {
    const row = document.createElement("tr");
    const memberCell = document.createElement("td");
    memberCell.textContent = member.member;
    row.appendChild(memberCell);
    const tasksCell = document.createElement("td");
    tasksCell.textContent = member.tasks.toString();
    row.appendChild(tasksCell);
    const hoursCell = document.createElement("td");
    hoursCell.textContent = member.hours;
    row.appendChild(hoursCell);
    table.appendChild(row);
  });
}