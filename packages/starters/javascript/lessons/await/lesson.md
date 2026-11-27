# await

## await gives the value

**Code**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function orderTotal() {
  const price = await delay(20, 12);
  console.log("price: " + price);

  const shipping = await delay(10, 4);
  console.log("shipping: " + shipping);

  return price + shipping;
}

orderTotal().then((total) => console.log("total: " + total));
```

**Output**

```text
price: 12
shipping: 4
total: 16
```

**Rule:** `await promise` pauses the `async` function until the promise settles. Then it gives the promise's value, and the function carries on from that line.

`await` works only inside an `async` function. In a function without `async`, it is a `SyntaxError`.

A module may also use `await` at its top level, outside any function. The chapter on modules covers it.

**Common mistake:** leaving out `await`.

**Wrong**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function orderTotal() {
  const price = «delay(20, 12)»;
  return price + 4;
}

orderTotal().then((total) => console.log("total: " + total));
```

**Output**

```text
total: [object Promise]4
```

**Fix**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function orderTotal() {
  const price = «await delay(20, 12)»;
  return price + 4;
}

orderTotal().then((total) => console.log("total: " + total));
```

Without `await`, `price` held the promise, not `12`. The `+` turned the promise into text.

<!-- task -->

## Only the function pauses

**Code**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function brew() {
  console.log("brew: start");
  await delay(10, null);
  console.log("brew: done");
}

brew();
console.log("main goes on");
```

**Output**

```text
brew: start
main goes on
brew: done
```

**Rule:** `await` pauses only the `async` function it is in. At the first `await`, the call returns its promise and the caller goes on. The rest of the program keeps running while the function waits.

**Common mistake:** `await` inside a `forEach` callback.

**Wrong**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function packAll(items) {
  «items.forEach(async (item) => {»
    await delay(10, null);
    console.log("packed " + item);
  «});»
  console.log("all packed");
}

packAll(["cup", "plate"]);
```

**Output**

```text
all packed
packed cup
packed plate
```

**Fix**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function packAll(items) {
  «for (const item of items) {»
    await delay(10, null);
    console.log("packed " + item);
  «}»
  console.log("all packed");
}

packAll(["cup", "plate"]);
```

Each callback is an `async` function of its own. Its `await` pauses only the callback, and `forEach` does not wait for the promise it returns. In a `for...of` loop, the `await` is in `packAll` itself, so it pauses `packAll`.

<!-- task -->

## await on a plain value

**Code**

```js
async function tally() {
  console.log("1: before await");
  const n = await 5;
  console.log("3: got " + n);
}

setTimeout(() => console.log("4: timer"), 0);
tally();
console.log("2: after the call");
```

**Output**

```text
1: before await
2: after the call
3: got 5
4: timer
```

**Rule:** `await` on a value that is not a promise gives the value itself. It still pauses the function. The rest of the function runs later, as a microtask: after the current code, and before any timer.

`await` follows a thenable too, an object with a `then` method, just as `Promise.resolve` does.

<!-- task -->

## Remember

- `await promise` pauses the `async` function and gives the value once the promise settles.
- Only that function pauses. The caller and the rest of the program go on.
- `await` in a `forEach` callback does not make the loop wait. Use `for...of`.
- `await` on a plain value still pauses. The code after it runs as a microtask.
