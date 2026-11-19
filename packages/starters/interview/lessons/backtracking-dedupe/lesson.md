# Skipping Duplicate Choices

When the input has equal values, plain backtracking builds the same answer more than once. Sort the input first. Then, at one depth, skip a value that is equal to the value just tried.

## Worked example

Draw two tiles from `a`, `a`, `b`. List each different pair once.

```ts
const tiles = ["b", "a", "a"].sort(); // a, a, b
const results: string[] = [];

function pick(start: number, hand: string): void {
  if (hand.length === 2) {
    results.push(hand);
    return;
  }
  for (let i = start; i < tiles.length; i++) {
    if (i > start && tiles[i] === tiles[i - 1]) continue; // skip
    pick(i + 1, hand + tiles[i]);
  }
}
pick(0, "");
// results: aa, ab. Without the skip: aa, ab, ab
```

## Why it works

- Sorting puts equal values next to each other. One look at `tiles[i - 1]` finds a repeat.
- One run of the loop is one depth. The skip stops the second `a` from starting the same branch again.
- `i > start` keeps the first value of each loop. So `aa` still works: the second `a` is picked one level deeper.

## When to use it

- The task says the input "may contain duplicates".
- The task asks for "unique" or "distinct" combinations or subsets.
- Your backtracking is right, but some answers appear twice.
