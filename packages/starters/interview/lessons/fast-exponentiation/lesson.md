# Halving the Exponent

A loop that does one operation `n` times takes `n` steps. About log `n` steps are enough. Double the value and halve the count. When the count is odd, one copy is left over, so add it back.

## Worked example

Multiply `x` by `n` with additions only: `x * n` equals `(x + x) * (n / 2)`, plus one more `x` when `n` is odd.

```ts
function times(x: number, n: number): number {
  if (n === 0) return 0;
  const half = times(x + x, Math.floor(n / 2));
  return n % 2 === 1 ? half + x : half;
}

// times(7, 13) is 91
// the calls use n = 13, 6, 3, 1, 0: 5 calls, not 13 additions
```

## Why it works

- `x + x` doubles the value, and `Math.floor(n / 2)` halves the count.
- When `n` is odd, the halving drops one `x`. The last line adds it back.
- `n` halves on every call. For `n` of one billion, that is about 30 calls.
- Powers work the same way: `x` to the `n` is `x * x` to the `n / 2`, times one more `x` when `n` is odd.

## When to use it

- The task asks for a power, and the exponent can be huge.
- The task repeats the same step `n` times, and two steps can be joined into one bigger step.
- The expected time is O(log n), and nothing is sorted.
