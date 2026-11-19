export function mergeTriplets(triplets: number[][], target: number[]): boolean {
  const best = [0, 0, 0]; // largest value seen at each position
  for (const triplet of triplets) {
    // A triplet with a value above the target can never be merged in.
    if (triplet.some((value, i) => value > target[i])) continue;
    for (let i = 0; i < 3; i++) best[i] = Math.max(best[i], triplet[i]);
  }
  // Merging every usable triplet gives `best`.
  return best.every((value, i) => value === target[i]);
}
