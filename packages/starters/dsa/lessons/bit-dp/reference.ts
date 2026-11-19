export function trailingOnesTable(n: number): number[] {
  const table = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    // An odd i has one more trailing one than i without its last bit.
    if ((i & 1) === 1) table[i] = table[i >> 1] + 1;
  }
  return table;
}
