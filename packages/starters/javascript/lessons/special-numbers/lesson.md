# NaN, Infinity and -0

## Bad maths gives NaN

**Code**

```js
const scores = [];
let total = 0;

for (const score of scores) {
  total += score;
}

const average = total / scores.length;

console.log(average);
console.log(typeof average);
console.log(average + 10);
```

**Output**

```text
NaN
number
NaN
```

```steps
0 / 0 => NaN
Math.sqrt(-1) => NaN
"ten" * 2 => NaN
«NaN» + 10 => NaN
```

**Rule:** Maths that has no answer gives `NaN`, which stands for "not a number". It does not throw. `NaN` is still of type number, and it spreads: add to it or multiply it, and the result is `NaN` again.

`"ten" * 2` and `undefined + 1` give `NaN`. In maths, `undefined` and text that is not a number both become `NaN`.

<!-- task -->

## Testing for NaN

**Code**

```js
const result = Math.sqrt(-1);

console.log(result === NaN);
console.log(result === result);
console.log(Number.isNaN(result));
```

**Output**

```text
false
false
true
```

**Rule:** `NaN` is not equal to any value, not even to itself. Test for it with `Number.isNaN(value)`.

`value !== value` is `true` only when `value` is `NaN`. No other value differs from itself.

**Common mistake:** testing with the global `isNaN`.

**Wrong**

```js
const answers = [NaN, "n/a", undefined];

for (const answer of answers) {
  console.log(isNaN(answer));
}
```

**Output**

```text
true
true
true
```

**Fix**

```js
const answers = [NaN, "n/a", undefined];

for (const answer of answers) {
  console.log(«Number.isNaN»(answer));
}
```

The global `isNaN` converts its argument to a number first, so `"n/a"` and `undefined` become `NaN`. `Number.isNaN` does not convert. It is `true` only for the value `NaN`.

<!-- task -->

## Infinity

**Code**

```js
console.log(1 / 0);
console.log(-1 / 0);
console.log(0 / 0);
console.log(Infinity + 1 === Infinity);
console.log(Infinity - Infinity);
```

**Output**

```text
Infinity
-Infinity
NaN
true
NaN
```

**Rule:** Dividing by zero does not throw. It gives `Infinity` or `-Infinity`, and `0 / 0` gives `NaN`. `Infinity` is greater than every other number.

`1e308 * 10` gives `Infinity`. A result too large for a number becomes `Infinity`.

`Number.isFinite(x)` gives `false` for `Infinity`, `-Infinity` and `NaN`. It gives `true` for every other number.

**Common mistake:** guarding a division with a `NaN` test alone.

**Wrong**

```js
const speed = (metres, seconds) => metres / seconds;
const result = speed(100, 0);

console.log(Number.isNaN(result) ? "no speed" : `${result} m/s`);
```

**Output**

```text
Infinity m/s
```

**Fix**

```js
const speed = (metres, seconds) => metres / seconds;
const result = speed(100, 0);

console.log(«!Number.isFinite(result)» ? "no speed" : `${result} m/s`);
```

`100 / 0` is `Infinity`, not `NaN`, so the test let it through. `Number.isFinite` rejects both.

<!-- task -->

## Negative zero

**Code**

```js
const change = 0 * -5;

console.log(change === 0);
console.log(Object.is(change, 0));
console.log(Object.is(change, -0));
console.log(1 / change);
```

**Output**

```text
true
false
true
-Infinity
```

**Rule:** `-0` is a value of its own, but `===` says it equals `0`. `Object.is(x, -0)` tells the two apart. So does `1 / x`, which gives `-Infinity` for `-0`.

`0 * -5`, `0 / -3` and `Math.round(-0.4)` all give `-0`. It appears when a result is zero and its sign is negative.

`String(-0)` gives `"0"`. The sign is lost in text, so `-0` is easy to miss.

<!-- task -->

## Remember

- Maths with no answer gives `NaN`, not an error. `NaN` spreads through the maths that follows.
- `NaN === NaN` is `false`. Test with `Number.isNaN`, not with the global `isNaN`.
- `1 / 0` is `Infinity`. `Number.isFinite` rejects `Infinity`, `-Infinity` and `NaN`.
- `-0 === 0` is `true`. `Object.is(x, -0)` tells them apart.
