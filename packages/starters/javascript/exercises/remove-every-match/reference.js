export function removeEvery(list, value) {
  const kept = list.filter((item) => item !== value);
  const removed = list.length - kept.length;

  // Empty the caller's array and refill it, so the caller sees the result.
  list.length = 0;
  list.push(...kept);

  return removed;
}
