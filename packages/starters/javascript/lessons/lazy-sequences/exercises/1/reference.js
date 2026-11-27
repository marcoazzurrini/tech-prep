export function* take(source, n) {
  if (n <= 0) return;

  let count = 0;

  for (const item of source) {
    yield item;
    count++;
    if (count === n) return;
  }
}
