# Numbers Are Floating Point

## Fractions are not exact

**Code**

```js
const coffee = 0.1;
const cake = 0.2;

console.log(coffee + cake);
console.log(coffee + cake === 0.3);
console.log(0.5 + 0.25 === 0.75);
console.log(1 === 1.0);
```

**Output**

```text
0.30000000000000004
false
true
true
```

**Rule:** Every number is a 64-bit float: a binary fraction that is stored in 64 bits. Most decimal fractions, such as `0.1`, do not fit exactly, so the nearest value that fits is stored.

`0.5 + 0.25` is exact. Halves and quarters fit in binary. Tenths do not.

`1 === 1.0` gives `true`. There is no separate type for whole numbers.

**Common mistake:** comparing fractions with `===`.

**Wrong**

```js
const paid = 0.1 + 0.2;
const price = 0.3;

console.log(paid === price ? "paid in full" : "money missing");
```

**Output**

```text
money missing
```

**Fix**

```js
const paid = 0.1 + 0.2;
const price = 0.3;

console.log(«Math.abs(paid - price) < Number.EPSILON» ? "paid in full" : "money missing");
```

The two values differ by a tiny rounding error. Test that the difference is under a tolerance: a gap small enough to ignore. `Number.EPSILON` is the gap between `1` and the next number. It suits small values only. For larger values, pick a larger tolerance.

<!-- task -->

## Keep money in cents

**Code**

```js
const euros = 0.1 + 0.2 + 0.3;
const cents = 10 + 20 + 30;

console.log(euros);
console.log(cents);
console.log(cents / 100);
```

**Output**

```text
0.6000000000000001
60
0.6
```

**Rule:** Whole numbers add, subtract and multiply exactly. Store money as a whole number of cents, and divide by 100 only to show it.

**Common mistake:** turning a price into cents without rounding.

**Wrong**

```js
const price = 19.99;
const cents = price * 100;

console.log(cents);
```

**Output**

```text
1998.9999999999998
```

**Fix**

```js
const price = 19.99;
const cents = «Math.round(price * 100)»;

console.log(cents);
```

`19.99` is not stored exactly, so the product is not exact either. `Math.round` gives the nearest whole number, `1999`.

<!-- task -->

## Safe whole numbers

**Code**

```js
const max = Number.MAX_SAFE_INTEGER;

console.log(max);
console.log(max + 1);
console.log(max + 2);
console.log(max + 1 === max + 2);
```

**Output**

```text
9007199254740991
9007199254740992
9007199254740992
true
```

**Rule:** Whole numbers are exact up to `Number.MAX_SAFE_INTEGER`, which is `2 ** 53 - 1`. Above it, some whole numbers cannot be stored, so a result is rounded to one that can.

`Number.MIN_SAFE_INTEGER` gives `-9007199254740991`. The same limit holds below zero.

**Common mistake:** writing a long id as a number.

**Wrong**

```js
const orderId = 9007199254740993;

console.log(orderId);
```

**Output**

```text
9007199254740992
```

**Fix**

```js
const orderId = «"9007199254740993"»;

console.log(orderId);
```

The id is above the limit, so it was rounded as soon as the code was read. An id is a label, not an amount. Keep it as a string.

<!-- task -->

## Remainder and power

**Code**

```js
console.log(7 % 3);
console.log(-7 % 3);
console.log(7 % -3);
console.log(2 ** 10);
```

**Output**

```text
1
-1
1
1024
```

**Rule:** `a % b` gives the remainder of `a / b`, with the sign of the left side. `a ** b` raises `a` to the power `b`.

`5.5 % 2` gives `1.5`. The remainder works on fractions too.

`9 ** 0.5` gives `3`. A power of `0.5` is a square root.

**Common mistake:** testing for an odd number with `=== 1`.

**Wrong**

```js
const isOdd = (n) => n % 2 === 1;

console.log(isOdd(3));
console.log(isOdd(-3));
```

**Output**

```text
true
false
```

**Fix**

```js
const isOdd = (n) => n % 2 «!== 0»;

console.log(isOdd(3));
console.log(isOdd(-3));
```

`-3 % 2` is `-1`, not `1`, so the test missed it. An odd number never leaves `0`, whatever its sign.

<!-- task -->

## Remember

- Fractions such as `0.1` are stored rounded, so `0.1 + 0.2 === 0.3` is `false`. Compare with a tolerance.
- Whole numbers are exact up to `Number.MAX_SAFE_INTEGER`. Keep money in whole cents.
- `%` takes the sign of its left side. `**` is the power operator.
