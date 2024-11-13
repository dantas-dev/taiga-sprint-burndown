import { MemberTaskInfo } from "../../interfaces";

export function fillMembersTable(
  table: HTMLTableElement,
  membersInfo: MemberTaskInfo[]
) {
  membersInfo.forEach((member) => {
    const row = document.createElement("tr");
    row.style.display = "flex";
    row.style.alignItems = "center";
    const memberImageCell = document.createElement("td");
    memberImageCell.innerHTML = `<img src="${member.img}"
    alt="${member.member}"
    title="${member.member}"
    style="border: 2px solid #fff; border-radius: 15px; display: flex; height: 30px; width: 30px;"/>`;
    row.appendChild(memberImageCell);
    const memberCell = document.createElement("td");
    memberCell.textContent = `${member.member}: `;
    row.appendChild(memberCell);
    const hoursCell = document.createElement("td");
    hoursCell.textContent = `${member.hours}H`;
    row.appendChild(hoursCell);
    const tasksCell = document.createElement("td");
    tasksCell.textContent = `(${member.tasks.toString()} tasks)`;
    row.appendChild(tasksCell);
    table.appendChild(row);
  });
}