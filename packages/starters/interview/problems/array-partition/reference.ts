export function arrayPairSum(nums: number[]): number {
  // After sorting, pair each value with its neighbour.
  // The larger value of a pair is lost, so lose as little as possible.
  const sorted = [...nums].sort((a, b) => a - b);
  let total = 0;
  // The smaller value of each pair sits at an even index.
  for (let i = 0; i < sorted.length; i += 2) total += sorted[i];
  return total;
}
