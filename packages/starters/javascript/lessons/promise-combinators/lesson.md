# Writing Promise.all

## Results in input order

**Code**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function promiseAll(list) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;

    list.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;
        done += 1;
        if (done === list.length) {
          resolve(results);
        }
      }, reject);
    });
  });
}

promiseAll([delay(30, "flour"), delay(10, "eggs"), "milk"]).then((items) => {
  console.log(items.join(", "));
});

promiseAll([delay(10, "sugar"), Promise.reject(new Error("no butter"))]).catch((error) => {
  console.log("failed: " + error.message);
});
```

**Output**

```text
failed: no butter
flour, eggs, milk
```

**Rule:** `promiseAll` returns a new promise. Each value goes to `results[i]`, the index of its input, and a counter counts the values. When the count reaches the length of the list, it resolves with `results`.

`reject` is the second callback of every `then`. So the first rejection rejects the whole result. A later one is ignored, because a promise settles only once.

`Promise.resolve(item)` turns a plain value, such as `"milk"`, into a promise. So every item has a `then`.

**Common mistake:** pushing each value as it arrives.

**Wrong**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function promiseAll(list) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;

    list.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        «results.push(value);»
        done += 1;
        if (done === list.length) {
          resolve(results);
        }
      }, reject);
    });
  });
}

promiseAll([delay(30, "flour"), delay(10, "eggs"), "milk"]).then((items) => {
  console.log(items.join(", "));
});
```

**Output**

```text
milk, eggs, flour
```

**Fix**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function promiseAll(list) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;

    list.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        «results[i] = value;»
        done += 1;
        if (done === list.length) {
          resolve(results);
        }
      }, reject);
    });
  });
}

promiseAll([delay(30, "flour"), delay(10, "eggs"), "milk"]).then((items) => {
  console.log(items.join(", "));
});
```

**Output**

```text
flour, eggs, milk
```

`push` puts the values in the order they finish. `Promise.all` keeps the order of the input, so store each value at its own index.

<!-- task -->

## Empty lists and counting

**Code**

```js
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const list = [...iterable];
    const results = [];
    let done = 0;

    if (list.length === 0) {
      resolve(results);
      return;
    }

    list.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;
        done += 1;
        if (done === list.length) {
          resolve(results);
        }
      }, reject);
    });
  });
}

promiseAll([]).then((values) => console.log("empty: " + values.length));
promiseAll(new Set(["tea", "jam"])).then((values) => console.log("set: " + values.join(",")));
```

**Output**

```text
empty: 0
set: tea,jam
```

**Rule:** With an empty list, no `then` callback ever runs, so nothing would resolve. Resolve with `[]` at once. `Promise.all` takes any iterable, so spread the input into an array first.

**Common mistake:** checking `results.length` instead of counting.

**Wrong**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function promiseAll(list) {
  return new Promise((resolve, reject) => {
    const results = [];

    list.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;
        if («results.length === list.length») {
          resolve(results);
        }
      }, reject);
    });
  });
}

promiseAll([delay(30, "a"), delay(10, "b"), "c"]).then((values) => {
  console.log(values.join(","));
});
```

**Output**

```text
,,c
```

**Fix**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function promiseAll(list) {
  return new Promise((resolve, reject) => {
    const results = [];
    «let done = 0;»

    list.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;
        «done += 1;»
        if («done === list.length») {
          resolve(results);
        }
      }, reject);
    });
  });
}

promiseAll([delay(30, "a"), delay(10, "b"), "c"]).then((values) => {
  console.log(values.join(","));
});
```

**Output**

```text
a,b,c
```

`"c"` came first and went to `results[2]`. That made the length 3, with two holes before it, so the promise resolved too early. A counter counts only the values that have arrived.

<!-- task -->

## race: first to settle

**Code**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

function promiseRace(list) {
  return new Promise((resolve, reject) => {
    for (const item of list) {
      Promise.resolve(item).then(resolve, reject);
    }
  });
}

promiseRace([delay(50, "bus"), delay(10, "tram")]).then((value) => {
  console.log("first: " + value);
});

promiseRace([delay(50, "bus"), fail(30, "strike")]).catch((error) => {
  console.log("failed: " + error.message);
});
```

**Output**

```text
first: tram
failed: strike
```

**Rule:** `promiseRace` hooks every item to the same `resolve` and `reject`. The first item to settle calls one of them. Every later call is ignored, because a promise settles only once.

With an empty list, nothing calls `resolve` or `reject`. The promise stays pending for ever, just like `Promise.race([])`.

**Common mistake:** calling `then` on each item as it is.

**Wrong**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function promiseRace(list) {
  return new Promise((resolve, reject) => {
    for (const item of list) {
      «item».then(resolve, reject);
    }
  });
}

promiseRace([delay(50, "bus"), "walk"])
  .then((value) => console.log("first: " + value))
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

function promiseRace(list) {
  return new Promise((resolve, reject) => {
    for (const item of list) {
      «Promise.resolve(item)».then(resolve, reject);
    }
  });
}

promiseRace([delay(50, "bus"), "walk"])
  .then((value) => console.log("first: " + value))
  .catch((error) => console.log(error.name));
```

**Output**

```text
first: walk
```

`"walk"` has no `then` method, so calling it threw a `TypeError`. The throw happened inside the executor, so it rejected the promise. `Promise.resolve` makes a plain value into a promise that has already fulfilled, so it wins.

<!-- task -->

## any mirrors all

**Code**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

function promiseAny(iterable) {
  return new Promise((resolve, reject) => {
    const list = [...iterable];
    const errors = [];
    let failed = 0;

    if (list.length === 0) {
      reject(new AggregateError(errors, "nothing to try"));
      return;
    }

    list.forEach((item, i) => {
      Promise.resolve(item).then(resolve, (error) => {
        errors[i] = error;
        failed += 1;
        if (failed === list.length) {
          reject(new AggregateError(errors, "every item failed"));
        }
      });
    });
  });
}

promiseAny([fail(10, "north shut"), delay(30, "east")]).then((road) => {
  console.log("open: " + road);
});

promiseAny([fail(50, "north shut"), fail(30, "south shut")]).catch((error) => {
  console.log(error.name);
  console.log(error.errors.map((reason) => reason.message).join(", "));
});
```

**Output**

```text
open: east
AggregateError
north shut, south shut
```

**Rule:** `promiseAny` is `promiseAll` turned around. The first value resolves it. Each rejection is stored at its index and counted. When every item has rejected, it rejects with an `AggregateError` that holds them all, in input order.

`new AggregateError(errors, message)` takes the array of errors first. Its `errors` property gives that array back.

<!-- task -->

## Remember

- Store each value at its index and count them. Resolve when the count reaches the length. Never test `results.length`.
- Wrap each item in `Promise.resolve`, so plain values work. Spread the input, so any iterable works.
- An empty list resolves with `[]` at once in `all`, and rejects at once in `any`. `race` stays pending.
- Hook every item to the same `resolve` and `reject`. A promise settles once, so the first call wins.
