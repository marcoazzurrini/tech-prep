export function toTimestamp(text) {
  const ms = new Date(text).getTime();
  return Number.isNaN(ms) ? null : ms;
}
