# async Functions

## Always a promise

**Code**

```js
async function shippingCost(weight) {
  return weight > 10 ? 8 : 4;
}

const result = shippingCost(12);

console.log(result instanceof Promise);
result.then((cost) => console.log("cost: " + cost));
console.log("asked for the cost");
```

**Output**

```text
true
asked for the cost
cost: 8
```

**Rule:** An `async` function always returns a promise. The value it returns becomes the value of that promise.

`return Promise.resolve(8)` gives the same result as `return 8`. A promise that is returned is followed, not wrapped in a second promise.

A body with no `return` gives a promise of `undefined`.

**Common mistake:** using the result as if it were the value.

**Wrong**

```js
async function shippingCost(weight) {
  return weight > 10 ? 8 : 4;
}

const total = 20 + «shippingCost(12)»;
console.log(total);
```

**Output**

```text
20[object Promise]
```

**Fix**

```js
async function shippingCost(weight) {
  return weight > 10 ? 8 : 4;
}

«shippingCost(12).then((cost) => console.log(20 + cost));»
```

`shippingCost(12)` is a promise, not `8`. The `+` turned it into the text `[object Promise]`. Take the value out with `then`.

<!-- task -->

## The body runs at once

**Code**

```js
async function greet(name) {
  console.log("inside greet");
  return "hello " + name;
}

console.log("before");
greet("Ada").then((text) => console.log(text));
console.log("after");
```

**Output**

```text
before
inside greet
after
hello Ada
```

**Rule:** Calling an `async` function runs its body straight away, like any other function. `async` does not delay the body. Only the result comes later: the `then` callback runs after the current code has finished.

A body can only pause at `await`. The next lesson covers it.

<!-- task -->

## throw rejects the promise

**Code**

```js
async function checkout(cart) {
  if (cart.length === 0) {
    throw new Error("cart is empty");
  }
  return "paid";
}

const result = checkout([]);
console.log("the call returned: " + (result instanceof Promise));
result.catch((error) => console.log("rejected: " + error.message));
```

**Output**

```text
the call returned: true
rejected: cart is empty
```

**Rule:** A `throw` inside an `async` function does not leave the call. It rejects the promise the function returned. So the call itself never throws, and a `catch` on the promise gets the error.

This holds for every error in the body, also a `TypeError` from a bug.

**Common mistake:** a plain function that returns a promise.

**Wrong**

```js
«function» checkout(cart) {
  if (cart.length === 0) {
    throw new Error("cart is empty");
  }
  return Promise.resolve("paid");
}

checkout([])
  .then((status) => console.log(status))
  .catch((error) => console.log("rejected: " + error.message));
```

**Error**

```text
Error: cart is empty
```

**Fix**

```js
«async function» checkout(cart) {
  if (cart.length === 0) {
    throw new Error("cart is empty");
  }
  return Promise.resolve("paid");
}

checkout([])
  .then((status) => console.log(status))
  .catch((error) => console.log("rejected: " + error.message));
```

The plain function threw before it made a promise. The error left the call, and the `catch` never saw it. With `async`, every `throw` becomes a rejection.

<!-- task -->

## Arrows and methods

**Code**

```js
const double = async (n) => n * 2;

const cart = {
  prices: [3, 6],
  async total() {
    return this.prices.reduce((sum, price) => sum + price, 0);
  },
};

class Shop {
  constructor(name) {
    this.name = name;
  }

  async open() {
    return this.name + " is open";
  }
}

double(4).then((value) => console.log(value));
cart.total().then((value) => console.log(value));
new Shop("Corner Shop").open().then((text) => console.log(text));
```

**Output**

```text
8
9
Corner Shop is open
```

**Rule:** `async` works on every kind of function: declarations, expressions, arrow functions, object methods and class methods. It goes first: `async (n) => n * 2`, `async total() {}`.

In an `async` method, `this` is the object, as in any method.

A getter, a setter and a constructor cannot be `async`.

**Common mistake:** `map` with an `async` callback.

**Wrong**

```js
const addShipping = async (price) => price + 4;

const prices = [10, 5].map(addShipping);
«console.log(prices.join(", "));»
```

**Output**

```text
[object Promise], [object Promise]
```

**Fix**

```js
const addShipping = async (price) => price + 4;

const prices = [10, 5].map(addShipping);
«Promise.all(prices).then((values) => console.log(values.join(", ")));»
```

Each call of an `async` callback returns a promise. So `map` gives an array of promises. `Promise.all` turns it into one promise of all the values.

<!-- task -->

## Remember

- An `async` function always returns a promise. Its `return` value becomes the value, and a returned promise is followed.
- Calling it runs the body at once. Only the result arrives later.
- A `throw` in the body rejects the promise. The call itself never throws.
- `async` works on arrows and methods too. `map` with an `async` callback gives promises.
