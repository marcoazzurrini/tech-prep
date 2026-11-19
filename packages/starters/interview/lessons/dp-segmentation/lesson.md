# Prefix Segmentation

You must cut a string into valid pieces. Let `dp[i]` be the answer for the first `i` characters. Look at the last piece: if it is valid, the characters before it form a shorter prefix that is already solved.

## Worked example

Count the ways to split a string into pieces. A piece is one letter, or two equal letters.

```ts
const s = "aabb";
// ways[i] = number of ways to split the first i characters
const ways = new Array<number>(s.length + 1).fill(0);
ways[0] = 1;

for (let i = 1; i <= s.length; i++) {
  ways[i] = ways[i - 1]; // the last piece is one letter
  if (i >= 2 && s[i - 2] === s[i - 1]) {
    ways[i] += ways[i - 2]; // the last piece is a double letter
  }
}

// ways: [1, 1, 2, 2, 4], so "aabb" splits in 4 ways
```

## Why it works

- Every split ends with one last piece. Each valid last piece of length `k` adds the answer for the first `i - k` characters.
- `ways[0] = 1` is the base case. The empty prefix has one split: no pieces.
- For a yes or no question, use `true` and `false` in place of counts, and "or" in place of `+=`.

## When to use it

- The task cuts a string into pieces, left to right, and every piece must pass a rule.
- It asks if a split exists, or how many splits exist.
- The rule looks at one piece only: a word from a list, a number in a range, a fixed shape.
