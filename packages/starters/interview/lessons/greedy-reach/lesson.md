# Greedy Reach

Keep one number: the farthest point you can reach so far. Each new item may push that point farther. If an item starts beyond that point, you can never get to it. You are stuck.

## Worked example

Check that a help desk is staffed from hour 9 to hour 17. The shifts are sorted by start hour.

```ts
const shifts = [
  [9, 12],
  [11, 14],
  [13, 17],
]; // [start, end]
let covered = 9; // staffed up to this hour so far
let staffed = true;

for (const [start, end] of shifts) {
  if (start > covered) {
    staffed = false; // a gap: nobody is there after `covered`
    break;
  }
  covered = Math.max(covered, end);
}
if (covered < 17) staffed = false;

// staffed: true, covered: 17
```

## Why it works

- `covered` holds everything the earlier shifts reach. You do not need to remember which shift reached it.
- `start > covered` means no earlier shift reaches this one. The shifts are sorted, so no later shift can fill the gap.
- `Math.max` keeps the farthest end. A short shift never pulls `covered` back.

## When to use it

- The task asks if you can get from a start to an end, and each step tells you how far you may go from there.
- One pass in order is enough, because reaching a point also reaches every point before it.
- A search or DP over all routes works but is too slow, and only the farthest point matters.
