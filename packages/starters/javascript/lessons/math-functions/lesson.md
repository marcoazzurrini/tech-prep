# Powers, Roots and Logarithms

## Powers and roots

**Code**

```js
console.log(Math.pow(3, 4));
console.log(3 ** 4);
console.log(2 ** -2);
console.log(Math.sqrt(64));
console.log(Math.sqrt(-64));
console.log(Math.cbrt(-64));
console.log((-64) ** (1 / 3));
```

**Output**

```text
81
81
0.25
8
NaN
-4
NaN
```

**Rule:** `Math.pow(a, b)` and `a ** b` both raise `a` to the power `b`. A negative power divides, so `2 ** -2` is `1 / 4`. `Math.sqrt` gives `NaN` for a negative number. `Math.cbrt`, the cube root, works on negatives too. A fractional power of a negative number is `NaN`.

`Math.pow(-2, 2)` gives `4`. With `**`, write `(-2) ** 2`, because a bare `-2 ** 2` is a `SyntaxError`.

`1000 ** (1 / 3)` gives `9.999999999999998`, because `1 / 3` is rounded. `Math.cbrt(1000)` gives `10`.

**Common mistake:** writing a root as `** 1 / 2`.

**Wrong**

```js
const area = 16;
const side = area ** 1 / 2;

console.log(side);
```

**Output**

```text
8
```

**Fix**

```js
const area = 16;
const side = «Math.sqrt(area)»;

console.log(side);
```

`**` binds tighter than `/`, so the code worked out `(16 ** 1) / 2`. `Math.sqrt(area)` says what you mean. `area ** (1 / 2)` works too.

<!-- task -->

## Logarithms undo powers

**Code**

```js
console.log(Math.log2(8));
console.log(Math.log10(1000));
console.log(Math.log(Math.E));
console.log(Math.exp(2));
console.log(Math.log(0));
console.log(Math.log(-1));
```

**Output**

```text
3
3
1
7.38905609893065
-Infinity
NaN
```

**Rule:** A logarithm answers "which power?". `Math.log2(8)` is `3`, because `2 ** 3` is `8`. `Math.log10` does the same for 10. `Math.log` is the natural logarithm: its base is `Math.E`, about 2.718. `Math.exp(x)` gives `Math.E ** x`, so it undoes `Math.log`.

`Math.log(0)` gives `-Infinity`, and the logarithm of a negative number is `NaN`.

`Math.log1p(x)` gives `Math.log(1 + x)`, and stays accurate when `x` is tiny. `Math.expm1(x)` does the same for `Math.exp(x) - 1`.

**Common mistake:** dividing natural logarithms to get base 10.

**Wrong**

```js
const digits = (n) => Math.floor(Math.log(n) / Math.log(10)) + 1;

console.log(digits(999));
console.log(digits(1000));
```

**Output**

```text
3
3
```

**Fix**

```js
const digits = (n) => Math.floor(«Math.log10(n)») + 1;

console.log(digits(999));
console.log(digits(1000));
```

**Output**

```text
3
4
```

`Math.log(1000) / Math.log(10)` rounds twice and gives `2.9999999999999996`. `Math.floor` then drops it to `2`. `Math.log10(1000)` gives exactly `3`. Use `Math.log2` and `Math.log10` when they fit.

<!-- task -->

## Angles are radians

**Code**

```js
const toDegrees = (radians) => radians * 180 / Math.PI;

console.log(Math.cos(Math.PI));
console.log(Math.sin(Math.PI / 2));
console.log(Math.sin(Math.PI));
console.log(toDegrees(Math.atan2(1, 1)));
console.log(toDegrees(Math.atan2(-1, -1)));
```

**Output**

```text
-1
1
1.2246467991473532e-16
45
-135
```

**Rule:** The angle functions use radians, a unit where a half turn is `Math.PI`. To turn degrees into radians, multiply by `Math.PI / 180`. `Math.atan2(y, x)` gives the angle from the x axis to the point (x, y). It takes `y` first, and its result runs from `-Math.PI` to `Math.PI`.

`Math.sin(Math.PI)` is not `0`. `Math.PI` is rounded, so the result is a tiny number: about 0.0000000000000001.

`Math.atan(y / x)` gives 45 degrees for both (1, 1) and (-1, -1). The division loses the signs. `Math.atan2` keeps them.

**Common mistake:** passing degrees to `Math.sin`.

**Wrong**

```js
const angle = 90;

console.log(Math.sin(angle));
```

**Output**

```text
0.8939966636005579
```

**Fix**

```js
const angle = 90;

console.log(Math.sin(«angle * Math.PI / 180»));
```

**Output**

```text
1
```

`Math.sin` read `90` as 90 radians, which is more than fourteen full turns. Convert degrees to radians first.

<!-- task -->

## Sums and 32-bit maths

**Code**

```js
const prices = [0.1, 0.2, 0.3];
let total = 0;

for (const price of prices) {
  total += price;
}

console.log(total);
console.log(Math.sumPrecise(prices));
console.log(Math.sumPrecise([1e20, 5, -1e20]));
```

**Output**

```text
0.6000000000000001
0.6
5
```

**Rule:** `Math.sumPrecise(list)` adds the numbers as if every step were exact, and rounds once, at the end. A loop rounds after every `+`, so the errors build up. It takes one array, not separate numbers as `Math.max` does.

`Math.sumPrecise([0.1, 0.2])` still gives `0.30000000000000004`. The numbers were rounded when they were written, and no sum can undo that.

`Math.clz32(200)` gives `24`: the zero bits before the first `1`, in 32 bits. So `32 - Math.clz32(n)` is how many bits `n` needs.

**Common mistake:** multiplying large 32-bit numbers with `*`, then `| 0`.

**Wrong**

```js
const a = 123456789;
const b = 987654321;

console.log((a * b) | 0);
```

**Output**

```text
-67153024
```

**Fix**

```js
const a = 123456789;
const b = 987654321;

console.log(«Math.imul(a, b)»);
```

**Output**

```text
-67153019
```

The product is above `2 ** 53`, so it was rounded before `| 0` kept its last 32 bits. Those bits were already wrong. `Math.imul` multiplies as 32-bit integers, so the bits stay exact.

<!-- task -->

## Remember

- `a ** b` is `Math.pow(a, b)`. Write a root as `Math.sqrt(x)` or `x ** (1 / 2)`. `Math.cbrt` works on negatives.
- `Math.log` has base `Math.E`. Use `Math.log2` and `Math.log10`, not a division of logarithms.
- Angles are in radians: multiply degrees by `Math.PI / 180`. `Math.atan2` takes `y` first.
- `Math.sumPrecise` rounds once, at the end. `Math.imul` and `Math.clz32` work in 32 bits.
