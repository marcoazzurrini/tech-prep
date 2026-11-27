export function highestFirst(scores) {
  return scores.toSorted((a, b) => b - a);
}
