# Functions as Values

## Store a function

**Code**

```js
function double(n) {
  return n * 2;
}

const twice = double;
const steps = [double, (n) => n + 1];
const tools = { shout: (text) => text.toUpperCase() };

console.log(twice(4));
console.log(steps[1](4));
console.log(tools.shout("hi"));
console.log(twice === double);
```

**Output**

```text
8
5
HI
true
```

**Rule:** A function is a value, like a number or a string. A variable, an array and an object can all hold one. This is what **first-class** means: a function can go wherever any other value can.

`twice === double` gives `true`. Both names hold the same function. Nothing was copied.

`steps[1](4)` reads the function at index 1, then calls it with `4`.

<!-- task -->

## Pass, don't call

**Code**

```js
function applyToAll(prices, change) {
  const result = [];

  for (const price of prices) {
    result.push(change(price));
  }

  return result;
}

const half = (price) => price / 2;

console.log(applyToAll([10, 30], half));
console.log(applyToAll([10, 30], (price) => price + 1));
```

**Output**

```text
[ 5, 15 ]
[ 11, 31 ]
```

**Rule:** A function that you hand to another function is a **callback**. Pass its name with no `()`. The function that receives it decides when to call it, and with what.

`half` is the function. `half(10)` is what the function returns: the number `5`.

**Common mistake:** calling the function while passing it.

**Wrong**

```js
function applyToAll(prices, change) {
  const result = [];

  for (const price of prices) {
    result.push(change(price));
  }

  return result;
}

const half = (price) => price / 2;

console.log(applyToAll([10, 30], «half(10)»));
```

**Error**

```text
TypeError: change is not a function. (In 'change(price)', 'change' is 5)
```

**Fix**

```js
function applyToAll(prices, change) {
  const result = [];

  for (const price of prices) {
    result.push(change(price));
  }

  return result;
}

const half = (price) => price / 2;

console.log(applyToAll([10, 30], «half»));
```

`half(10)` ran first and gave `5`. So `applyToAll` received a number, and a number cannot be called.

<!-- task -->

## Returning a function

**Code**

```js
const byPost = (weight) => 3 + weight * 2;
const byCourier = (weight) => 10 + weight;

function shippingFor(urgent) {
  return urgent ? byCourier : byPost;
}

const price = shippingFor(false);

console.log(price(4));
console.log(shippingFor(true)(4));
console.log(typeof shippingFor(true));
```

**Output**

```text
11
14
function
```

**Rule:** A function can return a function. The caller gets the function itself, and calls it when it wants to. A function that takes or returns a function is a **higher-order function**.

`shippingFor(true)(4)` is two calls. The first returns `byCourier`. The second calls `byCourier` with `4`.

`shippingFor(true)` alone gives a function, not a price. No shipping was worked out yet.

<!-- task -->

## Remember

- Functions are first-class: a variable, an array or an object can hold one.
- `fn` is the function. `fn()` is what it returns.
- A callback is a function you pass in. The receiver calls it.
- A higher-order function takes a function or returns one. `pick(a)(b)` is two calls.
