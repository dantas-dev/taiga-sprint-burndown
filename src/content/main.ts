import { calculatePercentage } from "./calculatePercentage";
import { getDuration } from "./getDuration";
import { getSquadName } from "./squad/getSquadName";
import { getStorys } from "./story/getStorys";
import { sumStorys } from "./story/sumStorys";
import { parseTime } from "./time/parseTime";
import { subtractTimes } from "./time/subtractTimes";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {
    const squadName = getSquadName();
    const duration = getDuration();
    const storys = getStorys();
    const { totalHR, totalTypes, totalClosed, totalNew, totalClosedHR, totalNewHR } = sumStorys(storys);

    const totalPercent = calculatePercentage(parseTime(totalClosedHR), parseTime(totalHR));
    const remainingHours = subtractTimes(totalClosedHR, totalHR);

    // console.log('content', { squadName, duration, storys, totalHR, totalTypes, totalClosed, totalNew, totalClosedHR, totalPercent, remainingHours });

    sendResponse({ squadName, duration, storys, totalHR, totalTypes, totalClosed, totalNew, totalClosedHR, totalPercent, remainingHours, totalNewHR });
  }
});