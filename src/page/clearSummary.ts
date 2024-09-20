export function clearSummary(summary: HTMLDivElement) {
  if (summary.style) {
    summary.style.height = "auto";
    summary.style.overflow = "visible";
  }

  const pointsStats = summary.querySelector(".points-per-role-stats");
  if (pointsStats) {
    pointsStats.remove();
  }
}
