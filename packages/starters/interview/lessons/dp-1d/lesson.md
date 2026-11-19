# 1-D Dynamic Programming

Some answers are built from the answers to smaller inputs. Say in words what `dp[i]` means. Write how `dp[i]` comes from earlier entries. Then fill the array from small to large.

## Worked example

Count the ways to fill a row of length 6 with tiles of length 1 and 3.

```ts
const n = 6;
// ways[i] = number of ways to fill a row of length i
const ways = new Array<number>(n + 1).fill(0);
ways[0] = 1;

for (let i = 1; i <= n; i++) {
  ways[i] = ways[i - 1];
  if (i >= 3) ways[i] += ways[i - 3];
}

// ways: [1, 1, 1, 2, 3, 4, 6], so the answer is 6
```

## Why it works

- The last tile has length 1 or 3. The row before it has length `i - 1` or `i - 3`. Both counts are already in the array.
- `ways[0] = 1` is the base case. There is one way to fill an empty row: use no tiles.
- The loop goes up, so every entry it reads is ready.

## When to use it

- The task asks for a number of ways, or for a best value (min or max). It does not ask for the list of all options.
- The answer for size `i` depends on a few smaller sizes only.
- A plain recursion would solve the same small input again and again.
