# Bits and Masks

A number is a row of bits. Bit 0 is the lowest one. A mask is a number that marks the bits you care about: `1 << k` has only bit `k` set. Combine a number with a mask to read or change single bits.

## Worked example

Read, set, flip and clear bits in a small number.

```ts
let flags = 0b0101;

const isSet = (flags & (1 << 2)) !== 0; // read bit 2: true
flags = flags | (1 << 1); // set bit 1: 0b0111
flags = flags ^ (1 << 0); // flip bit 0: 0b0110
flags = flags & ~(1 << 2); // clear bit 2: 0b0010
flags = flags >> 1; // drop the lowest bit: 0b0001

const n = 0b1100;
const cleared = n & (n - 1); // clear the lowest set bit

// cleared is 0b1000
```

## Why it works

- `&` keeps a bit only when both sides have it. `|` keeps a bit when either side has it. `^` keeps a bit when the two sides differ.
- `n - 1` turns the lowest 1 into 0 and the zeros below it into ones. So `n & (n - 1)` removes that 1 and nothing else.
- In TypeScript these operators work on signed 32-bit integers. Use `>>>` when the top bit must not count as a sign.

## When to use it

- The task talks about the binary form of a number, or about single bits.
- You need a small set of yes or no flags packed in one integer.
- The task asks you to count, find or move bits.
