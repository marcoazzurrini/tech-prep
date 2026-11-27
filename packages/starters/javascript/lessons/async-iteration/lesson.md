# Asynchronous Iteration

## Loop with for await

**Code**

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function* arrivals() {
  await delay(20);
  yield "bus";
  await delay(10);
  yield "tram";
}

async function watch() {
  for await (const vehicle of arrivals()) {
    console.log(vehicle + " arrived");
  }
  console.log("station closed");
}

watch();
console.log("watching");
```

**Output**

```text
watching
bus arrived
tram arrived
station closed
```

**Rule:** `async function*` declares an **async generator** function. Its body can use both `await` and `yield`. `for await...of` loops over it: it asks for a value, waits for it, runs the body, then asks for the next one.

Like `await`, `for await` needs an `async` function or the top level of a module. It pauses only that function, so `watching` printed first.

A `break` in a `for await` loop ends the generator early, just as in a `for...of` loop.

**Common mistake:** `for...of` without `await`.

**Wrong**

```js
async function* arrivals() {
  yield "bus";
}

«for» (const vehicle of arrivals()) {
  console.log(vehicle);
}
```

**Error**

```text
TypeError: {} is not iterable
```

**Fix**

```js
async function* arrivals() {
  yield "bus";
}

async function watch() {
  «for await» (const vehicle of arrivals()) {
    console.log(vehicle);
  }
}

watch();
```

**Output**

```text
bus
```

An async generator has no `[Symbol.iterator]()`, so a plain `for...of` cannot read it. Only `for await` can. Chrome and Node say `arrivals is not a function or its return value is not iterable`.

<!-- task -->

## The async protocol

**Code**

```js
const ticker = {
  [Symbol.asyncIterator]() {
    let n = 0;
    return {
      next() {
        n += 1;
        const done = n > 2;
        return Promise.resolve({ value: done ? undefined : "tick " + n, done });
      },
    };
  },
};

async function listen() {
  for await (const tick of ticker) {
    console.log(tick);
  }
}

listen();
```

**Output**

```text
tick 1
tick 2
```

**Rule:** An **async iterable** has a `[Symbol.asyncIterator]()` method. It returns an **async iterator**, whose `next()` returns a promise of `{ value, done }`. `for await` calls the method, then awaits each `next()` until `done` is `true`.

An async generator is an async iterator. Its `next()` returns a promise too.

`async *[Symbol.asyncIterator]() { ... }` is a shorter way to write the method. It is an async generator method.

<!-- task -->

## Page by page

**Code**

```js
const pages = {
  1: { items: ["apple", "bean"], next: 2 },
  2: { items: ["corn"], next: null },
};

const getPage = (n) => new Promise((resolve) => setTimeout(resolve, 10, pages[n]));

async function* allItems() {
  let page = 1;
  while (page !== null) {
    console.log("load page " + page);
    const data = await getPage(page);
    yield* data.items;
    page = data.next;
  }
}

async function findBean() {
  for await (const item of allItems()) {
    console.log(item);
    if (item === "bean") break;
  }
}

findBean();
```

**Output**

```text
load page 1
apple
bean
```

**Rule:** An async generator can hide paging. It loads one page, yields its items one by one, then loads the next page. The loop sees one long list of items.

The generator runs only when the loop asks for a value. After the `break`, nobody asked again, so page 2 was never loaded.

`yield*` in an async generator takes a plain iterable, such as an array, or an async one.

<!-- task -->

## Arrays of promises

**Code**

```js
const delay = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

async function main() {
  const replies = [delay(40, "Ana"), delay(10, "Ben"), "Cy"];

  for await (const name of replies) {
    console.log("reply from " + name);
  }

  const names = await Array.fromAsync(replies);
  console.log(names.join(","));
}

main();
```

**Output**

```text
reply from Ana
reply from Ben
reply from Cy
Ana,Ben,Cy
```

**Rule:** `for await` also takes a plain iterable, such as an array. It awaits each value in turn, so the promises come out in array order, not in the order they finished. `Array.fromAsync(source)` reads the same kinds of source to the end, and gives a promise of an array.

`Array.fromAsync(source, fn)` maps each value, like `Array.from`.

If a later promise in the array rejects while the loop still waits for an earlier one, nothing handles it yet. Bun and Node report an unhandled rejection. For a fixed list of promises, `Promise.all` is safer.

**Common mistake:** `Array.from` on an async generator.

**Wrong**

```js
async function* evens() {
  yield 2;
  yield 4;
}

const list = «Array.from»(evens());
console.log(list.length);
```

**Output**

```text
0
```

**Fix**

```js
async function* evens() {
  yield 2;
  yield 4;
}

«Array.fromAsync»(evens()).then((list) => console.log(list.length));
```

**Output**

```text
2
```

`Array.from` found no `[Symbol.iterator]` and no `length`, so it made an empty array. `Array.fromAsync` reads async iterables.

<!-- task -->

## Remember

- An `async function*` can `await` and `yield`. `for await...of` waits for each value in turn.
- An async iterable has `[Symbol.asyncIterator]()`. Its iterator's `next()` returns a promise of `{ value, done }`.
- An async generator runs only when asked, so it can load pages one at a time and stop early.
- `for await` and `Array.fromAsync` also take arrays of promises, and keep array order.
