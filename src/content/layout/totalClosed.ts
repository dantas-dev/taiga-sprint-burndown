export const updateTotalClosedWrapper = (totalClosed: number) => {
  const totalClosedWrapper = document.querySelector(".summary-closed-tasks");
  const totalClosedNumber = totalClosedWrapper.childNodes[0] as HTMLElement;
  totalClosedNumber.innerText = `${totalClosed}`;
};
