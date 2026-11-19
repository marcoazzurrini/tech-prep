# Subsequence DP

A subsequence keeps some items and leaves the rest out, without changing the order. Let `dp[i]` be the best subsequence that ends exactly at item `i`. To fill it, look at every earlier item `j` that is allowed to come just before `i`.

## Worked example

Find the longest chain in which each number divides the next number of the chain.

```ts
const nums = [2, 3, 4, 9, 8];
// best[i] = longest chain that ends at nums[i]
const best = new Array<number>(nums.length).fill(1);

for (let i = 0; i < nums.length; i++) {
  for (let j = 0; j < i; j++) {
    if (nums[i] % nums[j] === 0) {
      best[i] = Math.max(best[i], best[j] + 1);
    }
  }
}

// best: [1, 1, 2, 2, 3], so the longest chain is 2, 4, 8
```

## Why it works

- Each entry starts at 1. An item alone is a chain.
- "Ends exactly at `i`" tells you the last item of the chain. So one test between `j` and `i` is enough to extend it.
- The longest chain can end anywhere. The answer is the largest entry, not the last one.

## When to use it

- The task says "subsequence": you may leave items out, but the order stays.
- A rule links each chosen item to the chosen item before it, such as "larger than" or "divides".
- It asks for the longest or best such subsequence, and O(n^2) time is fine.
