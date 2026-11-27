# Searching an Array

## find and findIndex

**Code**

```js
const menu = [
  { dish: "soup", price: 6 },
  { dish: "curry", price: 12 },
  { dish: "steak", price: 21 },
];

const pricey = (item) => item.price > 10;

console.log(menu.find(pricey).dish);
console.log(menu.findIndex(pricey));

console.log(menu.find((item) => item.price > 50));
console.log(menu.findIndex((item) => item.price > 50));
```

**Output**

```text
curry
1
undefined
-1
```

**Rule:** `find` returns the first item for which the callback returns a truthy value, or `undefined` when there is none. `findIndex` returns the index of that item, or `-1`.

`menu.find(pricey)` stops at the curry. The callback never runs for the steak.

`menu.find(pricey)` gives the item itself, not a copy. Changing it changes the item in the array.

**Common mistake:** testing an index as if it were true or false.

**Wrong**

```js
const queue = ["Ada", "Bo", "Cy"];

if (queue.findIndex((name) => name === "Ada")) {
  console.log("Ada is waiting");
} else {
  console.log("Ada is not here");
}
```

**Output**

```text
Ada is not here
```

**Fix**

```js
const queue = ["Ada", "Bo", "Cy"];

if (queue.findIndex((name) => name === "Ada") «!== -1») {
  console.log("Ada is waiting");
} else {
  console.log("Ada is not here");
}
```

Ada is at index `0`, and `0` is falsy. A missing item gives `-1`, which is truthy. Compare the index with `-1`.

<!-- task -->

## From the end

**Code**

```js
const log = [
  { time: "09:00", level: "error" },
  { time: "09:05", level: "info" },
  { time: "09:10", level: "error" },
  { time: "09:20", level: "info" },
];

const isError = (entry) => entry.level === "error";

console.log(log.find(isError).time);
console.log(log.findLast(isError).time);
console.log(log.findIndex(isError));
console.log(log.findLastIndex(isError));
```

**Output**

```text
09:00
09:10
0
2
```

**Rule:** `findLast` and `findLastIndex` search from the last item back to the first. They give the last match, or `undefined` and `-1`. The index still counts from the start.

`[, "b"].findIndex((x) => x === undefined)` gives `0`. The four `find` methods visit a hole and pass `undefined` for it.

**Common mistake:** reversing the array to find the last match.

**Wrong**

```js
const scores = [4, 9, 7, 2];
const lastHigh = scores.reverse().find((score) => score > 5);

console.log(lastHigh);
console.log(scores);
```

**Output**

```text
7
[ 2, 7, 9, 4 ]
```

**Fix**

```js
const scores = [4, 9, 7, 2];
const lastHigh = scores.«findLast»((score) => score > 5);

console.log(lastHigh);
console.log(scores);
```

`reverse` changed `scores` itself, so the list is now backwards for everyone. `findLast` only reads the array.

<!-- task -->

## some and every

**Code**

```js
const cart = [
  { name: "tea", inStock: true },
  { name: "mug", inStock: false },
];

console.log(cart.some((item) => item.inStock));
console.log(cart.every((item) => item.inStock));

const empty = [];

console.log(empty.some((item) => item.inStock));
console.log(empty.every((item) => item.inStock));
```

**Output**

```text
true
false
false
true
```

**Rule:** `some` gives `true` when the callback is truthy for at least one item. `every` gives `true` when it is truthy for all of them. On an empty array, `some` gives `false` and `every` gives `true`.

`some` stops at the first truthy result. `every` stops at the first falsy one.

`[, 2].every((n) => n > 0)` gives `true`. Both `some` and `every` skip holes in an array.

**Common mistake:** trusting `every` on a list that may be empty.

**Wrong**

```js
const order = { items: [] };
const allPacked = order.items.every((item) => item.packed);

console.log(allPacked ? "ship it" : "wait");
```

**Output**

```text
ship it
```

**Fix**

```js
const order = { items: [] };
const allPacked = «order.items.length > 0 &&» order.items.every((item) => item.packed);

console.log(allPacked ? "ship it" : "wait");
```

No item failed the test, so `every` said `true`. When an empty list must not pass, test its `length` too.

<!-- task -->

## indexOf and includes

**Code**

```js
const tags = ["sale", "new", "sale"];

console.log(tags.includes("new"));
console.log(tags.indexOf("sale"));
console.log(tags.lastIndexOf("sale"));
console.log(tags.indexOf("sale", 1));
console.log(tags.indexOf("old"));
```

**Output**

```text
true
0
2
2
-1
```

**Rule:** `includes`, `indexOf` and `lastIndexOf` search for a value, with an optional start index. `includes` gives a boolean, and the others give the first or last index, or `-1`.

`[NaN].indexOf(NaN)` gives `-1`, because `indexOf` compares with `===`. `[NaN].includes(NaN)` gives `true`.

`[, "b"].indexOf(undefined)` gives `-1`, and `[, "b"].includes(undefined)` gives `true`. `indexOf` skips a hole.

**Common mistake:** searching for an object by what it holds.

**Wrong**

```js
const team = [{ id: 1 }, { id: 2 }];

console.log(team.includes({ id: 2 }));
```

**Output**

```text
false
```

**Fix**

```js
const team = [{ id: 1 }, { id: 2 }];

console.log(team.«some((member) => member.id === 2)»);
```

Both methods compare objects by identity, and `{ id: 2 }` is a new object. To search by content, pass a callback to `some`, `find` or `findIndex`.

<!-- task -->

## Remember

- `find` and `findLast` give an item or `undefined`. `findIndex` and `findLastIndex` give an index or `-1`.
- `some` and `every` answer `true` or `false`. On an empty array they give `false` and `true`.
- `includes` and `indexOf` search for a value. Objects match by identity, and only `includes` finds `NaN`.
- Index `0` is falsy and `-1` is truthy. Compare an index with `-1`.
