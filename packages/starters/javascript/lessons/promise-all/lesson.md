# Promise.all and allSettled

## Values in input order

**Code**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const cook = (dish, ms) =>
  delay(ms, dish).then((ready) => {
    console.log(ready + " is ready");
    return ready;
  });

Promise.all([cook("soup", 50), cook("bread", 10), cook("salad", 30)]).then((dishes) => {
  console.log(dishes.join(", "));
});
```

**Output**

```text
bread is ready
salad is ready
soup is ready
soup, bread, salad
```

**Rule:** `Promise.all(list)` takes an array of promises and returns one promise. It fulfils when every promise in the list has fulfilled. Its value is an array of their values, in the order of the input, not the order they finished.

`Promise.all([4, delay(10, 5)])` fulfils with `[4, 5]`. A value that is not a promise goes into the result as it is.

`Promise.all([])` fulfils with `[]` at once.

**Common mistake:** passing the promises as separate arguments.

**Wrong**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

Promise.all(«delay(10, "soup"), delay(20, "bread")»)
  .then((dishes) => console.log(dishes.join(", ")))
  .catch((error) => console.log(error.name));
```

**Output**

```text
TypeError
```

**Fix**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

Promise.all(«[delay(10, "soup"), delay(20, "bread")]»)
  .then((dishes) => console.log(dishes.join(", ")))
  .catch((error) => console.log(error.name));
```

`Promise.all` takes one argument: an iterable, such as an array. It got a single promise, which is not iterable, so it rejected with a `TypeError`.

<!-- task -->

## The first rejection wins

**Code**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

const stock = delay(40, "in stock").then((value) => {
  console.log("stock check finished");
  return value;
});

Promise.all([stock, fail(10, "card declined"), delay(20, "address ok")])
  .then((results) => console.log(results.join(", ")))
  .catch((error) => console.log("order failed: " + error.message));
```

**Output**

```text
order failed: card declined
stock check finished
```

**Rule:** `Promise.all` rejects as soon as one promise in the list rejects, with that promise's reason. It does not wait for the others, and it does not stop them. They run on, and their results are lost.

A promise cannot be cancelled. `Promise.all` only stops listening.

A second rejection after the first one is ignored. `Promise.all` has already handled it, so it is not reported as an unhandled rejection.

<!-- task -->

## allSettled waits for all

**Code**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

Promise.allSettled([delay(20, "tea"), fail(10, "out of cake"), "jam"]).then((results) => {
  for (const result of results) {
    if (result.status === "fulfilled") {
      console.log("fulfilled: " + result.value);
    } else {
      console.log("rejected: " + result.reason.message);
    }
  }
});
```

**Output**

```text
fulfilled: tea
rejected: out of cake
fulfilled: jam
```

**Rule:** `Promise.allSettled(list)` waits until every promise has settled, and it never rejects. It fulfils with one object per input, in input order: `{ status: "fulfilled", value }` or `{ status: "rejected", reason }`.

`Promise.allSettled([])` fulfils with `[]` at once.

**Common mistake:** reading `value` from every result.

**Wrong**

```js
const fail = (message) => Promise.reject(new Error(message));

Promise.allSettled(["tea", fail("out of cake"), "jam"]).then((results) => {
  console.log(results.map((result) => «result.value»).join(","));
});
```

**Output**

```text
tea,,jam
```

**Fix**

```js
const fail = (message) => Promise.reject(new Error(message));

Promise.allSettled(["tea", fail("out of cake"), "jam"]).then((results) => {
  console.log(
    results
      .map((result) => «result.status === "fulfilled" ? result.value : result.reason.message»)
      .join(",")
  );
});
```

A rejected result has no `value`. It holds the error in `reason`. Check `status` first.

<!-- task -->

## Remember

- `Promise.all` gives the values in input order. A value that is not a promise passes through.
- It rejects at the first rejection. The other promises keep running, and their results are lost.
- `Promise.allSettled` waits for all and never rejects. Each result has `status`, then `value` or `reason`.
- With an empty array, both fulfil at once with `[]`.
