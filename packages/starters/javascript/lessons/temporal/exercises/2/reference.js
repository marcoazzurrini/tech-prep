export function endTime(start, minutes) {
  const end = Temporal.PlainTime.from(start).add({ minutes });
  return end.toString().slice(0, 5);
}
