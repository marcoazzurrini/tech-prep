export function fib(n: number): number {
  const memo = new Map<number, number>();

  function go(k: number): number {
    // Base case first: fib(0) = 0 and fib(1) = 1.
    if (k < 2) return k;
    const known = memo.get(k);
    if (known !== undefined) return known;
    // Trust the same function on the two smaller inputs. Store each answer once.
    const value = go(k - 1) + go(k - 2);
    memo.set(k, value);
    return value;
  }

  return go(n);
}
