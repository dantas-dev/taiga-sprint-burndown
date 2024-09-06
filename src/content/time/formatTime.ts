export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}.${mins.toString().padStart(2, '0')}`; // ensure two-digit minute part
}
