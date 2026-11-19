# Kadane's Algorithm

You want the best sum of a run of neighbours. Walk the array once and keep the best run that ends at the current element. Extend that run only while its sum helps. Otherwise restart at the current element.

## Worked example

Find the best net score of any streak of games. A win counts +1 and a loss counts -1.

```ts
const results = "LWWLWWWLL";
let current = 0; // best streak that ends at this game
let best = -Infinity; // best streak seen anywhere

for (const result of results) {
  const score = result === "W" ? 1 : -1;
  // Extend the streak, or restart at this game.
  current = Math.max(score, current + score);
  best = Math.max(best, current);
}

// best: 4, from the streak "WWLWWW"
```

## Why it works

- A streak that ends here is either this game alone, or the best streak that ends one game earlier plus this game. `Math.max` picks the better one.
- A streak with a negative sum only hurts what comes next. So the restart drops it.
- `best` remembers the top value, because the best streak can end anywhere.

## When to use it

- The task asks for the largest or smallest sum of a **contiguous** part of an array.
- The values can be negative. With only positive values, the whole array wins.
- You need O(n) time and trying every start and end is too slow.
