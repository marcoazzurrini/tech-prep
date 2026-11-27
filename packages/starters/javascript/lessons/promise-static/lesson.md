# Promise.resolve and Friends

## Promise.resolve

**Code**

```js
const ready = Promise.resolve(5);
ready.then((n) => console.log("value " + n));

const same = Promise.resolve(ready);
console.log(same === ready);

const wrapped = new Promise((resolve) => resolve(ready));
console.log(wrapped === ready);
```

**Output**

```text
true
false
value 5
```

**Rule:** `Promise.resolve(value)` gives a promise fulfilled with `value`. When `value` is already a promise, it gives back that same promise.

`new Promise((resolve) => resolve(ready))` always makes a new promise. That new promise follows `ready` and gets its value.

`Promise.resolve(rejected)` gives back the rejected promise, still rejected. To **resolve** a promise means to tie it to a value or to another promise. It does not always mean to fulfil it.

<!-- task -->

## Thenables are followed

**Code**

```js
const ticket = {
  then(resolve) {
    console.log("then called");
    setTimeout(() => resolve("seat 12"), 10);
  },
};

const booked = Promise.resolve(ticket);
console.log(booked instanceof Promise);
booked.then((seat) => console.log("got " + seat));
console.log("sync done");
```

**Output**

```text
true
sync done
then called
got seat 12
```

**Rule:** A **thenable** is any object with a `then` method. `Promise.resolve` calls that method with a `resolve` and a `reject` function, and the new promise follows whichever is called.

The `then` method is called later, as a microtask, not at once. That is why `sync done` came first.

A `then` callback that returns a thenable is followed in the same way, and so is `resolve(thenable)` inside `new Promise`.

**Common mistake:** a `then` method that has another job.

**Wrong**

```js
const plan = {
  steps: [],
  «then»(step) {
    this.steps.push(step);
    return this;
  },
};

Promise.resolve(plan).then((result) => console.log("steps: " + result.steps.length));
setTimeout(() => console.log("waited"), 10);
```

**Output**

```text
waited
```

**Fix**

```js
const plan = {
  steps: [],
  «addStep»(step) {
    this.steps.push(step);
    return this;
  },
};

Promise.resolve(plan).then((result) => console.log("steps: " + result.steps.length));
setTimeout(() => console.log("waited"), 10);
```

The object had a `then` method, so `Promise.resolve` treated it as a thenable. The method never called `resolve`, so the promise stayed pending for ever. Do not name a method `then` unless the object is meant to act like a promise.

<!-- task -->

## Promise.reject

**Code**

```js
const refused = Promise.reject(new Error("offline"));
refused.catch((error) => console.log("caught: " + error.message));

const inner = Promise.resolve(1);
Promise.reject(inner).catch((reason) => console.log(reason === inner));
```

**Output**

```text
caught: offline
true
```

**Rule:** `Promise.reject(reason)` gives a new promise, rejected with `reason`. It never follows a promise or a thenable: what you pass becomes the reason itself.

Handle every rejected promise with `catch`. Otherwise the runtime reports an unhandled rejection.

`Promise.try(fn)` calls `fn` at once and gives a promise of what it returns. If `fn` throws, that promise rejects, so the error does not escape as a plain `throw`.

<!-- task -->

## Promise.withResolvers

**Code**

```js
const { promise, resolve } = Promise.withResolvers();

promise.then((name) => console.log("door opened for " + name));

function ringBell(name) {
  console.log("ring from " + name);
  resolve(name);
}

setTimeout(() => ringBell("Ada"), 10);
setTimeout(() => ringBell("Bo"), 30);
```

**Output**

```text
ring from Ada
door opened for Ada
ring from Bo
```

**Rule:** `Promise.withResolvers()` gives an object with three parts: `promise`, `resolve` and `reject`. Code outside the promise can settle it later, from anywhere.

The promise still settles only once. The second `resolve("Bo")` did nothing.

`let resolve; const promise = new Promise((r) => { resolve = r; });` does the same job, in a longer way.

<!-- task -->

## Remember

- `Promise.resolve(x)` gives a promise of `x`. A promise comes back as it is, and a thenable is followed.
- A thenable is any object with a `then` method. Its `then` is called later, as a microtask.
- `Promise.reject(reason)` gives a rejected promise, with `reason` as it is.
- `Promise.withResolvers()` hands out `promise`, `resolve` and `reject`, to settle the promise from outside.
