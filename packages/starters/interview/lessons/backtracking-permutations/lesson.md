# Permutations

Sometimes the order of the items matters. Then each step may pick any item that is not used yet. Keep track of the used items. Release each item after you explore its branch.

## Worked example

Three runners are `A`, `B` and `C`. List every way to give first and second place.

```ts
const results: string[] = [];
const used = new Set<string>();

function place(podium: string): void {
  if (podium.length === 2) {
    results.push(podium);
    return;
  }
  for (const runner of "ABC") {
    if (used.has(runner)) continue; // already placed
    used.add(runner);
    place(podium + runner);
    used.delete(runner); // release
  }
}
place(""); // results: AB, AC, BA, BC, CA, CB
```

## Why it works

- The loop starts from the first runner every time. That is why both `AB` and `BA` appear.
- `used` stops a runner from taking two places.
- `used.delete(runner)` frees the runner. The next branch can then put that runner in another place.

## When to use it

- The task says "order", "arrange", "sequence" or "permutation".
- The same items in another order count as a different answer.
- Each item can be used once. If order does not matter, loop from a start index and skip the used set.
