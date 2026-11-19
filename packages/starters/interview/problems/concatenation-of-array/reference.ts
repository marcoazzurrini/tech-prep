export function getConcatenation(nums: number[]): number[] {
  const ans: number[] = [];
  // Walk nums twice. Each push adds one item at the end in O(1).
  for (let round = 0; round < 2; round++) {
    for (const n of nums) ans.push(n);
  }
  return ans;
}
