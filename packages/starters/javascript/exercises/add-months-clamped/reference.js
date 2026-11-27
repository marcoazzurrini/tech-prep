export function addMonths(day, months) {
  const start = new Date(day);
  const year = start.getUTCFullYear();
  const month = start.getUTCMonth() + months;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const date = Math.min(start.getUTCDate(), lastDay);

  return new Date(Date.UTC(year, month, date)).toISOString().slice(0, 10);
}
