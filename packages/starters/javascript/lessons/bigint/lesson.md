# BigInt

## Whole numbers, any size

**Code**

```js
const views = 9007199254740991n;

console.log(views + 2n);
console.log(typeof views);
console.log(2n ** 64n);
console.log(Number.MAX_SAFE_INTEGER + 2);
```

**Output**

```text
9007199254740993n
bigint
18446744073709551616n
9007199254740992
```

**Rule:** A BigInt is a whole number of any size, written with an `n` at the end. Maths between two BigInts is exact, and `typeof` gives `"bigint"`.

`String(123n)` gives `"123"`. As text, a BigInt has no `n`. `console.log` adds the `n` to show the type.

<!-- task -->

## No mixing with numbers

**Code**

```js
const stock = 10n;
const sold = 3;

try {
  console.log(stock - sold);
} catch (error) {
  console.log(error.name);
}

console.log(stock - BigInt(sold));
console.log(Number(stock) - sold);
```

**Output**

```text
TypeError
7n
7
```

**Rule:** Maths cannot mix a BigInt with a number. It throws a `TypeError`. Convert one side first, with `BigInt(x)` or `Number(x)`.

`BigInt("9007199254740993")` gives `9007199254740993n`. `BigInt()` also reads a whole number from a string of digits.

`BigInt(1.5)` throws a `RangeError`. A BigInt cannot hold a fraction.

**Common mistake:** converting a large BigInt to a number.

**Wrong**

```js
const orderId = 9007199254740993n;

console.log(Number(orderId) + 1);
```

**Output**

```text
9007199254740992
```

**Fix**

```js
const orderId = 9007199254740993n;

console.log(«orderId + 1n»);
```

The id is above `Number.MAX_SAFE_INTEGER`, so `Number()` rounded it. Keep a large value as a BigInt, and make the small side a BigInt.

<!-- task -->

## Division drops the fraction

**Code**

```js
console.log(7n / 2n);
console.log(-7n / 2n);
console.log(7n % 2n);
console.log(7 / 2);
```

**Output**

```text
3n
-3n
1n
3.5
```

**Rule:** Dividing two BigInts gives a BigInt, so the fraction is dropped. The result is rounded towards zero.

`1n / 0n` throws a `RangeError`. There is no BigInt `Infinity` and no BigInt `NaN`.

**Common mistake:** dividing before multiplying.

**Wrong**

```js
const done = 3n;
const total = 4n;

console.log((done / total) * 100n);
```

**Output**

```text
0n
```

**Fix**

```js
const done = 3n;
const total = 4n;

console.log(«(done * 100n) / total»);
```

`3n / 4n` is `0n`, and `0n` times anything is `0n`. Multiply first, then divide.

<!-- task -->

## Comparing with numbers

**Code**

```js
const used = 5n;

console.log(used > 4);
console.log(used < 5.5);
console.log(used == 5);
console.log(used === 5);
```

**Output**

```text
true
true
true
false
```

**Rule:** `<`, `>` and `==` compare a BigInt with a number by value. `===` is always `false` between them, because the types differ.

`Math.max(1n, 2n)` throws a `TypeError`. The `Math` functions take numbers only, so compare BigInts with `<` and `>`.

`BigInt` is for whole numbers above `Number.MAX_SAFE_INTEGER`, such as large ids and timestamps in nanoseconds. Everywhere else, use a number.

**Common mistake:** comparing a BigInt and a number with `===`.

**Wrong**

```js
const limit = 5;
const used = 5n;

console.log(used === limit ? "limit reached" : "space left");
```

**Output**

```text
space left
```

**Fix**

```js
const limit = 5;
const used = 5n;

console.log(used «>=» limit ? "limit reached" : "space left");
```

The two values have different types, so `===` is `false`. `>=` compares them by value.

<!-- task -->

## Remember

- A BigInt is a whole number of any size, written with `n`. `typeof` gives `"bigint"`.
- Maths cannot mix a BigInt with a number. Convert with `BigInt(x)` or `Number(x)`.
- BigInt division drops the fraction. The `Math` functions do not take BigInts.
- `<`, `>` and `==` compare a BigInt with a number by value. `===` is `false`.
