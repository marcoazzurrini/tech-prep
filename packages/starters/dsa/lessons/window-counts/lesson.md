# Window with Counts

Some rules depend on how often each item appears in the window. Keep a count map for the window. Add 1 when an item enters, and take 1 away when it leaves. Then check the rule from the map, without reading the window again.

## Worked example

Find the longest substring with at most 2 different letters.

```ts
const s = "aabcbbc";
const count = new Map<string, number>();
let left = 0;
let best = 0;

for (let right = 0; right < s.length; right++) {
  count.set(s[right], (count.get(s[right]) ?? 0) + 1);
  while (count.size > 2) {
    const c = s[left];
    count.set(c, count.get(c)! - 1);
    if (count.get(c) === 0) count.delete(c);
    left++;
  }
  best = Math.max(best, right - left + 1);
}
// best: 5 ("bcbbc")
```

## Why it works

- The map always matches the window: one update when a letter enters, one when it leaves.
- `count.delete(c)` removes a letter when its count reaches 0. So `count.size` is the number of different letters in the window.
- The check `count.size > 2` is O(1). The rest is a normal variable window.

## When to use it

- The rule is about letter counts: "at most `k` different", "no letter more than", "has every letter of `t`".
- The answer is a substring or subarray, so the items are in a row.
- With only lowercase letters, an array of 26 counts can replace the map.
