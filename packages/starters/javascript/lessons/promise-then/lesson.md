# then

## Callbacks run later

**Code**

```js
const total = new Promise((resolve) => resolve(12));

total.then((value) => console.log("first: " + value));
total.then((value) => console.log("second: " + value));
console.log("after then");
```

**Output**

```text
after then
first: 12
second: 12
```

**Rule:** `promise.then(fn)` registers `fn` to run with the value once the promise is fulfilled. `fn` always runs later, after the current code has finished. This holds even when the promise is already settled.

One promise can have many `then` callbacks. Each one gets the same value, in the order they were added.

**Common mistake:** calling the function instead of passing it.

**Wrong**

```js
function show(value) {
  console.log("total: " + value);
}

const total = new Promise((resolve) => setTimeout(resolve, 10, 12));
total.then(«show()»);
```

**Output**

```text
total: undefined
```

**Fix**

```js
function show(value) {
  console.log("total: " + value);
}

const total = new Promise((resolve) => setTimeout(resolve, 10, 12));
total.then(«show»);
```

**Output**

```text
total: 12
```

`show()` ran at once, before the promise had a value, and `then` got its result: `undefined`. `then` ignores anything that is not a function.

<!-- task -->

## Handle the rejection

**Code**

```js
function checkStock(count) {
  return new Promise((resolve, reject) => {
    if (count > 0) {
      resolve(count + " left");
    } else {
      reject(new Error("sold out"));
    }
  });
}

checkStock(3).then(
  (message) => console.log(message),
  (error) => console.log("failed: " + error.message)
);

checkStock(0).catch((error) => console.log("caught: " + error.message));
```

**Output**

```text
3 left
caught: sold out
```

**Rule:** `then(onFulfilled, onRejected)` takes a second callback, for the reason of a rejection. Only one of the two runs. `catch(onRejected)` is short for `then(undefined, onRejected)`.

A rejected promise with no handler is an **unhandled rejection**. Bun and Node stop the program with an error. Give every promise that can reject a handler.

<!-- task -->

## then returns a promise

**Code**

```js
const price = new Promise((resolve) => resolve(10));
const withTax = price.then((value) => value * 1.5);

console.log(withTax === price);
withTax.then((value) => console.log("with tax: " + value));
```

**Output**

```text
false
with tax: 15
```

**Rule:** `then` returns a new promise. It is fulfilled with whatever the callback returns. `catch` and `finally` return a new promise too.

The next lesson builds chains out of this.

**Common mistake:** using the promise as if it were the value.

**Wrong**

```js
const price = new Promise((resolve) => resolve(10));
const withTax = price.then((value) => value * 1.5);

console.log(«"with tax: " + withTax»);
```

**Output**

```text
with tax: [object Promise]
```

**Fix**

```js
const price = new Promise((resolve) => resolve(10));
const withTax = price.then((value) => value * 1.5);

«withTax.then((value) => console.log("with tax: " + value));»
```

**Output**

```text
with tax: 15
```

`then` cannot hand the value back as its result, because the value does not exist yet. The value only reaches code inside a callback.

<!-- task -->

## finally, either way

**Code**

```js
function load(online) {
  return new Promise((resolve, reject) => {
    if (online) {
      resolve("profile");
    } else {
      reject(new Error("offline"));
    }
  });
}

load(false)
  .finally(() => console.log("hide spinner"))
  .catch((error) => console.log("error: " + error.message));
```

**Output**

```text
hide spinner
error: offline
```

**Rule:** `finally(fn)` runs `fn` when the promise settles, fulfilled or rejected. Unless `fn` throws, the promise it returns settles like the original one. The value or the error passes through.

Use `finally` for clean-up that must happen either way, such as hiding a spinner.

**Common mistake:** reading the value in `finally`.

**Wrong**

```js
const profile = new Promise((resolve) => resolve("Ana"));

profile.finally(«(value) => console.log("loaded: " + value)»);
```

**Output**

```text
loaded: undefined
```

**Fix**

```js
const profile = new Promise((resolve) => resolve("Ana"));

profile.«then»((value) => console.log("loaded: " + value));
```

**Output**

```text
loaded: Ana
```

The `finally` callback gets no argument. It cannot tell a value from an error. Read the value in `then`.

<!-- task -->

## Remember

- A `then` callback always runs later, even on a promise that is already settled.
- `then(onFulfilled, onRejected)` runs one of the two. `catch(fn)` is `then(undefined, fn)`.
- `then` returns a new promise, fulfilled with what the callback returns.
- `finally(fn)` runs either way, gets no argument and passes the result through.
