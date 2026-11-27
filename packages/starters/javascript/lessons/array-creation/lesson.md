# Creating Arrays

## Array(n) and Array.of

**Code**

```js
const a = Array(3);
const b = Array(3, 4);
const c = Array.of(3);

console.log(a.length, 0 in a);
console.log(JSON.stringify(b));
console.log(JSON.stringify(c));
```

**Output**

```text
3 false
[3,4]
[3]
```

**Rule:** `Array(n)` with one number makes an array of `n` holes, not `[n]`. With two or more arguments, or one non-number, `Array(...)` puts those values in the array. `Array.of(...)` always puts every argument in the array, even one number.

`Array(-1)` and `Array(1.5)` throw a `RangeError`. A length must be a whole number from `0` up.

`Array("3")` gives `["3"]`, because `"3"` is a string, not a number.

**Common mistake:** calling `map` straight on `Array(n)`.

**Wrong**

```js
const nums = Array(3).map((_, i) => i + 1);

console.log(nums.length, 0 in nums);
```

**Output**

```text
3 false
```

**Fix**

```js
const nums = Array(3)«.fill(0)».map((_, i) => i + 1);

console.log(nums.join(", "));
```

`Array(3)` has only holes, and `map` skips holes, so the callback never ran. Filling the slots first gives `map` real items to visit.

<!-- task -->

## fill shares objects

**Code**

```js
const scores = Array(4).fill(0);
scores.fill(10, 1, 3);

console.log(scores.join(", "));
```

**Output**

```text
0, 10, 10, 0
```

**Rule:** `fill(value, start, end)` mutates the array and writes `value` into every slot from `start` up to `end`, replacing holes too. It puts the exact same value in every slot.

`Array(3).fill(0)` is safe because numbers are primitives.

**Common mistake:** filling an array with an object or an array.

**Wrong**

```js
const rows = Array(3).fill([]);
rows[0].push("x");

console.log(JSON.stringify(rows));
```

**Output**

```text
[["x"],["x"],["x"]]
```

**Fix**

```js
const rows = «Array.from({ length: 3 }, () => [])»;
rows[0].push("x");

console.log(JSON.stringify(rows));
```

`fill([])` created one array and placed a reference to it in all three slots, so pushing into `rows[0]` changed every row. `Array.from` calls the callback once per slot, making a fresh array each time.

<!-- task -->

## Building with Array.from

**Code**

```js
const squares = Array.from({ length: 4 }, (_, i) => i * i);
const letters = Array.from("code", (ch) => ch.toUpperCase());

console.log(squares.join(", "));
console.log(letters.join(", "));
```

**Output**

```text
0, 1, 4, 9
C, O, D, E
```

**Rule:** `Array.from(source, mapFn)` builds a new array with no holes. It calls `mapFn(value, index)` for every slot. Passing `{ length: n }` builds `n` slots.

For `{ length: n }`, the slot value is `undefined`, and the second parameter is the index `0` to `n - 1`.

**Common mistake:** forgetting the first parameter in the `Array.from` callback.

**Wrong**

```js
const ids = Array.from({ length: 3 }, (i) => i + 1);

console.log(ids.map(String).join(", "));
```

**Output**

```text
NaN, NaN, NaN
```

**Fix**

```js
const ids = Array.from({ length: 3 }, («_, »i) => i + 1);

console.log(ids.map(String).join(", "));
```

The first parameter is the slot value, which is `undefined` for `{ length: 3 }`, so `undefined + 1` gave `NaN`. The index is always the second parameter.

<!-- task -->

## Remember

- `Array(n)` creates `n` holes, and `map` skips holes. `Array.of(n)` creates `[n]`.
- `Array(n).fill(x)` puts the same `x` in every slot, so objects and arrays are shared.
- `Array.from({ length: n }, (_, i) => ...)` creates a fresh value for each slot from `0` to `n - 1`.
- The `Array.from` callback takes `(value, index)`, so the index is the second parameter.
