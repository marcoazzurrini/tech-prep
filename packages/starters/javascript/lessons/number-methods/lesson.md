# Formatting and Checking Numbers

## toFixed gives a string

**Code**

```js
const price = 4.5;
const label = price.toFixed(2);

console.log(label);
console.log(typeof label);
console.log(label + 1);
console.log((1234.5678).toFixed(1));
```

**Output**

```text
4.50
string
4.501
1234.6
```

```steps
(4.5).toFixed(2) => "4.50"
(2.5).toFixed(0) => "3"
(«-2.5»).toFixed(0) => "-3"
Math.round(-2.5) => -2
```

**Rule:** `x.toFixed(n)` rounds `x` to `n` decimals and returns a string. It adds zeros, so the string always has exactly `n` decimals. An exact half goes away from zero, unlike `Math.round`.

`5.toFixed(1)` is a `SyntaxError`, because `5.` reads as a number. Write `(5).toFixed(1)`.

`-1.5.toFixed(0)` gives the number `-2`. The method runs first and gives `"2"`. Then the minus turns that string into a number.

**Common mistake:** adding the strings.

**Wrong**

```js
const tea = (2.5).toFixed(2);
const cake = (3.25).toFixed(2);

console.log(tea + cake);
```

**Output**

```text
2.503.25
```

**Fix**

```js
const tea = 2.5;
const cake = 3.25;

console.log(«(tea + cake).toFixed(2)»);
```

`toFixed` gave two strings, so `+` joined them. Do the maths on numbers. Call `toFixed` once, at the end, to show the result.

<!-- task -->

## Rounding surprises

**Code**

```js
console.log((1.005).toFixed(2));
console.log((1.005).toFixed(20));
console.log((0.125).toFixed(2));
console.log((1.255).toFixed(2));
```

**Output**

```text
1.00
1.00499999999999989342
0.13
1.25
```

**Rule:** `toFixed` rounds the number as it is stored, not as it is written. `1.005` is stored a little below `1.005`, so it rounds down. `0.125` is stored exactly, so its half goes up.

`toFixed(20)` shows the stored value with more digits. It reveals why a half rounded the wrong way.

`toFixed` takes from `0` to `100` decimals. Outside that range it throws a `RangeError`.

**Common mistake:** letting `toFixed` round a written half.

**Wrong**

```js
const fee = 1.005;

console.log(fee.toFixed(2));
```

**Output**

```text
1.00
```

**Fix**

```js
const fee = 1.005;
const rounded = «Math.round(Number(fee + "e2")) / 100»;

console.log(rounded.toFixed(2));
```

**Output**

```text
1.01
```

Round first, with the text trick: `"1.005e2"` reads as exactly `100.5`. Then `toFixed` only adds zeros. It has nothing left to round.

<!-- task -->

## Digits and bases

**Code**

```js
const distance = 123.456;

console.log(distance.toPrecision(4));
console.log(distance.toPrecision(2));
console.log((0.000123).toPrecision(2));
console.log((255).toString(16));
console.log((5).toString(2));
console.log((0.5).toString(2));
```

**Output**

```text
123.5
1.2e+2
0.00012
ff
101
0.1
```

**Rule:** `x.toPrecision(n)` keeps `n` significant digits: digits counted from the first one that is not zero. When the whole part needs more than `n` digits, it uses the `e` form. `x.toString(radix)` writes the number in another base, from 2 to 36.

`parseInt("ff", 16)` gives `255`. It reads back what `toString(16)` wrote.

`(0.1).toString(2)` gives a long run of 0s and 1s. In base 2, a tenth never ends, so it cannot be stored exactly.

**Common mistake:** expecting a fixed number of digits.

**Wrong**

```js
const bytes = [5, 200];

console.log(bytes.map((b) => b.toString(2)).join(" "));
```

**Output**

```text
101 11001000
```

**Fix**

```js
const bytes = [5, 200];

console.log(bytes.map((b) => b.toString(2)«.padStart(8, "0")»).join(" "));
```

**Output**

```text
00000101 11001000
```

`toString` writes no zeros at the start. Pad the string to the width you need.

<!-- task -->

## Checking numbers

**Code**

```js
console.log(Number.isInteger(5));
console.log(Number.isInteger(5.0));
console.log(Number.isInteger("5"));
console.log(Number.isInteger(5.5));
console.log(Number.isSafeInteger(2 ** 53 - 1));
console.log(Number.isSafeInteger(2 ** 53));
```

**Output**

```text
true
true
false
false
true
false
```

**Rule:** `Number.isInteger(x)` is `true` when `x` is a number with no fraction. `Number.isSafeInteger(x)` also needs `x` to be between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`. Neither converts its argument, so a string always gives `false`.

`Number.isInteger(2 ** 60)` gives `true`, but `Number.isSafeInteger(2 ** 60)` gives `false`. The number is whole, but `2 ** 60 + 1` cannot be stored, so it is not safe.

**Common mistake:** comparing large fractions with a bare `Number.EPSILON`.

**Wrong**

```js
const total = 100.1 + 200.2;
const same = Math.abs(total - 300.3) <= Number.EPSILON;

console.log(total, same);
```

**Output**

```text
300.29999999999995 false
```

**Fix**

```js
const total = 100.1 + 200.2;
const same = Math.abs(total - 300.3) <= «Number.EPSILON * Math.abs(total)»;

console.log(total, same);
```

**Output**

```text
300.29999999999995 true
```

`Number.EPSILON` is the gap between `1` and the next number. Near `300`, the gap between two numbers is hundreds of times larger. Scale the tolerance by the size of the values.

<!-- task -->

## Remember

- `toFixed(n)` returns a string with exactly `n` decimals. Do the maths on numbers, and format at the end.
- `toFixed` rounds the stored value, so `(1.005).toFixed(2)` is `"1.00"`.
- `toPrecision(n)` keeps `n` significant digits. `toString(radix)` writes the number in another base.
- `Number.isInteger` and `Number.isSafeInteger` never convert. Scale `Number.EPSILON` by the size of the values.
