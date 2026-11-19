# Digit-by-Digit Arithmetic

A number can be too long for a normal integer. Then it comes as a list of digits, and you do the arithmetic as on paper. Start at the last digit. Compute one digit of the result, and carry the rest to the next position on the left.

## Worked example

Add two numbers that are given as lists of digits.

```ts
const a = [4, 7, 5];
const b = [6, 8];
const sum: number[] = [];
let carry = 0;

// i and j start at the last digits and move left together
for (
  let i = a.length - 1, j = b.length - 1;
  i >= 0 || j >= 0 || carry > 0;
  i--, j--
) {
  const total = (a[i] ?? 0) + (b[j] ?? 0) + carry;
  sum.unshift(total % 10);
  carry = Math.floor(total / 10);
}

// sum is [5, 4, 3]: 475 + 68 = 543
```

## Why it works

- `total % 10` is the digit that stays in this position. `Math.floor(total / 10)` is the carry for the next one.
- `?? 0` gives a `0` when one number has no digits left.
- The loop also runs while `carry > 0`. A last carry adds a new first digit, as in 99 + 1 = 100.

## When to use it

- A number comes as an array of digits, as a string, or as a linked list of digits.
- The task says the number may be too large for an integer type.
- The task forbids converting the whole input to a number.
