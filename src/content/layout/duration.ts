export const createDurationWrapper = (summary: Element, duration: string) => {
    const durationWrapper = document.createElement("div");
    durationWrapper.id = "duration";
    durationWrapper.className = "summary-stats";
    durationWrapper.style.margin = "0px";
    const durationDescription = document.createElement("span");
    durationDescription.className = "description";
    durationDescription.textContent = duration;
    durationWrapper.appendChild(durationDescription);
    summary.insertBefore(durationWrapper, summary.childNodes[0]);
}