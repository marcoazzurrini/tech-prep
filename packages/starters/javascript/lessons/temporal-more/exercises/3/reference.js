export function dueDates(firstMonth, day, count) {
  const start = Temporal.PlainYearMonth.from(firstMonth);
  const dates = [];

  for (let i = 0; i < count; i++) {
    const month = start.add({ months: i });
    dates.push(month.toPlainDate({ day }).toString());
  }

  return dates;
}
