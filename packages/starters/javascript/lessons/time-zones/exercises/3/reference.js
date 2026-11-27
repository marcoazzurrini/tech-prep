export function nextWeek(date) {
  const next = new Date(date);
  next.setDate(next.getDate() + 7);
  return next;
}
