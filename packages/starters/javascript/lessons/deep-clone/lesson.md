# Deep Clone

## Recurse into containers

**Code**

```js
function clone(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(clone);
  }

  const copy = {};
  for (const key of Object.keys(value)) {
    copy[key] = clone(value[key]);
  }
  return copy;
}

const settings = { theme: "dark", panels: [{ id: 1, open: true }], owner: null };
const copy = clone(settings);

copy.panels[0].open = false;

console.log(settings.panels[0].open);
console.log(Array.isArray(copy.panels));
console.log(copy.owner, copy.theme);
```

**Output**

```text
true
true
null dark
```

**Rule:** A **deep clone** copies every level. A primitive is returned as it is. An array becomes a new array, and an object a new object, with each value cloned by the same function.

`clone(() => 1)` returns the same function. `typeof` gives `"function"`, not `"object"`, so the first test returns it as it is.

The recursion stops at a primitive or a function. That is the base case.

**Common mistake:** forgetting that `typeof null` is `"object"`.

**Wrong**

```js
function clone(value) {
  if («typeof value !== "object"») {
    return value;
  }

  const copy = Array.isArray(value) ? [] : {};
  for (const key of Object.keys(value)) {
    copy[key] = clone(value[key]);
  }
  return copy;
}

const profile = { name: "Ada", manager: null };
console.log(clone(profile).manager);
```

**Error**

```text
TypeError: null is not an object (evaluating 'Object.keys(value)')
```

**Fix**

```js
function clone(value) {
  if («value === null ||» typeof value !== "object") {
    return value;
  }

  const copy = Array.isArray(value) ? [] : {};
  for (const key of Object.keys(value)) {
    copy[key] = clone(value[key]);
  }
  return copy;
}

const profile = { name: "Ada", manager: null };
console.log(clone(profile).manager);
```

`null` passed the `typeof` test, so the code asked for the keys of `null`. Return `null` as it is, like any other primitive.

<!-- task -->

## Dates, maps and sets

**Code**

```js
function clone(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  if (value instanceof Map) {
    return new Map([...value].map(([key, item]) => [key, clone(item)]));
  }
  if (value instanceof Set) {
    return new Set([...value].map(clone));
  }
  if (Array.isArray(value)) {
    return value.map(clone);
  }
  const copy = {};
  for (const key of Object.keys(value)) {
    copy[key] = clone(value[key]);
  }
  return copy;
}

const trip = {
  start: new Date(0),
  stops: new Map([["Rome", { nights: 2 }]]),
  tags: new Set(["food"]),
};
const copy = clone(trip);

copy.stops.get("Rome").nights = 5;

console.log(copy.start.getTime(), copy.start === trip.start);
console.log(trip.stops.get("Rome").nights);
console.log(copy.tags.has("food"), copy.tags === trip.tags);
```

**Output**

```text
0 false
2
true false
```

**Rule:** A built-in object keeps its data in hidden slots, not in keys. Test for each type with `instanceof`, and build a new one of the same type. A `Date` gets the same time. A `Map` and a `Set` get their content, cloned.

`Object.keys(new Date(0))` gives `[]`. Treated as a plain object, a date becomes `{}`.

This clone keeps the keys of a map as they are, and clones only the values. So the old key objects still find their entries.

**Common mistake:** treating a date as a plain object.

**Wrong**

```js
function clone(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(clone);
  }
  const copy = {};
  for (const key of Object.keys(value)) {
    copy[key] = clone(value[key]);
  }
  return copy;
}

const invoice = { total: 40, due: new Date(0) };
const copy = clone(invoice);

console.log(copy.due.getTime());
```

**Error**

```text
TypeError: copy.due.getTime is not a function. (In 'copy.due.getTime()', 'copy.due.getTime' is undefined)
```

**Fix**

```js
function clone(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  «if (value instanceof Date) {
    return new Date(value.getTime());
  }»
  if (Array.isArray(value)) {
    return value.map(clone);
  }
  const copy = {};
  for (const key of Object.keys(value)) {
    copy[key] = clone(value[key]);
  }
  return copy;
}

const invoice = { total: 40, due: new Date(0) };
const copy = clone(invoice);

console.log(copy.due.getTime());
```

A date has no keys of its own, so the loop made an empty plain object. Check for `Date` before the general case.

<!-- task -->

## Cycles and a WeakMap

**Code**

```js
function clone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (seen.has(value)) {
    return seen.get(value);
  }

  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);

  for (const key of Object.keys(value)) {
    copy[key] = clone(value[key], seen);
  }
  return copy;
}

const ada = { name: "Ada" };
const team = { lead: ada, members: [ada] };
ada.team = team;

const copy = clone(team);

console.log(copy.lead.team === copy);
console.log(copy.lead === copy.members[0]);
console.log(copy.lead === ada);
```

**Output**

```text
true
true
false
```

**Rule:** A **cycle** is an object that leads back to itself. Keep a `WeakMap` from each original object to its copy. Before you clone an object, look it up: if it is there, return the copy you already made.

Store the copy in the map before you fill it. The cycle is met while the copy is still being filled.

The map also keeps shared objects shared. `ada` is reached twice, and both places get the one copy.

**Common mistake:** storing the copy after the loop.

**Wrong**

```js
function clone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (seen.has(value)) {
    return seen.get(value);
  }

  const copy = Array.isArray(value) ? [] : {};
  for (const key of Object.keys(value)) {
    copy[key] = clone(value[key], seen);
  }
  «seen.set(value, copy);»
  return copy;
}

const folder = { name: "docs", files: [] };
folder.parent = folder;

console.log(clone(folder).parent.name);
```

**Error**

```text
RangeError: Maximum call stack size exceeded.
```

**Fix**

```js
function clone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (seen.has(value)) {
    return seen.get(value);
  }

  const copy = Array.isArray(value) ? [] : {};
  «seen.set(value, copy);»
  for (const key of Object.keys(value)) {
    copy[key] = clone(value[key], seen);
  }
  return copy;
}

const folder = { name: "docs", files: [] };
folder.parent = folder;

console.log(clone(folder).parent.name);
```

`folder.parent` is `folder`, so the loop cloned `folder` again before it was in the map. That never ends. Stored first, the second visit finds the copy.

<!-- task -->

## Keep the prototype

**Code**

```js
class Cart {
  constructor(items) {
    this.items = items;
  }
  count() {
    return this.items.length;
  }
}

function clone(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(clone);
  }
  const copy = Object.create(Object.getPrototypeOf(value));
  for (const key of Reflect.ownKeys(value)) {
    copy[key] = clone(value[key]);
  }
  return copy;
}

const id = Symbol("id");
const cart = new Cart(["pen", "ink"]);
cart[id] = 7;

const copy = clone(cart);

console.log(copy instanceof Cart);
console.log(copy.count());
console.log(copy[id]);
```

**Output**

```text
true
2
7
```

**Rule:** `Object.create(Object.getPrototypeOf(value))` makes an empty object with the same prototype as the original. A class instance then keeps its methods, and `instanceof` still works.

`Reflect.ownKeys(value)` lists symbol keys too. `Object.keys` skips them, so a clone built on it loses them.

`structuredClone` also handles dates, maps, sets and cycles, but it drops the prototype and throws on a function, so write your own when you need either.

**Common mistake:** starting every copy as `{}`.

**Wrong**

```js
class Cart {
  constructor(items) {
    this.items = items;
  }
  count() {
    return this.items.length;
  }
}

function clone(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(clone);
  }
  const copy = «{}»;
  for (const key of Reflect.ownKeys(value)) {
    copy[key] = clone(value[key]);
  }
  return copy;
}

const copy = clone(new Cart(["pen"]));
console.log(copy.count());
```

**Error**

```text
TypeError: copy.count is not a function. (In 'copy.count()', 'copy.count' is undefined)
```

**Fix**

```js
class Cart {
  constructor(items) {
    this.items = items;
  }
  count() {
    return this.items.length;
  }
}

function clone(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(clone);
  }
  const copy = «Object.create(Object.getPrototypeOf(value))»;
  for (const key of Reflect.ownKeys(value)) {
    copy[key] = clone(value[key]);
  }
  return copy;
}

const copy = clone(new Cart(["pen"]));
console.log(copy.count());
```

`count` lives on `Cart.prototype`, not on the instance. A copy that starts as `{}` has `Object.prototype` instead, so the method is gone.

<!-- task -->

## Remember

- Return primitives and functions as they are. Build a new array or object, and clone each value into it.
- Check for `null` first, then `Date`, `Map` and `Set` with `instanceof`, before the general object case.
- Keep a `WeakMap` from original to copy, and store each copy before you fill it. Cycles end, and shared objects stay shared.
- Start an object copy with `Object.create(Object.getPrototypeOf(value))`, and list keys with `Reflect.ownKeys`.
