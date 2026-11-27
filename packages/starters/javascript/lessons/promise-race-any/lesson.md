# Promise.race and any

## The first to settle

**Code**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

Promise.race([delay(50, "slow mirror"), delay(10, "fast mirror")])
  .then((value) => console.log("race 1: " + value));

Promise.race([delay(50, "slow mirror"), fail(30, "fast mirror is down")])
  .then((value) => console.log("race 2: " + value))
  .catch((error) => console.log("race 2: " + error.message));
```

**Output**

```text
race 1: fast mirror
race 2: fast mirror is down
```

**Rule:** `Promise.race(list)` settles the same way as the first promise in the list to settle. If that one fulfils, the race fulfils with its value. If it rejects, the race rejects with its reason.

The other promises keep running. Their results are ignored.

`Promise.race([])` never settles. It stays pending for ever.

<!-- task -->

## A time limit

**Code**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const timeout = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("timed out after " + ms + " ms")), ms);
  });

const withTimeout = (promise, ms) => Promise.race([promise, timeout(ms)]);

withTimeout(delay(10, "quick report"), 30)
  .then((value) => console.log(value))
  .catch((error) => console.log(error.message));

withTimeout(delay(50, "slow report"), 30)
  .then((value) => console.log(value))
  .catch((error) => console.log(error.message));
```

**Output**

```text
quick report
timed out after 30 ms
```

**Rule:** To put a time limit on a promise, race it against a promise that rejects when the time is up. Whichever settles first decides the result.

The slow report is not stopped. Only the waiting for it ends.

The first timeout still rejects at 30 ms. `Promise.race` has handled it, so it is not reported as an unhandled rejection.

**Common mistake:** racing against a number.

**Wrong**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const timeout = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("timed out after " + ms + " ms")), ms);
  });

Promise.race([delay(50, "slow report"), «30»])
  .then((value) => console.log(value))
  .catch((error) => console.log(error.message));
```

**Output**

```text
30
```

**Fix**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const timeout = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("timed out after " + ms + " ms")), ms);
  });

Promise.race([delay(50, "slow report"), «timeout(30)»])
  .then((value) => console.log(value))
  .catch((error) => console.log(error.message));
```

A value that is not a promise counts as a promise that has already fulfilled. So `30` won the race at once.

<!-- task -->

## The first success

**Code**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

Promise.any([fail(10, "mirror A is down"), delay(50, "mirror C"), delay(30, "mirror B")])
  .then((value) => console.log("got " + value));
```

**Output**

```text
got mirror B
```

**Rule:** `Promise.any(list)` fulfils with the value of the first promise to fulfil. It skips the rejections on the way.

**Common mistake:** using `race` to get the first success.

**Wrong**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

Promise.«race»([fail(10, "mirror A is down"), delay(30, "mirror B")])
  .then((value) => console.log("got " + value))
  .catch((error) => console.log("failed: " + error.message));
```

**Output**

```text
failed: mirror A is down
```

**Fix**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

Promise.«any»([fail(10, "mirror A is down"), delay(30, "mirror B")])
  .then((value) => console.log("got " + value))
  .catch((error) => console.log("failed: " + error.message));
```

A rejection settles a promise too, so it can win a race. `Promise.any` waits for the first promise that fulfils.

<!-- task -->

## When all of them reject

**Code**

```js
const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

Promise.any([fail(50, "north road closed"), fail(10, "south road closed")])
  .catch((error) => {
    console.log(error.name);
    console.log(error instanceof AggregateError);
    console.log(error.errors.map((reason) => reason.message).join(" / "));
  });
```

**Output**

```text
AggregateError
true
north road closed / south road closed
```

**Rule:** `Promise.any` rejects only when every promise has rejected. Its reason is an `AggregateError`, an error that holds several errors. Its `errors` array has every reason, in input order, not in the order they happened.

`Promise.any([])` rejects at once, with an `AggregateError` whose `errors` is empty.

<!-- task -->

## Remember

- `Promise.race` settles like the first promise to settle, fulfilled or rejected. `Promise.race([])` never settles.
- For a time limit, race the work against a promise that rejects when the time is up.
- `Promise.any` fulfils with the first success and skips rejections.
- If all reject, `Promise.any` rejects with an `AggregateError`. Its `errors` keep input order.
