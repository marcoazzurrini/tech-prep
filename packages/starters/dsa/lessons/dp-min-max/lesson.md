# Tracking Min and Max

Multiplying by a negative number flips the order: the smallest value becomes the largest. So the largest value alone is not enough to carry forward. Carry two values at every step: the largest so far and the smallest so far.

## Worked example

Start with 1. For each number, multiply your value by it or skip it. Find the largest final value.

```ts
const nums = [3, -2, 5, -4];
let high = 1; // largest value so far
let low = 1; // smallest value so far

for (const x of nums) {
  const a = high * x;
  const b = low * x;
  high = Math.max(high, a, b);
  low = Math.min(low, a, b);
}

// high is 120: 3 * -2 * 5 * -4
```

## Why it works

- After `-2` and `5`, `low` is -30. It looks useless, but `-30 * -4` gives 120. A loop that keeps only `high` would miss it.
- `a` and `b` are computed first. Both come from the old `high` and `low`, before either one changes.
- The new `high` and `low` are picked from all candidates, so no case is lost.

## When to use it

- The task asks for the largest result and uses multiplication, or another step that can flip the sign.
- The input may hold negative numbers or zero.
- A "keep the best so far" loop gives wrong answers on inputs with two negatives.
