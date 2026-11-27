export function hoursOnDay(date, zone) {
  return Temporal.PlainDate.from(date).toZonedDateTime(zone).hoursInDay;
}
