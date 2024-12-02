export const createDurationWrapper = (summary: Element, duration: string) => {
    const durationWrapper = document.createElement("div");
    durationWrapper.className = "summary-stats";
    durationWrapper.style.margin = "0px";
    const durationDescription = document.createElement("span");
    durationDescription.id = "duration";
    durationDescription.className = "description";
    durationDescription.textContent = duration;
    durationWrapper.appendChild(durationDescription);
    summary.insertBefore(durationWrapper, summary.childNodes[0]);
}