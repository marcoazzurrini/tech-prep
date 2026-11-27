# More Iterator Helpers

## flatMap is lazy

**Code**

```js
function* orders() {
  console.log("load order 1");
  yield ["tea", "cake"];
  console.log("load order 2");
  yield ["soup"];
  console.log("load order 3");
  yield ["bread", "jam"];
}

const dishes = orders().flatMap((order) => order);
console.log(dishes.take(3).toArray().join(","));
```

**Output**

```text
load order 1
load order 2
tea,cake,soup
```

**Rule:** `flatMap(fn)` on an iterator calls `fn` on each value, then yields the values of what `fn` returns, one by one. Like `map`, it is lazy. It reads the next source value only when the values from the last one are used up. So order 3 was never loaded.

`fn` may return any iterable or iterator: an array, a `Set`, a generator. A string is the exception: it throws a `TypeError`.

`list.flatMap(fn)` on an array is the array method. It accepts any value from `fn`, and flattens only arrays.

**Common mistake:** returning a string from the callback.

**Wrong**

```js
const words = ["hi", "yo"];
const letters = words.values().flatMap((word) => «word»);
console.log(letters.toArray().join(","));
```

**Error**

```text
TypeError: GetIteratorFlattenable expects its first argument to be an object
```

**Fix**

```js
const words = ["hi", "yo"];
const letters = words.values().flatMap((word) => «[...word]»);
console.log(letters.toArray().join(","));
```

A string is iterable, but `flatMap` rejects it on purpose. Spread it into an array to get its characters. Node says `Iterator.prototype.flatMap called on non-object`.

<!-- task -->

## Reading every value

**Code**

```js
const cart = new Map([
  ["tea", 4],
  ["cake", 6],
  ["jam", 3],
]);

const total = cart.values().reduce((sum, price) => sum + price, 0);
console.log(total);

const most = cart.values().reduce((max, price) => Math.max(max, price));
console.log(most);

const result = cart.keys().forEach((name) => console.log("pack " + name));
console.log(result);
```

**Output**

```text
13
6
pack tea
pack cake
pack jam
undefined
```

**Rule:** `reduce` and `forEach` on an iterator are not lazy. They read it to the end at once, like the array methods of the same names. `reduce` gives the final value, and `forEach` gives `undefined`.

Without a start value, `reduce` starts from the first value. On an empty iterator that throws a `TypeError`, because there is no first value.

On an endless iterator, `reduce` and `forEach` never finish. Cut it with `take` first.

**Common mistake:** reading one iterator twice.

**Wrong**

```js
const scores = «[7, 9, 5].values()»;

const total = scores.reduce((sum, n) => sum + n, 0);
const count = scores.reduce((n) => n + 1, 0);
console.log(total / count);
```

**Output**

```text
Infinity
```

**Fix**

```js
const scores = [7, 9, 5];

const total = scores«.values()».reduce((sum, n) => sum + n, 0);
const count = scores«.values()».reduce((n) => n + 1, 0);
console.log(total / count);
```

**Output**

```text
7
```

An iterator works for one pass. The first `reduce` used it up, so the second read nothing and gave its start value, 0. Keep the array, and ask it for a new iterator each time.

<!-- task -->

## Stopping early

**Code**

```js
function* readings() {
  try {
    for (const value of [12, 31, 25]) {
      console.log("read " + value);
      yield value;
    }
  } finally {
    console.log("sensor off");
  }
}

console.log(readings().some((t) => t > 30));
console.log(readings().every((t) => t > 15));
```

**Output**

```text
read 12
read 31
sensor off
true
read 12
sensor off
false
```

**Rule:** `some`, `every` and `find` stop at the first value that settles the answer. Then they call `return()` on the iterator. So a generator's `finally` runs, and the rest of its values are never made.

`find(fn)` gives the first value that passes, or `undefined`. After it, a generator is closed: `next()` gives `done: true`.

An array iterator has no `return()` method, so it is not closed. After `find`, its `next()` goes on from the item after the one found. The iterators that helpers return do have `return()`.

**Common mistake:** `return` inside `forEach` to stop the loop.

**Wrong**

```js
function* tickets() {
  for (const id of [1, 2, 3]) {
    console.log("check " + id);
    yield id;
  }
}

let found;
tickets().«forEach»((id) => {
  if (id === 2) {
    found = id;
    return;
  }
});
console.log(found);
```

**Output**

```text
check 1
check 2
check 3
2
```

**Fix**

```js
function* tickets() {
  for (const id of [1, 2, 3]) {
    console.log("check " + id);
    yield id;
  }
}

const found = tickets().«find»((id) => id === 2);
console.log(found);
```

**Output**

```text
check 1
check 2
2
```

`return` ends only one call of the callback. `forEach` goes on to the end. `find` stops at the answer.

<!-- task -->

## concat and zip

**Code**

```js
const names = ["Ada", "Bo"];
const late = new Set(["Cy"]);
const players = [...Iterator.concat(names, late)];
console.log(players.join(","));

const scores = [90, 75];
for (const [name, score] of Iterator.zip([players, scores])) {
  console.log(name + " " + score);
}

const options = { mode: "longest", padding: ["?", 0] };
const padded = Iterator.zip([players, scores], options);
console.log(padded.toArray().join(" | "));
```

**Output**

```text
Ada,Bo,Cy
Ada 90
Bo 75
Ada,90 | Bo,75 | Cy,0
```

**Rule:** `Iterator.concat(a, b)` gives one lazy iterator over `a`, then over `b`. `Iterator.zip([a, b])` walks its inputs side by side, and yields arrays with one value from each. By default it stops when the shortest input ends, so Cy had no line.

`mode: "longest"` goes on to the end of every input, and fills gaps from `padding`, one value per input. `mode: "strict"` throws a `TypeError` when the lengths differ.

`Iterator.zipKeyed({ name: players, score: scores })` yields objects such as `{ name: "Ada", score: 90 }`. These three are very new: Node 24 does not have them yet.

**Common mistake:** passing the inputs as separate arguments.

**Wrong**

```js
const names = ["Ada", "Bo"];
const scores = [90, 75];

for (const [name, score] of Iterator.zip(«names, scores»)) {
  console.log(name + " " + score);
}
```

**Error**

```text
TypeError: GetIteratorFlattenable expects its first argument to be an object
```

**Fix**

```js
const names = ["Ada", "Bo"];
const scores = [90, 75];

for (const [name, score] of Iterator.zip(«[names, scores]»)) {
  console.log(name + " " + score);
}
```

`zip` takes one list of inputs, then the options. Here it took `names` as the list, so each name was an input. `zip` rejects a string as an input.

<!-- task -->

## Remember

- `flatMap` on an iterator is lazy. Its callback returns an iterable or an iterator, never a string.
- `reduce` and `forEach` read to the end at once. An iterator works for one pass.
- `some`, `every` and `find` stop at the answer and call `return()`, so a generator's `finally` runs.
- `Iterator.concat` joins inputs one after another. `Iterator.zip` walks them side by side, and stops at the shortest by default.
