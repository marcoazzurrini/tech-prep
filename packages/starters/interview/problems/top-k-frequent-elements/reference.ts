export function topKFrequent(nums: number[], k: number): number[] {
  const counts = new Map<number, number>();
  for (const n of nums) counts.set(n, (counts.get(n) ?? 0) + 1);
  // Bucket sort: buckets[f] holds the values that appear exactly f times.
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [n, f] of counts) buckets[f].push(n);
  const result: number[] = [];
  for (let f = buckets.length - 1; f > 0; f--) {
    for (const n of buckets[f]) {
      result.push(n);
      if (result.length === k) return result;
    }
  }
  return result;
}
