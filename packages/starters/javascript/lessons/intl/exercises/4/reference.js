const format = new Intl.RelativeTimeFormat("en-US");

export function sinceLabel(minutes) {
  if (minutes < 60) {
    return format.format(-minutes, "minute");
  }

  if (minutes < 1440) {
    return format.format(-Math.floor(minutes / 60), "hour");
  }

  return format.format(-Math.floor(minutes / 1440), "day");
}
