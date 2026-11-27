# Arrays and length

## Arrays are objects

**Code**

```js
const scores = [10, 20, 30];
console.log(typeof scores);
console.log(Array.isArray(scores));
console.log(scores["1"] === scores[1]);
scores.topic = "math";
console.log(scores.length);
```

**Output**

```text
object
true
true
3
```

**Rule:** An array is an object with numbered keys and a `length` property. Only whole-number keys from `0` up update `length`.

`scores["1"]` gives `20`. JavaScript converts number indexes to strings, just like on any object.

`scores.topic = "math"` adds a regular property. It does not change `scores.length`.

**Common mistake:** using a negative bracket index to overwrite the last item.

**Wrong**

```js
const scores = [10, 20];
scores[«-1»] = 99;
console.log(scores.length);
console.log(scores[1]);
```

**Output**

```text
2
20
```

**Fix**

```js
const scores = [10, 20];
scores[«scores.length - 1»] = 99;
console.log(scores.length);
console.log(scores[1]);
```

`scores[-1]` sets a regular property named `"-1"` instead of touching the last slot. Use `scores.length - 1` to write to the last item.

<!-- task -->

## How length works

**Code**

```js
const tags = ["js", "ts"];
tags[4] = "css";
console.log(tags.length);

tags.length = 2;
console.log(tags.join(","));

tags.length = 0;
console.log(tags.length);
```

**Output**

```text
5
js,ts
0
```

**Rule:** `length` is always the highest index plus one, not the number of items stored. Assigning a smaller `length` deletes items from the end, and setting `length = 0` empties the array.

`tags.length = -1` throws a `RangeError`. A valid `length` must be a whole number from `0` up to `2 ** 32 - 1`.

**Common mistake:** raising `length` after lowering it and expecting old items to return.

**Wrong**

```js
const items = ["a", "b", "c"];
items.length = 1;
items.length = 3;
console.log(items[«2»]);
```

**Output**

```text
undefined
```

**Fix**

```js
const items = ["a", "b", "c"];
console.log(items[«2»]);
```

Lowering `length` deletes the cut items permanently. Raising `length` again only extends the array with empty slots.

<!-- task -->

## Reading from the end

**Code**

```js
const days = ["Mon", "Tue", "Wed", "Thu"];
console.log(days.at(0));
console.log(days.at(-1));
console.log(days.at(-2));
console.log(days.at(-10));
```

**Output**

```text
Mon
Thu
Wed
undefined
```

**Rule:** `at(index)` returns the item at `index`, where negative numbers count back from the end. An index out of range gives `undefined`.

`days.at(-1)` gives `"Thu"`. It is a shorter way to write `days[days.length - 1]`.

**Common mistake:** reading the last item with `[-1]`.

**Wrong**

```js
const queue = ["first", "second", "last"];
console.log(queue«[-1]»);
```

**Output**

```text
undefined
```

**Fix**

```js
const queue = ["first", "second", "last"];
console.log(queue«.at(-1)»);
```

`queue[-1]` looks up the string key `"-1"`, which does not exist. Use `at(-1)` to read from the end.

<!-- task -->

## Remember

- An array is an object. Use `Array.isArray` to check for one.
- Only non-negative whole-number keys update `length`. Other keys are plain object properties.
- `length` is the highest index plus one. Lowering it deletes items permanently.
- Use `at(-1)` to read from the end. Bracket notation `[-1]` reads the key `"-1"`.
