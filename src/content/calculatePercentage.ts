
export function calculatePercentage(hoursSpent, totalHours) {
  const percentage = (hoursSpent / totalHours) * 100;
  return percentage.toFixed(2); // Limitando a duas casas decimais
}