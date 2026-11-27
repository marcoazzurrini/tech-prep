const format = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function shortDay(text) {
  return format.format(new Date(text));
}
