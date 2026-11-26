export function trackAt(position, count) {
  return ((position % count) + count) % count;
}
