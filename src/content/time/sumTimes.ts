import { formatTime } from "./formatTime";
import { parseTime } from "./parseTime";

export function sumTimes(...times) {
  
  const totalMinutes = times.reduce((sum, time) => sum + parseTime(time), 0);
  return formatTime(totalMinutes);
}