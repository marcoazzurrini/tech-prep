# From Callbacks to Promises

## Wrap one function

**Code**

```js
const settings = { theme: "dark" };

function readSetting(name, callback) {
  setTimeout(() => {
    if (name in settings) {
      callback(null, settings[name]);
    } else {
      callback(new Error("no setting: " + name));
    }
  }, 10);
}

function readSettingAsync(name) {
  return new Promise((resolve, reject) => {
    readSetting(name, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
}

readSettingAsync("theme").then((value) => console.log("theme: " + value));
readSettingAsync("font").catch((error) => console.log("failed: " + error.message));
```

**Output**

```text
theme: dark
failed: no setting: font
```

**Rule:** To turn a callback function into a promise function, return a `new Promise`. Inside it, call the old function with your own callback. That callback calls `reject(error)` on failure and `resolve(value)` on success.

This is called **promisifying**. The new function works with `then` and `await`.

**Common mistake:** passing `resolve` as the callback.

**Wrong**

```js
const settings = { theme: "dark" };

function readSetting(name, callback) {
  setTimeout(() => callback(null, settings[name]), 10);
}

function readSettingAsync(name) {
  return new Promise((resolve) => {
    readSetting(name, «resolve»);
  });
}

readSettingAsync("theme").then((value) => console.log("theme: " + value));
```

**Output**

```text
theme: null
```

**Fix**

```js
const settings = { theme: "dark" };

function readSetting(name, callback) {
  setTimeout(() => callback(null, settings[name]), 10);
}

function readSettingAsync(name) {
  return new Promise((resolve, «reject») => {
    readSetting(name, «(error, value) => (error ? reject(error) : resolve(value))»);
  });
}

readSettingAsync("theme").then((value) => console.log("theme: " + value));
```

**Output**

```text
theme: dark
```

The callback gets the error first. So `resolve` got `null`, the empty error slot, and the value was lost.

<!-- task -->

## One promisify for all

**Code**

```js
const promisify = (fn) => (...args) =>
  new Promise((resolve, reject) => {
    fn(...args, (error, value) => (error ? reject(error) : resolve(value)));
  });

function addToCart(item, count, callback) {
  setTimeout(() => callback(null, count + " x " + item), 10);
}

function checkCode(code, callback) {
  setTimeout(() => callback(code === "SAVE10" ? null : new Error("bad code")), 10);
}

const addToCartAsync = promisify(addToCart);
const checkCodeAsync = promisify(checkCode);

addToCartAsync("tea", 2).then((line) => console.log(line));
checkCodeAsync("FREE").catch((error) => console.log(error.message));
```

**Output**

```text
2 x tea
bad code
```

**Rule:** `promisify(fn)` returns a new function. It collects its arguments with `...args`, adds its own callback at the end, calls `fn`, and returns a promise.

It works for any function that takes an error-first callback as its last argument.

A promise holds one value, so this wrapper keeps only the first value after the error. A callback called as `callback(null, rows, count)` loses `count`.

<!-- task -->

## Keep this

**Code**

```js
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (error, value) => (error ? reject(error) : resolve(value)));
    });
  };
}

const shelf = {
  books: { dune: 3, emma: 1 },
  count(title, callback) {
    setTimeout(() => callback(null, this.books[title] ?? 0), 10);
  },
};

shelf.countAsync = promisify(shelf.count);
shelf.countAsync("dune").then((n) => console.log("dune: " + n));
```

**Output**

```text
dune: 3
```

**Rule:** A promisified method needs its `this`. Return a `function`, not an arrow, so the wrapper gets the `this` of its own call. Then `fn.call(this, ...args, callback)` passes it on.

`shelf.countAsync("dune")` is a method call, so `this` is `shelf` inside the wrapper, and then inside `count`.

`promisify(shelf.count.bind(shelf))` also works. The bound function always uses `shelf`.

**Common mistake:** an arrow function as the wrapper.

**Wrong**

```js
const promisify = (fn) => «(...args) =>»
  new Promise((resolve, reject) => {
    «fn(...args,» (error, value) => (error ? reject(error) : resolve(value)));
  });

const shelf = {
  books: { dune: 3 },
  count(title, callback) {
    callback(null, this.books[title] ?? 0);
  },
};

shelf.countAsync = promisify(shelf.count);
shelf.countAsync("dune").catch((error) => console.log(error.name));
```

**Output**

```text
TypeError
```

**Fix**

```js
const promisify = (fn) => «function (...args) {»
  «return» new Promise((resolve, reject) => {
    «fn.call(this, ...args,» (error, value) => (error ? reject(error) : resolve(value)));
  });
«};»

const shelf = {
  books: { dune: 3 },
  count(title, callback) {
    callback(null, this.books[title] ?? 0);
  },
};

shelf.countAsync = promisify(shelf.count);
shelf.countAsync("dune").then((n) => console.log("dune: " + n));
```

**Output**

```text
dune: 3
```

`fn(...args)` is a plain call, so `this` was `undefined` inside `count`, and `this.books` threw. The throw happened in the executor, so the promise rejected with a `TypeError`.

<!-- task -->

## Settled only once

**Code**

```js
function charge(amount, callback) {
  callback(null, "paid " + amount);
  callback(new Error("timed out"));
}

function chargeAsync(amount) {
  return new Promise((resolve, reject) => {
    charge(amount, (error, receipt) => (error ? reject(error) : resolve(receipt)));
  });
}

chargeAsync(30).then(
  (receipt) => console.log(receipt),
  (error) => console.log("failed: " + error.message)
);
```

**Output**

```text
paid 30
```

**Rule:** A promise settles only once. So the wrapper ignores every call of the callback after the first. The code that uses the promise sees exactly one result, even when the old function is buggy.

If the old function throws before it calls back, the throw happens inside the executor. The promise rejects, and the call itself does not throw.

**Common mistake:** doing the work inside the callback.

**Wrong**

```js
function charge(amount, callback) {
  callback(null, "paid " + amount);
  callback(null, "paid " + amount);
}

function chargeAsync(amount) {
  return new Promise((resolve, reject) => {
    charge(amount, (error, receipt) => {
      «console.log("email: " + receipt);»
      if (error) reject(error);
      else resolve(receipt);
    });
  });
}

chargeAsync(30);
```

**Output**

```text
email: paid 30
email: paid 30
```

**Fix**

```js
function charge(amount, callback) {
  callback(null, "paid " + amount);
  callback(null, "paid " + amount);
}

function chargeAsync(amount) {
  return new Promise((resolve, reject) => {
    charge(amount, (error, receipt) => (error ? reject(error) : resolve(receipt)));
  });
}

chargeAsync(30)«.then((receipt) => console.log("email: " + receipt))»;
```

**Output**

```text
email: paid 30
```

Only `resolve` is protected. Code inside the callback runs on every call. Keep the callback down to `resolve` and `reject`, and do the work in `then`.

<!-- task -->

## Remember

- Return a `new Promise`, call the old function inside it, and pass a callback that calls `reject(error)` or `resolve(value)`.
- `promisify(fn)` takes `...args`, adds that callback at the end and calls `fn`.
- Return a `function`, not an arrow, and use `fn.call(this, ...)`, so methods keep their `this`.
- The promise settles once, so extra callbacks are ignored. Code inside the callback still runs each time.
