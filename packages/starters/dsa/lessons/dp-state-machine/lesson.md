# DP with States

Sometimes what you may do today depends on what you did yesterday. Name each situation you can be in at the end of a day. These are the states. Keep the best total for each state, and update all of them once per day.

## Worked example

Each day you work in shop A or in shop B. Changing shops costs a fee. Find the best total pay.

```ts
const payA = [5, 1, 1, 6];
const payB = [1, 4, 4, 1];
const fee = 2;

let inA = payA[0]; // best total if today is in shop A
let inB = payB[0]; // best total if today is in shop B

for (let day = 1; day < payA.length; day++) {
  const oldA = inA;
  inA = payA[day] + Math.max(inA, inB - fee);
  inB = payB[day] + Math.max(inB, oldA - fee);
}

// Math.max(inA, inB) is 15: shops A, B, B, A
```

## Why it works

- There are two states: "today in A" and "today in B". Each holds the best total that ends in that state.
- Each update lists the ways to enter the state: stay, or come from the other shop and pay the fee.
- `oldA` keeps yesterday's value. Without it, `inB` would read the value of `inA` from today.

## When to use it

- A rule links one day to the next: a fee, a waiting day, a limit on days in a row.
- You can list a few situations, such as holding or not holding, and say which one follows which.
- One "take or skip" choice per item is not enough to describe where you are.
