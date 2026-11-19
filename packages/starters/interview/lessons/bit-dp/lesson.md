# DP on Bits

Sometimes you need a fact about the bits of every number from 0 to n. Do not work on each number from zero. `i >> 1` is `i` without its last bit, and it is a smaller number. Its answer is already in the table, so reuse it.

## Worked example

For every number from 0 to 8, find how many bits you need to write it in binary.

```ts
const n = 8;
// len[i] = number of bits in the binary form of i
const len = new Array<number>(n + 1).fill(0);

for (let i = 1; i <= n; i++) {
  // i is i >> 1 with one more bit at the end.
  len[i] = len[i >> 1] + 1;
}

// len: [0, 1, 2, 2, 3, 3, 3, 3, 4]
```

## Why it works

- `i >> 1` is always smaller than `i`, so its entry is filled before the loop reaches `i`.
- Each entry costs one lookup and one small step. The whole table takes O(n) time.
- `len[0] = 0` is the base case. The loop starts at 1.

## When to use it

- The task asks for one answer per number, for all numbers from 0 to n.
- The answer depends on the bits of the number.
- You can describe the answer for `i` with the answer for `i >> 1` and the last bit, `i & 1`.
