# XOR Tricks

XOR has two useful rules: `x ^ x` is 0, and `x ^ 0` is `x`. The order does not matter. So when you XOR many values together, every value that appears twice cancels itself. Only the values that appear an odd number of times remain.

## Worked example

Three lamps start off. Each button press flips one lamp. Find the lamps that are on at the end.

```ts
// Each press is a mask with one bit set: the lamp it flips.
const presses = [0b001, 0b100, 0b010, 0b001, 0b100];
let lamps = 0; // all lamps are off

for (const press of presses) {
  lamps ^= press;
}

// lamps is 0b010: only the middle lamp is on
```

## Why it works

- `lamps = 0` is a safe start, because `x ^ 0` is `x`.
- Two presses of the same button cancel: `x ^ x` is 0. It does not matter how far apart they are.
- The loop keeps one integer and no map or set. That is O(1) extra space.

## When to use it

- Every value comes in pairs, and one value does not.
- Two collections are almost the same, and you must find the one difference.
- The task asks for O(1) extra space where a hash set would be the easy answer.
