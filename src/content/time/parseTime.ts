export function parseTime(time: string): number {
  const [hours, minutes] = time.split('.').map(Number);
  return hours * 60 + (minutes || 0); // convert to minutes
}