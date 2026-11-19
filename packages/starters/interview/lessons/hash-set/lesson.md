# Hash Set Lookup

A set stores values with no repeats. It answers "is this value in here?" in O(1). An array needs a search loop for the same question, and that costs O(n). You can also build a set from a whole list: `new Set(list)`.

## Worked example

List each visitor once, in the order of their first visit.

```ts
const visitors = ["ana", "li", "ana", "sam", "li"];
const seen = new Set<string>();
const firstVisits: string[] = [];

for (const name of visitors) {
  if (!seen.has(name)) {
    firstVisits.push(name);
    seen.add(name);
  }
}

// firstVisits: ["ana", "li", "sam"]
```

## Why it works

- `seen.has(name)` is one O(1) step. There is no inner loop over the earlier names.
- `seen.add(name)` remembers the name for every later check.
- The whole loop is O(n). With an array search inside, it would be O(n²).

## When to use it

- The task asks "does this value exist?", "have I seen it before?" or "is it in the other list?".
- Your first idea has a loop inside a loop, and the inner loop only searches for a value. A set replaces the inner loop.
- You only need to know if a value is there. You do not need its position or its count.
