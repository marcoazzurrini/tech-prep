# Binary Search

In sorted data, one look at the middle item tells you which half cannot hold the target. Keep an interval `lo..hi` where the target must be. Each step drops half of it. A million items need only about 20 steps.

## Worked example

Check if a word is in a sorted list of words.

```ts
const words = ["ant", "bee", "cat", "dog", "eel", "fox"];
const target = "eel";
let lo = 0;
let hi = words.length - 1;
let found = false;

while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (words[mid] === target) {
    found = true;
    break;
  }
  if (words[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
// found: true, after looking at "cat" and then "eel"
```

## Why it works

- `lo` and `hi` are both inside the interval. So the loop runs while `lo <= hi`: one item left is still an item to check.
- `"cat"` comes before `"eel"`. Everything left of `"cat"` is even smaller, so `lo = mid + 1` drops that half and `mid` too.
- `mid + 1` and `mid - 1` always make the interval smaller. Using plain `mid` here can loop forever.

## When to use it

- The input is sorted, or the task says "sorted".
- The task asks for O(log n) time.
- You search for one value, and a comparison tells you to go left or right.
