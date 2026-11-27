# map and filter

## map makes a new array

**Code**

```js
const prices = [10, 25, 40];

const discounted = prices.map((price) => price - 5);
const labels = prices.map((price, index) => `${index + 1}: ${price}`);

console.log(discounted.join(", "));
console.log(labels.join(" | "));
console.log(prices.join(", "));
```

**Output**

```text
5, 20, 35
1: 10 | 2: 25 | 3: 40
10, 25, 40
```

**Rule:** `map(callback)` calls the callback once for each item and returns a new array of what it returned. The new array has the same length. The original stays as it was.

To return an object from an arrow function, wrap it in parentheses: `(user) => ({ name: user.name })`. Without them, the braces are read as a function body.

**Common mistake:** a function body with no `return`.

**Wrong**

```js
const sizes = [1, 2, 3];
const doubled = sizes.map((size) => «{ size * 2; }»);

console.log(doubled[0]);
```

**Output**

```text
undefined
```

**Fix**

```js
const sizes = [1, 2, 3];
const doubled = sizes.map((size) => «size * 2»);

console.log(doubled[0]);
```

With braces, the arrow function has a body, and a body returns `undefined` unless it says `return`. Without braces, the arrow returns its expression.

<!-- task -->

## Three arguments

**Code**

```js
const codes = ["7", "8", "9"];

console.log(codes.map(parseInt).join(", "));
console.log(codes.map((code) => parseInt(code)).join(", "));
console.log(codes.map(Number).join(", "));
```

**Output**

```text
7, NaN, NaN
7, 8, 9
7, 8, 9
```

```steps
parseInt("7", «0») => 7
parseInt("8", «1») => NaN
parseInt("9", «2») => NaN
```

**Rule:** `map` calls its callback with three arguments: the item, its index and the whole array. A function that takes a second parameter gets the index there, whether you meant it or not.

`parseInt(text, radix)` takes a radix as its second argument: the base of the number, from 2 to 36. A radix of `0` counts as no radix, so `"7"` is read in base 10. There is no base 1, and `"9"` is not a digit in base 2.

`filter` and `forEach` pass the same three arguments.

**Common mistake:** passing a function with an optional second parameter.

**Wrong**

```js
function formatPrice(amount, currency = "EUR") {
  return `${amount} ${currency}`;
}

console.log([5, 10].map(«formatPrice»).join(" / "));
```

**Output**

```text
5 0 / 10 1
```

**Fix**

```js
function formatPrice(amount, currency = "EUR") {
  return `${amount} ${currency}`;
}

console.log([5, 10].map(«(amount) => formatPrice(amount)»).join(" / "));
```

`map` passed the index as `currency`, so the default never applied. A small arrow function passes only the item.

<!-- task -->

## filter keeps some items

**Code**

```js
const scores = [12, 3, 18, 7];
const passed = scores.filter((score) => score >= 10);

const inputs = ["Ada", "", null, "Bo", undefined];
const names = inputs.filter(Boolean);

console.log(passed.join(", "));
console.log(names.join(", "));
console.log(scores.length);
```

**Output**

```text
12, 18
Ada, Bo
4
```

**Rule:** `filter(callback)` returns a new array of the items for which the callback returned a truthy value. The items keep their order. The new array can be shorter, or empty.

`filter(Boolean)` passes each item to `Boolean`, so it keeps the truthy items and drops the falsy ones.

The new array holds the same items, not copies. An object kept by `filter` is the same object as in the original.

**Common mistake:** using `filter(Boolean)` on numbers.

**Wrong**

```js
const readings = [4, 0, null, 9];
const known = readings.filter(«Boolean»);

console.log(known.join(", "));
```

**Output**

```text
4, 9
```

**Fix**

```js
const readings = [4, 0, null, 9];
const known = readings.filter(«(reading) => reading !== null»);

console.log(known.join(", "));
```

`0` is a real reading, but it is falsy, so `Boolean` dropped it. Test for exactly the values you want to remove.

<!-- task -->

## forEach and chains

**Code**

```js
const orders = [
  { id: 1, total: 30, paid: true },
  { id: 2, total: 12, paid: false },
  { id: 3, total: 50, paid: true },
];

const paidTotals = orders.filter((order) => order.paid).map((order) => order.total);
console.log(paidTotals.join(", "));

const result = orders.forEach((order) => order.total);
console.log(result);
```

**Output**

```text
30, 50
undefined
```

**Rule:** `map` and `filter` return a new array, so you can call the next method on the result. This is a **chain**. `forEach` calls its callback for each item and returns `undefined`, so a chain ends there.

Use `forEach` only for an effect, such as logging. To build an array, use `map` or `filter`.

`forEach` cannot stop early. A `return` in its callback ends only that call. Use `for...of` when you need `break` or `return`.

**Common mistake:** mapping before filtering.

**Wrong**

```js
const users = [
  { name: "Ada", active: true },
  { name: "Bo", active: false },
];

const names = users«.map((user) => user.name).filter((user) => user.active)»;
console.log(names.length);
```

**Output**

```text
0
```

**Fix**

```js
const users = [
  { name: "Ada", active: true },
  { name: "Bo", active: false },
];

const names = users«.filter((user) => user.active).map((user) => user.name)»;
console.log(names.length);
```

After `map`, the items were strings, and a string has no `active`. Each step sees only what the step before it returned, so filter first.

<!-- task -->

## Remember

- `map` returns a new array of the same length. `filter` returns the items whose callback was truthy.
- The callback gets the item, its index and the array. Wrap a function that takes a second parameter.
- `filter(Boolean)` drops every falsy value, `0` and `""` included.
- `forEach` returns `undefined`. Chain `map` and `filter`, and filter before you map away a field.
