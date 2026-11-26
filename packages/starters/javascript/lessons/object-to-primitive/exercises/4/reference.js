const DAY = 86_400_000;

export function deadline(start, days) {
  return new Date(start.getTime() + days * DAY);
}
