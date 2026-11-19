# DP over Two Strings

To compare two strings, solve the task for their prefixes first. `dp[i][j]` is the answer for the first `i` characters of `a` and the first `j` characters of `b`. At each cell, look at the last character of each prefix: match them, or skip one of them.

## Worked example

Delete as few letters as possible so that two words become equal.

```ts
const a = "sea";
const b = "eat";
const del = [[0, 1, 2, 3]];

for (let i = 1; i <= a.length; i++) {
  del.push([i]);
  for (let j = 1; j <= b.length; j++) {
    if (a[i - 1] === b[j - 1]) {
      del[i].push(del[i - 1][j - 1]);
    } else {
      del[i].push(1 + Math.min(del[i - 1][j], del[i][j - 1]));
    }
  }
}

// del[3][3] is 2: delete "s" and "t", and both words are "ea"
```

## Why it works

- `del[i][j]` is the number of letters to delete so that `a[:i]` and `b[:j]` are equal.
- Row `0` and column `0` stand for an empty prefix. To equal an empty string, delete every letter of the other prefix.
- Same last letters: keep both, and reuse the answer for the two shorter prefixes. Different: delete one of them. Try both, and take the cheaper one plus `1`.

## When to use it

- The input is two strings or two lists, and their order matters.
- The task says "common", "subsequence", "turn one into the other" or "match".
- A choice about the last characters leaves a smaller task of the same kind.
