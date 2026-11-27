const NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function weekdayName(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return NAMES[date.getUTCDay()];
}
