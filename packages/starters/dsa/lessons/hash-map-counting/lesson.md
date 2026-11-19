# Frequency Counting

A map can hold a count for each value. Walk the input once, and add 1 to the count of each value you meet. Then use the counts to compare or rank the values.

## Worked example

Count the votes for each colour. Then find the colour with the most votes.

```ts
const votes = ["red", "blue", "red", "green", "red", "blue"];
const counts = new Map<string, number>();

for (const vote of votes) {
  counts.set(vote, (counts.get(vote) ?? 0) + 1);
}

let winner = "";
for (const [colour, count] of counts) {
  if (count > (counts.get(winner) ?? 0)) winner = colour;
}

// counts: red 3, blue 2, green 1. winner: "red"
```

## Why it works

- `counts.get(vote) ?? 0` reads the count so far. A value you have not met yet counts as 0.
- `counts.set` writes the new count back. One pass fills the whole map in O(n).
- The second loop goes over the different values. It does not read the input again.

## When to use it

- The task says "how many times", "most common", "appears once" or "the same letters".
- Two inputs must hold the same items in any order. Count both, then compare the counts.
- The order of the items does not matter. Only the number of each item matters.
