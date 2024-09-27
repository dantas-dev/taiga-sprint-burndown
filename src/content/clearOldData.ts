function clearOldData(
  mainTaskboard: HTMLDivElement,
  summary: HTMLDivElement
) {
  if (mainTaskboard) {
    mainTaskboard.style.height = "auto";
  }
  if (summary) {
    summary.style.height = "auto";
    summary.style.overflow = "visible";
    summary.style.display = "flex";
    summary.style.flexDirection = "column";

    const iocaineWrapper = summary.querySelector(
      ".summary-stats.summary-iocaine"
    ) as HTMLDivElement;
    const openTasksWrapper = summary.querySelector(
      ".summary-stats.summary-open-tasks"
    ) as HTMLDivElement;
    const moveUnfinishedWrapper = summary.querySelector(
      ".summary-stats.summary-move-unfinished"
    ) as HTMLDivElement;
    const completedPointsWrapper = summary.querySelector(
      ".summary-stats.summary-completed-points"
    ) as HTMLDivElement;
    const toggleAnalyticsWrapper = summary.querySelector(
      ".stats.toggle-analytics-visibility"
    ) as HTMLDivElement;
    toggleAnalyticsWrapper.style.marginLeft = "0";
    const largeSummaryWrapper = summary.querySelector(
      ".large-summary-wrapper"
    ) as HTMLDivElement;
    largeSummaryWrapper.appendChild(toggleAnalyticsWrapper);
    iocaineWrapper.remove();
    openTasksWrapper.remove();
    moveUnfinishedWrapper.style.border = "none";
    completedPointsWrapper.style.border = "none";
  }

  const pointsStats = summary.querySelector(".points-per-role-stats");
  if (pointsStats) {
    pointsStats.remove();
  }
}