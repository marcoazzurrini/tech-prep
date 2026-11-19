export function distinctTopScores(scores: number[], k: number): number[] {
  const sorted = [...scores].sort((a, b) => b - a); // equal scores are now neighbours
  const result: number[] = [];
  let i = 0;
  while (i < sorted.length && result.length < k) {
    result.push(sorted[i]);
    i++;
    // Move past every copy of the score just used.
    while (i < sorted.length && sorted[i] === sorted[i - 1]) i++;
  }
  return result;
}
