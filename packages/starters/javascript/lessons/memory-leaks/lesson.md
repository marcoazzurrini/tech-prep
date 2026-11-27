# Memory Leaks

## A growing cache

**Code**

```js
const cache = new Map();

function shippingCost(postcode) {
  if (!cache.has(postcode)) {
    cache.set(postcode, postcode.length * 2);
  }
  return cache.get(postcode);
}

for (let i = 0; i < 5000; i++) {
  shippingCost(`AB${i}`);
}

console.log(shippingCost("AB1"));
console.log(cache.size);
```

**Output**

```text
6
5000
```

**Rule:** A memory leak is memory that is still reachable but never used again. A cache that adds every new key and never removes one is a leak. It grows for as long as the program runs.

`cache` lives at the top of the module, so it stays reachable for the whole run. So does every entry in it, and the collector can free none of them.

**Common mistake:** reaching for a `WeakMap` when the keys are strings.

**Wrong**

```js
const cache = «new WeakMap()»;

function shippingCost(postcode) {
  if (!cache.has(postcode)) {
    cache.set(postcode, postcode.length * 2);
  }
  return cache.get(postcode);
}

for (let i = 0; i < 5000; i++) {
  shippingCost(`AB${i}`);
}
console.log(cache.size);
```

**Error**

```text
TypeError: WeakMap keys must be objects or non-registered symbols
```

**Fix**

```js
const cache = «new Map()»;

function shippingCost(postcode) {
  if (!cache.has(postcode)) {
    «if (cache.size === 100) {
      const [oldest] = cache.keys();
      cache.delete(oldest);
    }»
    cache.set(postcode, postcode.length * 2);
  }
  return cache.get(postcode);
}

for (let i = 0; i < 5000; i++) {
  shippingCost(`AB${i}`);
}
console.log(cache.size);
```

A weak map helps only when the keys are objects. For strings, give the cache a limit. When it is full, delete the oldest key first. `const [oldest] = cache.keys()` takes the first key, which is the oldest because a `Map` keeps insertion order.

<!-- task -->

## Listeners never removed

**Code**

```js
const listeners = new Set();

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function openChart(name) {
  const points = new Array(1000).fill(name);
  return subscribe(() => points.length);
}

const closeA = openChart("sales");
const closeB = openChart("stock");
console.log(listeners.size);

closeA();
closeB();
console.log(listeners.size);
```

**Output**

```text
2
0
```

**Rule:** A listener stays in memory as long as the list it was added to. So does everything its closure uses, such as `points` here. Every subscribe needs a matching unsubscribe when the listening code is done.

`subscribe` returns the function that undoes it. The caller then never has to find the exact listener again.

`setInterval(fn, ms)` works like a listener. The timer keeps `fn`, and all that `fn` uses, alive until `clearInterval` stops it.

**Common mistake:** removing a listener with a new function.

**Wrong**

```js
const listeners = new Set();
const on = (fn) => listeners.add(fn);
const off = (fn) => listeners.delete(fn);

on((price) => console.log(price));
off(«(price) => console.log(price)»);
console.log(listeners.size);
```

**Output**

```text
1
```

**Fix**

```js
const listeners = new Set();
const on = (fn) => listeners.add(fn);
const off = (fn) => listeners.delete(fn);

«const logPrice = (price) => console.log(price);»
on(logPrice);
off(logPrice);
console.log(listeners.size);
```

Two arrow functions with the same code are two different objects. `delete` compares by reference, so it found nothing to remove. Keep the function in a variable and pass that same function to both calls.

<!-- task -->

## Data left behind

**Code**

```js
const uploads = new Map();

function startUpload(name) {
  uploads.set(name, { name, chunks: new Array(1000).fill(0) });
}

function finishUpload(name) {
  uploads.delete(name);
}

startUpload("cat.png");
startUpload("dog.png");
finishUpload("cat.png");

console.log(uploads.size);
console.log([...uploads.keys()].join(","));
```

**Output**

```text
1
dog.png
```

**Rule:** A map or an array at the top of a module lives for the whole run. Data in it stays in memory until you remove it. When something ends, delete it from every collection that holds it.

`() => record.title` keeps all of `record` alive, not only its title. Copy the small value into a variable first, and let the closure use that.

**Common mistake:** marking an item as closed instead of removing it.

**Wrong**

```js
const tabs = [];

function openTab(url) {
  const tab = { url, open: true };
  tabs.push(tab);
  return tab;
}

function closeTab(tab) {
  «tab.open = false;»
}

closeTab(openTab("/home"));
console.log(tabs.filter((t) => t.open).length);
console.log(tabs.length);
```

**Output**

```text
0
1
```

**Fix**

```js
const tabs = [];

function openTab(url) {
  const tab = { url, open: true };
  tabs.push(tab);
  return tab;
}

function closeTab(tab) {
  «tabs.splice(tabs.indexOf(tab), 1);»
}

closeTab(openTab("/home"));
console.log(tabs.filter((t) => t.open).length);
console.log(tabs.length);
```

The flag says the tab is closed, but the array still holds it and all its data. It stays reachable and is never used again. Removing it from the array lets the collector free it.

<!-- task -->

## Remember

- A leak is memory that is still reachable but never used again.
- Give every cache a limit, or key it by objects in a `WeakMap`.
- Every subscribe needs an unsubscribe, and every `setInterval` a `clearInterval`. Remove with the same function you added.
- When something ends, delete it from every collection that holds it. A flag is not enough.
