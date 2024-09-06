import { Story, SumStorys } from '../../interfaces';
import { sumTimes} from '../time/sumTimes'

export function sumStorys(storys: Story[]): SumStorys {
  
  let totalHR = '0.00';
  let totalClosedHR = '0.00';
  let totalClosed = 0;
  let totalNew = 0;
  const totalTypes = {};

  storys.forEach((story) => {
    totalHR = sumTimes(totalHR, story.totalHR);
    totalClosedHR = sumTimes(totalClosedHR, story.totalClosedHR);
    totalClosed += story.totalClosed;
    totalNew += story.totalNew;
    Object.keys(story.totalTypes).forEach((type) => {
      totalTypes[type] = (totalTypes[type] || 0) + story.totalTypes[type];
    });
  });
  

  return { totalHR, totalTypes, totalClosed, totalNew, totalClosedHR };
}