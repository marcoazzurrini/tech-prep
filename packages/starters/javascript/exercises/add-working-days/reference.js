export function addWorkingDays(day, count) {
  let date = Temporal.PlainDate.from(day);
  let left = count;

  while (left > 0) {
    date = date.add({ days: 1 });
    if (date.dayOfWeek <= 5) {
      left -= 1;
    }
  }

  return date.toString();
}
