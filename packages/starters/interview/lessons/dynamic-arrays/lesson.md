# Dynamic Arrays

An array keeps items in order. You read an item by its index, and you add an item at the end with `push`. Both are fast: O(1). Copying or searching touches every item: O(n).

## Worked example

Take every second score. Then read the last score and copy the last two.

```ts
const scores = [70, 85, 90, 60, 75];
const picked: number[] = [];

for (let i = 0; i < scores.length; i += 2) {
  picked.push(scores[i]);
}

const last = scores[scores.length - 1];
const lastTwo = scores.slice(-2);

// picked: [70, 90, 75], last: 75, lastTwo: [60, 75]
```

## Why it works

- `scores[i]` goes straight to index `i`. It costs O(1) for an array of any size.
- `push` adds at the end, so no other item moves. It costs O(1).
- `slice` builds a new array. It copies every item it keeps, so it costs O(n).

## When to use it

- The task asks you to build a new list from an old one. Start with an empty array and `push`.
- The task names positions: "first", "last", "every second", "the item at index `i`".
- The input is a string. A string works the same way: `word[0]` is the first letter, and `word.length` is the size.
