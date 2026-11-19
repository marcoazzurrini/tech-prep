# Binary Search on the Answer

Some tasks ask for the smallest value that is "enough". Small candidates fail and large candidates work, and the change from no to yes happens once. So the candidates are sorted by their yes or no answer. Binary search over the candidates, not over an array.

## Worked example

Find the smallest square floor that holds 50 tiles. A floor with side `s` holds `s * s` tiles.

```ts
const tiles = 50;
const fits = (side: number) => side * side >= tiles;

let lo = 1; // smallest candidate
let hi = tiles; // largest candidate: it always fits
while (lo < hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (fits(mid)) hi = mid; // mid works: keep it, look for smaller
  else lo = mid + 1; // mid fails: the answer is larger
}

// lo: 8, because 7 * 7 = 49 is too small and 8 * 8 = 64 fits
```

## Why it works

- `fits` is the question "is this candidate enough?". It is `false` for sides 1 to 7 and `true` from 8 on.
- `hi = mid` keeps a candidate that works, because it may be the answer. `lo = mid + 1` drops one that fails.
- The loop ends when `lo === hi`. Only one candidate is left: the first one that works.

## When to use it

- The task asks for the "smallest speed", "least capacity" or "largest size" that meets a limit.
- You can check one candidate fast, but you cannot compute the answer directly.
- If a candidate works, every larger one works too, or every smaller one.
