# Math

## Four ways to round

**Code**

```js
const values = [2.5, -2.5, 2.7, -2.7];

console.log("value floor ceil round trunc");

for (const v of values) {
  console.log(v, Math.floor(v), Math.ceil(v), Math.round(v), Math.trunc(v));
}
```

**Output**

```text
value floor ceil round trunc
2.5 2 3 3 2
-2.5 -3 -2 -2 -2
2.7 2 3 3 2
-2.7 -3 -2 -3 -2
```

```steps
Math.floor(-2.5) => -3
Math.ceil(-2.5) => -2
Math.trunc(-2.7) => -2
Math.round(«-2.5») => -2
Math.round(-2.51) => -3
```

**Rule:** `Math.floor` rounds down, towards `-Infinity`. `Math.ceil` rounds up, towards `Infinity`. `Math.trunc` drops the fraction, so it moves towards zero. `Math.round` goes to the nearest whole number, and a half always goes up.

`Math.round(-2.5)` gives `-2`, not `-3`. "Up" means towards `Infinity`, for negative numbers too.

**Common mistake:** dropping the fraction of a negative number with `Math.floor`.

**Wrong**

```js
const minutes = -150;
const hours = Math.floor(minutes / 60);
const rest = minutes % 60;

console.log(hours, rest);
```

**Output**

```text
-3 -30
```

**Fix**

```js
const minutes = -150;
const hours = «Math.trunc»(minutes / 60);
const rest = minutes % 60;

console.log(hours, rest);
```

`Math.floor` moved `-2.5` down to `-3`, so `-3` hours and `-30` minutes no longer add up to `-150`. `Math.trunc` moves towards zero, as `%` does.

<!-- task -->

## Rounding to decimals

**Code**

```js
const price = 3.14159;

console.log(Math.round(price * 100) / 100);
console.log(Math.floor(price * 10) / 10);
console.log(Math.round(1234 / 100) * 100);
```

**Output**

```text
3.14
3.1
1200
```

**Rule:** To round to n decimals, multiply by `10 ** n`, round, then divide by the same amount. To round to hundreds, divide first and multiply after.

`Math.round(2.499 * 100) / 100` gives `2.5`. A number never keeps zeros at the end.

**Common mistake:** trusting the multiplication.

**Wrong**

```js
const rate = 1.005;

console.log(rate * 100);
console.log(Math.round(rate * 100) / 100);
```

**Output**

```text
100.49999999999999
1
```

**Fix**

```js
const rate = 1.005;

console.log(Number(rate + "e2"));
console.log(Math.round(«Number(rate + "e2")») / 100);
```

**Output**

```text
100.5
1.01
```

`1.005` is stored a little below its true value, so the product falls just under the half. `rate + "e2"` builds the text `"1.005e2"`. `Number` reads it as exactly `100.5`, with no multiplication. This trick fails for a number whose text is already in the `e` form, such as `5e-7`.

<!-- task -->

## Largest and smallest

**Code**

```js
const temps = [4, -7, 12, -1];

console.log(Math.max(...temps));
console.log(Math.min(...temps));
console.log(Math.max(4, NaN, 12));
console.log(Math.max());
console.log(Math.min());
```

**Output**

```text
12
-7
NaN
-Infinity
Infinity
```

**Rule:** `Math.max` and `Math.min` take numbers as separate arguments, so spread an array into them. One `NaN` makes the result `NaN`. With no arguments, `Math.max()` gives `-Infinity` and `Math.min()` gives `Infinity`.

`Math.abs(-7)` gives `7`. `Math.sign(x)` gives `-1`, `0` or `1`: the sign of `x`.

`Math.hypot(3, 4)` gives `5`. It is the square root of `3 ** 2 + 4 ** 2`, the length of a diagonal.

**Common mistake:** forgetting the empty list.

**Wrong**

```js
const scores = [];
const best = Math.max(...scores);

console.log(`Best score: ${best}`);
```

**Output**

```text
Best score: -Infinity
```

**Fix**

```js
const scores = [];
const best = «scores.length === 0 ? "none" :» Math.max(...scores);

console.log(`Best score: ${best}`);
```

Spreading an empty array passes no arguments, so `Math.max` gave `-Infinity`. Test for the empty list first.

<!-- task -->

## Random whole numbers

**Code**

```js
const between = (r, min, max) => Math.floor(r * (max - min + 1)) + min;

console.log(between(0, 1, 6));
console.log(between(0.5, 1, 6));
console.log(between(0.9999, 1, 6));

const roll = between(Math.random(), 1, 6);
console.log(roll >= 1 && roll <= 6);
```

**Output**

```text
1
4
6
true
```

**Rule:** `Math.random()` gives a fraction from `0` up to, but not including, `1`. For a whole number from `min` to `max`, multiply it by the count of values, `max - min + 1`. Then round down and add `min`.

`Math.random()` is not for secrets such as passwords. Its numbers can be predicted.

**Common mistake:** rounding the random number with `Math.round`.

**Wrong**

```js
const counts = [0, 0, 0, 0];

for (let i = 0; i < 100; i += 1) {
  const r = i / 100;
  counts[Math.round(r * 2) + 1] += 1;
}

console.log(counts.slice(1).join(" "));
```

**Output**

```text
25 50 25
```

**Fix**

```js
const counts = [0, 0, 0, 0];

for (let i = 0; i < 100; i += 1) {
  const r = i / 100;
  counts[«Math.floor(r * 3)» + 1] += 1;
}

console.log(counts.slice(1).join(" "));
```

**Output**

```text
34 33 33
```

The loop tries 100 evenly spread values of `r`, in place of `Math.random()`. `Math.round` gives each end value only half a slice. `Math.floor` cuts the range into equal slices.

<!-- task -->

## Remember

- `floor` rounds down, `ceil` rounds up, `trunc` moves towards zero. `round` sends a half up, so `Math.round(-2.5)` is `-2`.
- To round to n decimals, multiply by `10 ** n`, round and divide. The product is not always exact.
- `Math.max(...list)` needs the spread. `Math.max()` of nothing is `-Infinity`.
- A random whole number from `min` to `max`: `Math.floor(Math.random() * (max - min + 1)) + min`.
