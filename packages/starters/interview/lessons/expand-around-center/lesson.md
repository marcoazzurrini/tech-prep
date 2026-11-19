# Expanding around Centres

A palindrome reads the same in both directions, so it has a centre. Start two pointers at the centre and move them outwards while the two letters match. A centre is one letter (odd length) or the gap between two letters (even length).

## Worked example

Grow the longest palindrome around one given centre.

```ts
function grow(s: string, left: number, right: number): string {
  while (left >= 0 && right < s.length && s[left] === s[right]) {
    left--;
    right++;
  }
  // The loop stops one step too far on both sides.
  return s.slice(left + 1, right);
}

grow("xlevely", 3, 3); // the centre is the letter "v"
grow("anoonb", 2, 3); // the centre is the gap between the two "o"

// results: "level" and "noon"
```

## Why it works

- If the two ends match and the inside is a palindrome, the whole piece is a palindrome. So each step outwards needs one comparison only.
- `left === right` starts on a letter. `right === left + 1` starts on a gap. One function covers both.
- A string of length n has n letters and n - 1 gaps. That is 2n - 1 centres, and each takes at most n steps.

## When to use it

- The task is about palindromes inside a string: count them, or find the longest one.
- The palindrome must be one unbroken piece of the string.
- You want O(n^2) time with no extra table.
