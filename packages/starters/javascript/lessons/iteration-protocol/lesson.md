# The Iteration Protocol

## Asking for values

**Code**

```js
const scores = [90, 75];
const iterator = scores[Symbol.iterator]();

let result = iterator.next();
console.log(result.value, result.done);

result = iterator.next();
console.log(result.value, result.done);

result = iterator.next();
console.log(result.value, result.done);
```

**Output**

```text
90 false
75 false
undefined true
```

**Rule:** An **iterable** is a value with a `[Symbol.iterator]()` method. That method returns an **iterator**: an object with a `next()` method. Each `next()` call returns an object `{ value, done }`, and `done` is `true` once the values have run out.

`Symbol.iterator` is a built-in symbol. The language looks up the method under this key.

`typeof "ok"[Symbol.iterator]` gives `"function"`. Arrays, strings, maps and sets have the method. A plain object does not.

**Common mistake:** calling `next()` on the iterable.

**Wrong**

```js
const tasks = ["wash", "dry"];

console.log(«tasks.next()».value);
```

**Error**

```text
TypeError: tasks.next is not a function. (In 'tasks.next()', 'tasks.next' is undefined)
```

**Fix**

```js
const tasks = ["wash", "dry"];
const iterator = «tasks[Symbol.iterator]()»;

console.log(«iterator.next()».value);
```

An array is iterable, but it is not an iterator, so it has no `next()`. Ask it for an iterator first. Chrome and Node say `tasks.next is not a function`.

<!-- task -->

## What reads iterables

**Code**

```js
const tags = new Set(["js", "css", "html"]);

const [first, second] = tags;
console.log(first, second);
console.log([...tags].join("+"));
console.log(Array.from(tags, (tag) => tag.length).join(","));
console.log(new Set(tags).size);
```

**Output**

```text
js css
js+css+html
2,3,4
3
```

**Rule:** `for...of`, spread, array destructuring, `Array.from`, `new Map` and `new Set` all take any iterable. Each one calls `[Symbol.iterator]()`, then calls `next()` until `done` is `true`.

`Promise.all`, which comes later in the course, takes an iterable too.

`Array.from` is the only one of these that also takes an array-like. The others need an iterable.

**Common mistake:** reading a set by index.

**Wrong**

```js
const winners = new Set(["Ada", "Bo"]);
const champion = «winners[0]»;

console.log(champion);
```

**Output**

```text
undefined
```

**Fix**

```js
const winners = new Set(["Ada", "Bo"]);
const «[champion]» = winners;

console.log(champion);
```

**Output**

```text
Ada
```

A set is iterable, but it has no numbered keys, so `winners[0]` finds nothing. Destructuring asks the iterator for its first value.

<!-- task -->

## One pass only

**Code**

```js
const queue = ["Ada", "Bo", "Cy"].values();

console.log(queue.next().value);
console.log([...queue].join(","));
console.log([...queue].length);
```

**Output**

```text
Ada
Bo,Cy
0
```

**Rule:** An iterator remembers how far it got. Each value comes out once, and a used-up iterator stays done. An iterable such as an array makes a new iterator for every loop, so you can loop over it again.

`list.values()`, `map.keys()` and `set.entries()` return iterators, not arrays.

A built-in iterator is iterable too. Its `[Symbol.iterator]()` returns the iterator itself, so spread carries on from where `next()` stopped.

**Common mistake:** looping twice over one saved iterator.

**Wrong**

```js
const scores = new Map([["Ada", 9], ["Bo", 7]]);
const pairs = «scores.entries()»;

for (const [name] of pairs) console.log(name);
for (const [, score] of pairs) console.log(score);
```

**Output**

```text
Ada
Bo
```

**Fix**

```js
const scores = new Map([["Ada", 9], ["Bo", 7]]);

for (const [name] of «scores») console.log(name);
for (const [, score] of «scores») console.log(score);
```

**Output**

```text
Ada
Bo
9
7
```

The first loop used up the iterator, so the second loop got nothing. Loop over the map itself. It makes a fresh iterator each time.

<!-- task -->

## Stopping early

**Code**

```js
const countdown = {
  [Symbol.iterator]() {
    let n = 3;

    return {
      next() {
        return n > 0 ? { value: n--, done: false } : { value: undefined, done: true };
      },
      return() {
        console.log("closed");
        return { value: undefined, done: true };
      },
    };
  },
};

for (const n of countdown) {
  console.log(n);
  if (n === 2) break;
}

const [top] = countdown;
console.log(top);
console.log([...countdown].join(","));
```

**Output**

```text
3
2
closed
closed
3
3,2,1
```

**Rule:** When a consumer stops before `done` is `true`, it calls the iterator's `return()` method, if it has one. A `break`, a `return` or a `throw` in the loop does this, and so does destructuring that needs fewer values. Reading to the end does not.

`return()` lets an iterator clean up, such as closing a file it opened.

Array, string, map and set iterators have no `return()`. Stopping early just leaves them where they were.

<!-- task -->

## Remember

- An iterable has `[Symbol.iterator]()`, which returns an iterator. An iterator has `next()`, which returns `{ value, done }`.
- `for...of`, spread, destructuring, `Array.from`, `new Map` and `new Set` all read iterables this way.
- An iterator gives each value once. Loop over the iterable again to start over.
- Stopping early calls the iterator's `return()`, if it has one.
