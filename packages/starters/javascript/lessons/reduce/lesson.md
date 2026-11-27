# reduce

## Fold into one value

**Code**

```js
const cart = [4, 10, 6];

const total = cart.reduce((sum, price) => sum + price, 0);
const receipt = cart.reduce((text, price, index) => `${text} #${index}:${price}`, "Cart");

console.log(total);
console.log(receipt);
```

**Output**

```text
20
Cart #0:4 #1:10 #2:6
```

```steps
«0» + 4 => 4
«4» + 10 => 14
«14» + 6 => 20
```

**Rule:** `reduce(callback, start)` folds an array into one value. The callback gets the value so far, called the **accumulator**, and the next item. What it returns becomes the accumulator for the next item. After the last item, `reduce` returns the accumulator.

The first accumulator is `start`. The callback also gets the item's index and the whole array, as in `map`.

<!-- task -->

## Always pass a start

**Code**

```js
const add = (sum, n) => sum + n;

console.log([4, 6].reduce(add));
console.log([9].reduce(() => "never called"));
console.log([].reduce(add, 0));

try {
  [].reduce(add);
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
10
9
0
TypeError
```

**Rule:** Without a start value, `reduce` uses the first item as the accumulator and calls the callback from the second item on. With one item, it returns that item and never calls the callback. On an empty array it throws a `TypeError`. With a start value, an empty array gives the start value.

**Common mistake:** leaving out the start when the items are objects.

**Wrong**

```js
const cart = [{ price: 5 }, { price: 20 }];
const total = cart.reduce((sum, item) => sum + item.price);

console.log(total);
```

**Output**

```text
[object Object]20
```

**Fix**

```js
const cart = [{ price: 5 }, { price: 20 }];
const total = cart.reduce((sum, item) => sum + item.price«, 0»);

console.log(total);
```

The first item, an object, became `sum`. Adding a number to an object joins them as text. Start at `0`, and every step adds a number to a number.

<!-- task -->

## Building an object

**Code**

```js
const users = [
  { id: "u1", name: "Ada" },
  { id: "u2", name: "Bo" },
];

const namesById = users.reduce((lookup, user) => {
  lookup[user.id] = user.name;
  return lookup;
}, {});

console.log(namesById.u2);
console.log(JSON.stringify(namesById));
```

**Output**

```text
Bo
{"u1":"Ada","u2":"Bo"}
```

**Rule:** The start value can be an object. Each call adds to it and returns it, so the next call gets the same object. Without the `return`, the next accumulator is `undefined`.

`return { ...lookup, [user.id]: user.name }` works too. But it copies the whole object at every item, which is slow for a long array.

**Common mistake:** a start object made outside the call.

**Wrong**

```js
const empty = {};

function indexById(list) {
  return list.reduce((lookup, item) => {
    lookup[item.id] = item.name;
    return lookup;
  }, «empty»);
}

indexById([{ id: 1, name: "Ada" }]);
console.log(JSON.stringify(indexById([{ id: 2, name: "Bo" }])));
```

**Output**

```text
{"1":"Ada","2":"Bo"}
```

**Fix**

```js
function indexById(list) {
  return list.reduce((lookup, item) => {
    lookup[item.id] = item.name;
    return lookup;
  }, «{}»);
}

indexById([{ id: 1, name: "Ada" }]);
console.log(JSON.stringify(indexById([{ id: 2, name: "Bo" }])));
```

Both calls filled the one `empty` object, so the second result held Ada too. A `{}` written in the call makes a new object each time.

<!-- task -->

## When a loop is clearer

**Code**

```js
const items = [
  { name: "tea", stock: 0 },
  { name: "jam", stock: 4 },
  { name: "oil", stock: 2 },
];

const viaReduce = items.reduce(
  (names, item) => (item.stock > 0 ? [...names, item.name] : names),
  [],
);
const viaChain = items.filter((item) => item.stock > 0).map((item) => item.name);

console.log(viaReduce.join(","));
console.log(viaChain.join(","));
```

**Output**

```text
jam,oil
jam,oil
```

**Rule:** `reduce` can build anything, but it does not say what it builds. Use it to combine many items into one value, such as a total or a lookup. To build an array, `filter` and `map` read better. To stop early, use a `for...of` loop: `reduce` always visits every item.

`reduceRight` works like `reduce`, from the last item to the first: `["a", "b", "c"].reduceRight((text, s) => text + s, "")` gives `"cba"`.

**Common mistake:** returning what `push` returns.

**Wrong**

```js
const prices = [3, 8];
const doubled = prices.reduce((list, price) => «list.push(price * 2)», []);

console.log(doubled.join(","));
```

**Error**

```text
TypeError: list.push is not a function. (In 'list.push(price * 2)', 'list.push' is undefined)
```

**Fix**

```js
const prices = [3, 8];
const doubled = prices.«map((price) => price * 2)»;

console.log(doubled.join(","));
```

`push` returned the new length, `1`, so `list` was a number at the next item. Building an array item by item is the job of `map`.

<!-- task -->

## Remember

- The callback gets the accumulator and the next item, and returns the next accumulator.
- Always pass a start value. Without one, the first item is the start, and an empty array throws a `TypeError`.
- To build an object, change the accumulator and return it. Make the start object inside the call.
- Use `filter` and `map` to build arrays, and a loop to stop early.
