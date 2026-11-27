# Array-likes

## What makes an array-like

**Code**

```js
const box = { 0: "pen", 1: "cup", length: 2 };

console.log(box[0], box.length);
console.log(Array.isArray(box));
console.log(typeof box.map);
```

**Output**

```text
pen 2
false
undefined
```

**Rule:** An array-like is an object with a `length` property and numbered keys from `0` up. It is not a real array, so `Array.isArray` returns `false` and it has no array methods.

Inside a regular function, `arguments` is a built-in array-like holding the passed arguments.

**Common mistake:** trying to spread a plain array-like object.

**Wrong**

```js
const box = { 0: "pen", 1: "cup", length: 2 };
const list = «[...box]»;

console.log(list.join(", "));
```

**Error**

```text
TypeError: Spread syntax requires ...iterable[Symbol.iterator] to be a function
```

**Fix**

```js
const box = { 0: "pen", 1: "cup", length: 2 };
const list = «Array.from(box)»;

console.log(list.join(", "));
```

Spread only works on iterable values, and a plain array-like is not iterable. `Array.from` works on array-likes too.

<!-- task -->

## Converting with Array.from

**Code**

```js
const raw = { 0: "a", 2: "c", 3: "d", tag: "x", length: 3 };
const list = Array.from(raw);

console.log(list.length);
console.log(list.map(String).join(", "));
console.log(1 in list);
console.log(JSON.stringify(Array.from({ name: "Ada" })));
```

**Output**

```text
3
a, undefined, c
true
[]
```

**Rule:** `Array.from(obj)` reads `obj.length` and copies keys `0` to `length - 1` into a new array. Missing keys become `undefined`, and keys outside that range or non-numeric keys are ignored.

`Array.from` treats a missing, negative or `NaN` `length` as `0` and returns `[]`.

**Common mistake:** leaving `length` off an object with numbered keys.

**Wrong**

```js
const items = { 0: "pen", 1: "cup" };
const list = Array.from(items);

console.log(JSON.stringify(list));
```

**Output**

```text
[]
```

**Fix**

```js
const items = { 0: "pen", 1: "cup"«, length: 2» };
const list = Array.from(items);

console.log(JSON.stringify(list));
```

Without `length`, `Array.from` reads `undefined`, treats the length as `0`, and returns an empty array. Add `length` so it knows how many slots to read.

<!-- task -->

## Borrowing array methods

**Code**

```js
const bag = { 0: "tea", 1: "milk", length: 2 };

console.log(Array.prototype.join.call(bag, " + "));
Array.prototype.push.call(bag, "honey");
console.log(bag.length, bag[2]);
```

**Output**

```text
tea + milk
3 honey
```

**Rule:** Array methods on `Array.prototype` only read `this.length` and numbered keys, so you can run them on an array-like with `call` or `apply`.

`Array.prototype.push.call(obj, x)` writes `obj[length]` and updates `obj.length`.

**Common mistake:** borrowing `map` when the array-like has missing keys.

**Wrong**

```js
const sparse = { 0: "a", 2: "c", length: 3 };
const filled = «Array.prototype.map.call(sparse, (x) => x ?? "-")»;

console.log(1 in filled, filled.join(", "));
```

**Output**

```text
false a, , c
```

**Fix**

```js
const sparse = { 0: "a", 2: "c", length: 3 };
const filled = «Array.from(sparse, (x) => x ?? "-")»;

console.log(1 in filled, filled.join(", "));
```

Borrowed `map` skips missing keys and leaves holes in the result. `Array.from` visits every index up to `length`, passing `undefined` for missing keys.

<!-- task -->

## Remember

- An array-like has numbered keys and a `length`, but no array methods and `Array.isArray` is `false`.
- Spread fails on a plain array-like; convert it with `Array.from(obj)`.
- `Array.from` reads keys `0` to `length - 1`, turns missing keys into `undefined`, and ignores extra keys.
- `Array.prototype` methods work on array-likes via `call` or `apply`, and iterative methods skip missing keys.
