import { formatTime } from "./formatTime";
import { parseTime } from "./parseTime";

export function subtractTimes(time1: string, time2: string): string {
  const minutes1 = parseTime(time1);
  const minutes2 = parseTime(time2);
  const resultMinutes = Math.max(0, minutes2 - minutes1);
  return formatTime(resultMinutes);
}
