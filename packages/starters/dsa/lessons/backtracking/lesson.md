# Backtracking

Some tasks ask for every possible answer. Build one answer step by step. At each step, make a choice, recurse, then undo the choice. After the undo, the next choice starts from a clean state.

## Worked example

List every result of two coin flips. Each flip is `H` or `T`.

```ts
const results: string[][] = [];
const path: string[] = [];

function flip(left: number): void {
  if (left === 0) {
    results.push([...path]); // save a copy
    return;
  }
  for (const side of ["H", "T"]) {
    path.push(side); // choose
    flip(left - 1); // recurse
    path.pop(); // undo
  }
}
flip(2);
// results: [H, H], [H, T], [T, H], [T, T]
```

## Why it works

- `path` holds the answer built so far. All calls share it.
- `path.pop()` removes the last choice. Without it, `H` would stay in the path when the loop tries `T`.
- `[...path]` saves a copy. The path keeps changing, so saving the path itself would save a list that ends up empty.

## When to use it

- The task says "return all", "every way" or "each combination".
- An answer is a list of choices, and each choice has a few options.
- The input is small, often 10 to 20 items. The number of answers grows very fast.
