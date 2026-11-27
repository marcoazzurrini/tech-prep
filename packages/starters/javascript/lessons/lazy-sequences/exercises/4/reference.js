export function firstWords(source, n) {
  return Iterator.from(source)
    .take(n)
    .map((word) => word.toUpperCase())
    .toArray();
}
