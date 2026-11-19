# Arithmetic with Bits

You can add two numbers with bit operators only. `a ^ b` adds each column but drops the carries. `(a & b) << 1` holds the carries, moved one column to the left. Add these two results in the same way, and repeat until no carry is left.

## Worked example

Add 1 to a number without `+`. The carry moves left until it finds a 0.

```ts
function addOne(n: number): number {
  let bit = 1;
  // A 1 plus the carry gives 0, and the carry moves left.
  while ((n & bit) !== 0) {
    n ^= bit;
    bit <<= 1;
  }
  // The first 0 takes the carry and becomes 1.
  return n ^ bit;
}

addOne(0b1011); // 0b1100: 11 becomes 12
```

## Why it works

- In one column, 1 + 1 is 0 with a carry, and 0 + 1 is 1. XOR gives the digit. AND tells you if there is a carry.
- A carry belongs to the next column on the left. That is the reason for `<<`.
- The carry moves left on every round. It runs out of columns, so the loop ends.

## When to use it

- The task forbids `+` and `-`, or asks you to build arithmetic from bit operators.
- The work looks like a sum done by hand in columns, with a carry or a borrow.
- In Python, integers have no fixed width. Mask with `0xFFFFFFFF` to act like 32 bits when numbers can be negative.
