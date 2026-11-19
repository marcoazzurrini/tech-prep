# Unbounded Choices

You build a target amount from a list of choices, and you may use each choice as often as you like. Solve every amount from 0 up to the target. For each amount, try every choice as the last one used.

## Worked example

A shop sells packs of 4 and packs of 7. Check if you can buy exactly 15 items.

```ts
const packs = [4, 7];
const target = 15;
// can[a] = true when some packs add up to exactly a
const can = new Array<boolean>(target + 1).fill(false);
can[0] = true;

for (let a = 1; a <= target; a++) {
  for (const pack of packs) {
    if (pack <= a && can[a - pack]) can[a] = true;
  }
}

// can[15] is true: 4 + 4 + 7. can[13] is false.
```

## Why it works

- If the last pack has size `pack`, the packs before it add up to `a - pack`. That smaller amount is already solved.
- `can[a - pack]` may use the same pack size again. So every choice can be reused with no extra code.
- `can[0] = true` is the base case: zero packs make zero items.

## When to use it

- You must reach an exact amount, length or total from a list of sizes.
- The task says each size can be used any number of times.
- It asks for the fewest pieces, the best value, the number of ways, or just yes or no.
