export function threeSum(nums: number[]): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue; // skip duplicate first values
    let lo = i + 1;
    let hi = sorted.length - 1;
    while (lo < hi) {
      const total = sorted[i] + sorted[lo] + sorted[hi];
      if (total < 0) lo++;
      else if (total > 0) hi--;
      else {
        result.push([sorted[i], sorted[lo], sorted[hi]]);
        lo++;
        while (lo < hi && sorted[lo] === sorted[lo - 1]) lo++; // skip duplicate second values
        hi--;
      }
    }
  }
  return result;
}
