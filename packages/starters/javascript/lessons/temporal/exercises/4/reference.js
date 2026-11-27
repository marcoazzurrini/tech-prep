export function sortDays(days) {
  const dates = days.map((day) => Temporal.PlainDate.from(day));
  return dates.toSorted(Temporal.PlainDate.compare).map(String);
}
