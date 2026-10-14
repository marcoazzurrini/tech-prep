export function countBits(n: number): number[] {
  const ans = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) ans[i] = ans[i >> 1]! + (i & 1); // bits of i/2 plus the last bit
  return ans;
}
