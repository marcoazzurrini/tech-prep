# Tracking a Range of Possibilities

Sometimes a step is unknown: it could change a count in more than one way. Do not try every choice. Keep the smallest and the largest value the count could have. Fail only when the whole range is impossible.

## Worked example

A shop starts with 5 items. Each day logs how many were sold. `null` means the log is missing: 0, 1 or 2 items were sold. Find how many items can be left.

```ts
const sold = [2, null, 1, null];
let low = 5; // fewest items that can be left
let high = 5; // most items that can be left
let possible = true;

for (const s of sold) {
  low -= s ?? 2; // unknown day: the most were sold
  high -= s ?? 0; // unknown day: none were sold
  if (high < 0) possible = false; // even the best case is below zero
  low = Math.max(low, 0); // stock cannot go below zero
}

// low: 0, high: 2, possible: true
```

## Why it works

- Every value between `low` and `high` can happen. So two numbers stand for all the choices.
- `high < 0` means the best case already breaks the rule. No choice can fix that.
- `low` going below zero only rules out some choices. The clamp drops those and keeps the rest.

## When to use it

- Some inputs are wildcards: each can mean one of a few things.
- The rule is about a running count, such as "never below zero" or "zero at the end".
- Trying every meaning of every wildcard would take exponential time.
