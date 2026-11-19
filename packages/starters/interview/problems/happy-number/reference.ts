export function isHappy(n: number): boolean {
  const seen = new Set<number>();
  // A number that comes back means a loop: 1 will never be reached.
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    let next = 0;
    for (; n > 0; n = Math.floor(n / 10)) {
      next += (n % 10) ** 2;
    }
    n = next;
  }
  return n === 1;
}
