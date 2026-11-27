# Errors in Promises

## A throw rejects

**Code**

```js
const order = new Promise((resolve) => resolve({ items: [] }));

order
  .then((cart) => {
    if (cart.items.length === 0) {
      throw new Error("cart is empty");
    }
    return cart;
  })
  .then((cart) => console.log("paying for " + cart.items.length))
  .then(() => console.log("receipt sent"))
  .catch((error) => console.log("caught: " + error.message));
```

**Output**

```text
caught: cart is empty
```

**Rule:** A `throw` inside a callback rejects the promise that its `then` returned. The rejection skips every `then` below it, until it reaches a `catch`.

`user.name` throws a `TypeError` when `user` is `undefined`. Inside a callback, that bug rejects in the same way, and the `catch` gets the `TypeError`.

`catch(fn)` is short for `then(undefined, fn)`. It returns a new promise, like `then`.

<!-- task -->

## What runs after catch

**Code**

```js
function loadAvatar(user) {
  return new Promise((resolve, reject) => {
    if (user.avatar) {
      resolve(user.avatar);
    } else {
      reject(new Error("no avatar"));
    }
  });
}

loadAvatar({ name: "Ada" })
  .then((file) => file.toUpperCase())
  .catch((error) => {
    console.log("using default: " + error.message);
    return "default.png";
  })
  .then((file) => console.log("show " + file));
```

**Output**

```text
using default: no avatar
show default.png
```

**Rule:** What a `catch` callback returns fulfils the next promise. So after a `catch`, the chain carries on with the next `then`, as if nothing went wrong.

`finally(fn)` is different. It runs on both outcomes, but it passes on the same value or the same error. What `fn` returns is ignored. A `throw` inside `fn` still rejects the next promise, with the new error.

**Common mistake:** a `catch` in the middle that only logs.

**Wrong**

```js
function loadPrice(id) {
  return new Promise((resolve, reject) => {
    if (id > 0) {
      resolve(id * 10);
    } else {
      reject(new Error("bad id"));
    }
  });
}

loadPrice(-1)
  «.catch((error) => console.log("failed: " + error.message))»
  .then((price) => console.log("price: " + price));
```

**Output**

```text
failed: bad id
price: undefined
```

**Fix**

```js
function loadPrice(id) {
  return new Promise((resolve, reject) => {
    if (id > 0) {
      resolve(id * 10);
    } else {
      reject(new Error("bad id"));
    }
  });
}

loadPrice(-1)
  .then((price) => console.log("price: " + price))
  «.catch((error) => console.log("failed: " + error.message))»;
```

The `catch` handled the error and returned `undefined`. So the next `then` ran with `undefined`, as if the price had loaded. Put the `catch` where the chain should stop.

<!-- task -->

## Rethrow the unknown

**Code**

```js
function themeOf(text) {
  return new Promise((resolve) => resolve(text))
    .then((raw) => JSON.parse(raw).theme.toUpperCase())
    .catch((error) => {
      if (error instanceof SyntaxError) {
        return "LIGHT";
      }
      throw error;
    });
}

themeOf('{"theme":"dark"}').then((theme) => console.log(theme));
themeOf("not json").then((theme) => console.log(theme));
themeOf("{}")
  .then((theme) => console.log(theme))
  .catch((error) => console.log("rethrown: " + error.name));
```

**Output**

```text
DARK
LIGHT
rethrown: TypeError
```

**Rule:** A `throw` inside a `catch` callback rejects the next promise again. The error goes on to the next `catch`. Handle the errors you expect, and rethrow the rest.

`"{}"` is valid JSON with no `theme`, so reading `.toUpperCase` of `undefined` threw a `TypeError`. The rethrow kept that bug visible.

`return error` inside a `catch` does not rethrow. It fulfils the next promise, with the error object as its value.

<!-- task -->

## Two callbacks in then

**Code**

```js
const refused = new Promise((resolve, reject) => reject(new Error("no funds")));
const paid = new Promise((resolve) => resolve(30));

const ok = (amount) => {
  throw new Error("no receipt for " + amount);
};
const fail = (error) => console.log("handled: " + error.message);

refused.then(ok, fail);
paid.then(ok, fail).catch((error) => console.log("missed: " + error.message));
paid.then(ok).catch(fail);
```

**Output**

```text
handled: no funds
missed: no receipt for 30
handled: no receipt for 30
```

**Rule:** In `then(ok, fail)`, `fail` handles a rejection of the promise before it. It does not see an error thrown by `ok`, which is on the same step. `then(ok).catch(fail)` handles both.

`then(ok, fail)` runs exactly one of its two callbacks. Use it when an error in `ok` must not be handled by `fail`.

<!-- task -->

## Remember

- A `throw` in a callback rejects the next promise. The rejection skips each `then` until a `catch`.
- What a `catch` returns fulfils the next promise, so the chain carries on. `finally` passes the result on unchanged.
- Handle the errors you expect in `catch`, and rethrow the others.
- `then(ok, fail)` does not catch an error from `ok`. `then(ok).catch(fail)` does.
