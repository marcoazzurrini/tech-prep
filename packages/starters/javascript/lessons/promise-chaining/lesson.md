# Chaining Promises

## Each then, a new promise

**Code**

```js
const price = new Promise((resolve) => resolve(20));
const next = price.then((amount) => amount + 5);

console.log(next === price);

next
  .then((amount) => amount * 2)
  .then((amount) => console.log("total: " + amount));
```

**Output**

```text
false
total: 50
```

**Rule:** `then` returns a new promise. That promise fulfils with what the callback returns, so the next `then` gets that value.

A row of `then` calls, each on the promise the last one returned, is a **chain**. Each step works on the result of the step before.

**Common mistake:** calling `then` twice on the same promise.

**Wrong**

```js
const points = new Promise((resolve) => resolve(10));

points.then((n) => n + 5);
«points».then((n) => console.log(n));
```

**Output**

```text
10
```

**Fix**

```js
const points = new Promise((resolve) => resolve(10));

points.then((n) => n + 5)«.then»((n) => console.log(n));
```

Both callbacks were on `points`, so both got `10`. The `n + 5` went to a promise that nobody used. Call the next `then` on the promise that `then` returned.

<!-- task -->

## Returning a promise

**Code**

```js
function later(value, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

later("order 7", 0)
  .then((order) => {
    console.log("got " + order);
    return later(order + " packed", 45);
  })
  .then((result) => {
    console.log(typeof result);
    console.log(result);
  });

setTimeout(() => console.log("a timer fires"), 20);
```

**Output**

```text
got order 7
a timer fires
string
order 7 packed
```

**Rule:** When a callback returns a promise, the chain waits for it. The next callback gets that promise's value, not the promise.

The packing took 45 ms, so the timer at 20 ms printed in between. The second callback started only when the packing was done.

This is how slow steps run one after another. Each step starts when the one before has finished.

<!-- task -->

## Forgetting the return

**Code**

```js
const cart = new Promise((resolve) => resolve(["tea", "milk"]));

cart
  .then((items) => {
    items.length * 3;
  })
  .then((total) => console.log("with braces: " + total));

cart
  .then((items) => items.length * 3)
  .then((total) => console.log("no braces: " + total));
```

**Output**

```text
with braces: undefined
no braces: 6
```

**Rule:** A callback with braces returns `undefined` unless it says `return`. The next callback then gets `undefined`, at once.

An arrow function without braces returns its expression. With braces, you must write `return`.

**Common mistake:** starting a slow step without returning it.

**Wrong**

```js
function later(value, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function save(order) {
  return later(order + " saved", 30);
}

later("order 9", 10)
  .then((order) => {
    «save(order);»
  })
  .then((result) => console.log("done: " + result));
```

**Output**

```text
done: undefined
```

**Fix**

```js
function later(value, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function save(order) {
  return later(order + " saved", 30);
}

later("order 9", 10)
  .then((order) => {
    «return save(order);»
  })
  .then((result) => console.log("done: " + result));
```

Without `return`, the chain never saw the save. It went on at once with `undefined`, while the save was still running. With `return`, the chain waits for the save and passes its value on.

<!-- task -->

## Flat, not nested

**Code**

```js
function later(value, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function findUser(id) {
  return later({ id, name: "Ada" }, 10);
}

function findOrders(user) {
  return later(["book", "lamp"], 10);
}

function priceOf(orders) {
  return later(orders.length * 15, 10);
}

findUser(1)
  .then((user) => findOrders(user))
  .then((orders) => priceOf(orders))
  .then((total) => console.log("total: " + total));
```

**Output**

```text
total: 30
```

**Rule:** Return each promise, and add the next `then` to the outer chain. The chain stays flat: one step under the other, never inside.

`findUser(1).then((user) => findOrders(user).then(...))` puts a chain inside a callback. It works if you return it, but each step adds a level of nesting.

`.then(findOrders)` passes the function itself. It does the same as `.then((user) => findOrders(user))`.

<!-- task -->

## Remember

- `then` returns a new promise, which fulfils with what the callback returns.
- When the callback returns a promise, the chain waits for it and passes on its value.
- A callback with braces and no `return` passes on `undefined`, without waiting.
- Return each promise and keep the chain flat.
