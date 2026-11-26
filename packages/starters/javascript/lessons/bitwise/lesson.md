# Bitwise Operators

## Bit by bit

**Code**

```js
const bits = (n) => n.toString(2).padStart(4, "0");
const a = 12;
const b = 10;

console.log(bits(a));
console.log(bits(b));
console.log(bits(a & b));
console.log(bits(a | b));
console.log(bits(a ^ b));
```

**Output**

```text
1100
1010
1000
1110
0110
```

```steps
12 & 10 => 8
12 | 10 => 14
12 ^ 10 => 6
```

**Rule:** A bit is one binary digit: `0` or `1`. A bitwise operator pairs up the bits of two numbers, place by place. `&` gives `1` where both bits are `1`. `|` gives `1` where either is. `^` gives `1` where the two differ.

`n.toString(2)` gives the bits of `n` as text. `0b1100` writes a number in bits, so it is `12`.

`n & 1` reads the last bit. It gives `1` for an odd number and `0` for an even one.

**Common mistake:** typing `&` where `&&` was meant.

**Wrong**

```js
const adults = 4;
const children = 2;

if (adults «&» children) {
  console.log("family ticket");
} else {
  console.log("single ticket");
}
```

**Output**

```text
single ticket
```

**Fix**

```js
const adults = 4;
const children = 2;

if (adults «&&» children) {
  console.log("family ticket");
} else {
  console.log("single ticket");
}
```

`4` is `100` and `2` is `010`. No place holds a `1` in both, so `&` gives `0`, which is falsy. `&&` asks whether both values are truthy.

<!-- task -->

## Shifts

**Code**

```js
console.log(5 << 1);
console.log(5 << 3);
console.log(40 >> 2);
console.log(-8 >> 1);
console.log(-8 >>> 1);
```

**Output**

```text
10
40
10
-4
2147483644
```

```steps
1 << 3 => 8
5 << 1 => 10
9 >> 1 => 4
-9 >> 1 => -5
-1 >>> 0 => 4294967295
```

**Rule:** `x << n` moves the bits `n` places to the left, which doubles the number `n` times. `x >> n` moves them to the right, drops the bits that fall off and keeps the sign. `x >>> n` also moves right, but fills with zeros, so its result is never negative.

`1 << n` has only bit `n` set, counting from 0 on the right. So `1 << 3` is `8`, or `1000`.

`(-1 >>> 0).toString(2)` gives thirty-two `1`s. Use `>>> 0` to see the bits of a negative number.

**Common mistake:** shifting by 32 or more.

**Wrong**

```js
const oneGigabyte = 1 << 30;
const fourGigabytes = «1 << 32»;

console.log(oneGigabyte);
console.log(fourGigabytes);
```

**Output**

```text
1073741824
1
```

**Fix**

```js
const oneGigabyte = 1 << 30;
const fourGigabytes = «2 ** 32»;

console.log(oneGigabyte);
console.log(fourGigabytes);
```

A shift uses only the remainder of the count divided by 32, so `1 << 32` is `1 << 0`. And `1 << 31` is negative, because bit 31 is the sign. Past 30, use `2 ** n`.

<!-- task -->

## Only 32 bits

**Code**

```js
console.log(7.9 | 0);
console.log(-7.9 | 0);
console.log(~~7.9);
console.log(2147483647 | 0);
console.log(2147483648 | 0);
console.log(~5);
console.log(~-1);
```

**Output**

```text
7
-7
7
2147483647
-2147483648
-6
0
```

```steps
~5 => -6
~-1 => 0
~~7.9 => 7
«2 ** 31» | 0 => -2147483648
(2 ** 32 + 5) | 0 => 5
```

**Rule:** Before a bitwise operator runs, each number becomes a 32-bit integer. The fraction is dropped, and every bit past the 32nd is cut off. The top bit is the sign, so the range runs from `-2147483648` to `2147483647`.

`~x` flips all 32 bits, which gives `-x - 1`. `-1` is thirty-two `1`s, so `~-1` is `0`.

`x | 0` and `~~x` drop the fraction as `Math.trunc(x)` does, but only inside that range.

**Common mistake:** dropping the fraction of a large number with `| 0`.

**Wrong**

```js
const totalBytes = 6000000001;
const half = «(totalBytes / 2) | 0»;

console.log(half);
```

**Output**

```text
-1294967296
```

**Fix**

```js
const totalBytes = 6000000001;
const half = «Math.trunc(totalBytes / 2)»;

console.log(half);
```

Three thousand million does not fit in 32 bits, so the top bits were cut off and the result wrapped round. `Math.trunc` works on the whole range of numbers.

<!-- task -->

## Flags and masks

**Code**

```js
const READ = 1;
const WRITE = 2;
const DELETE = 4;

let access = READ | WRITE;
console.log(access);
console.log((access & WRITE) !== 0);
console.log((access & DELETE) !== 0);

access = access & ~WRITE;
console.log(access);

access = access ^ DELETE;
console.log(access);
```

**Output**

```text
3
true
false
1
5
```

**Rule:** A flag is one bit that means yes or no, so one number can hold many flags. `|` sets a flag, `& ~` clears it, `^` toggles it, and `&` tests it.

A mask is a number that picks the bits to work on, such as `WRITE` or `READ | WRITE`.

`~WRITE` has every bit set except the `WRITE` bit. So `access & ~WRITE` keeps all the other flags.

**Common mistake:** comparing without parentheses.

**Wrong**

```js
const WRITE = 2;
const access = WRITE;

console.log(«access & WRITE === WRITE»);
```

**Output**

```text
0
```

**Fix**

```js
const WRITE = 2;
const access = WRITE;

console.log(«(access & WRITE) === WRITE»);
```

`===` binds tighter than `&`. So `WRITE === WRITE` ran first, and then `2 & true`, which is `2 & 1`. The parentheses make `&` run first.

<!-- task -->

## Remember

- `&` needs both bits, `|` needs either, `^` needs them to differ. `~x` flips every bit and gives `-x - 1`.
- `<<` shifts left. `>>` shifts right and keeps the sign. `>>>` shifts right and fills with zeros.
- Each number becomes a 32-bit integer first, so `x | 0` drops the fraction and wraps past `2147483647`.
- Flags: set with `f | m`, clear with `f & ~m`, toggle with `f ^ m`, test with `(f & m) !== 0`.
