function* naturals() {
  let n = 1;
  while (true) yield n++;
}

export function firstSquaresOver(limit, count) {
  return naturals()
    .map((n) => n * n)
    .filter((square) => square > limit)
    .take(count)
    .toArray();
}
