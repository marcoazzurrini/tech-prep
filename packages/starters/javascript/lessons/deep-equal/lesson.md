# Deep Equal

## Same keys, same values

**Code**

```js
function deepEqual(a, b) {
  if (Object.is(a, b)) {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}

const shirt = { size: "M", tags: ["red", "sale"] };

console.log(deepEqual(shirt, { size: "M", tags: ["red", "sale"] }));
console.log(deepEqual(shirt, { size: "M", tags: ["red"] }));
console.log(deepEqual({ size: "M" }, { size: "M", qty: 2 }));
console.log(deepEqual(3, "3"));
```

**Output**

```text
true
false
false
false
```

**Rule:** Two values are **deeply equal** when they are the same primitive, or when both are objects with the same keys and deeply equal values under each key. Compare the key counts first, then recurse into each value.

`Object.is(a, b)` is the first test. It is `===`, except that `NaN` matches `NaN` and `0` does not match `-0`.

`Object.is(a, b)` also gives `true` at once for one object compared with itself.

**Common mistake:** checking only the keys of `a`.

**Wrong**

```js
function deepEqual(a, b) {
  if (Object.is(a, b)) {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }

  «return Object.keys(a).every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));»
}

console.log(deepEqual({ size: "M" }, { size: "M", qty: 2 }));
```

**Output**

```text
true
```

**Fix**

```js
function deepEqual(a, b) {
  if (Object.is(a, b)) {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }

  «const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }»
  return keys.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}

console.log(deepEqual({ size: "M" }, { size: "M", qty: 2 }));
```

Every key of `a` was found in `b`, so the loop said yes. It never looked at `qty`. Equal counts, with every key of `a` in `b`, mean the two sets of keys are the same.

<!-- task -->

## Arrays are not objects

**Code**

```js
function deepEqual(a, b) {
  if (Object.is(a, b)) {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}

console.log(deepEqual(["tea", "jam"], { 0: "tea", 1: "jam" }));
console.log(deepEqual([], {}));
console.log(deepEqual(["tea"], ["tea"]));
console.log(deepEqual({ note: undefined }, { memo: undefined }));
```

**Output**

```text
false
false
true
false
```

**Rule:** An array and a plain object can have the same keys and values. Check that both are arrays or both are not, before you compare keys.

`Object.keys(["tea", "jam"])` gives `["0", "1"]`. It skips `length`, so the keys alone cannot tell an array from an object.

`{ note: undefined }` and `{ memo: undefined }` have one key each, and both read `undefined` under `note`. `Object.hasOwn(b, key)` tells them apart.

**Common mistake:** leaving out the array check.

**Wrong**

```js
function deepEqual(a, b) {
  if (Object.is(a, b)) {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}

console.log(deepEqual(«[]», «{}»));
```

**Output**

```text
true
```

**Fix**

```js
function deepEqual(a, b) {
  if (Object.is(a, b)) {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  «if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }»

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}

console.log(deepEqual([], {}));
```

Both values have no keys, so the key test passed. The array check catches the different kind first.

<!-- task -->

## NaN, zero and cycles

**Code**

```js
function deepEqual(a, b) {
  if (Object.is(a, b)) {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}

const reading = { temp: NaN, wind: [0] };

console.log(deepEqual(reading, { temp: NaN, wind: [0] }));
console.log(deepEqual([0], [-0]));
console.log(deepEqual(0, 0));
```

**Output**

```text
true
false
true
```

**Rule:** Compare primitives with `Object.is`, not `===`. Then a `NaN` in one value matches a `NaN` in the other, so two copies of the same data are equal. The price is that `0` and `-0` differ.

`a === b || (Number.isNaN(a) && Number.isNaN(b))` matches `NaN` with `NaN` and `0` with `-0`. Use it when the sign of zero must not count.

A cycle, an object that leads back to itself, makes this function recurse forever. Keep a `WeakMap` from each object of `a` to the object of `b` it was compared with. When the same pair comes again, return `true`.

**Common mistake:** comparing primitives with `===`.

**Wrong**

```js
function deepEqual(a, b) {
  if («a === b») {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}

console.log(deepEqual({ score: NaN }, { score: NaN }));
```

**Output**

```text
false
```

**Fix**

```js
function deepEqual(a, b) {
  if («Object.is(a, b)») {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}

console.log(deepEqual({ score: NaN }, { score: NaN }));
```

`NaN === NaN` is `false`, so two equal records came out as different. `Object.is` treats `NaN` as the same value as `NaN`.

<!-- task -->

## Remember

- Return `true` when `Object.is(a, b)`. Return `false` when either value is not an object, or is `null`.
- An array is never deeply equal to an object that is not an array.
- Same key count, every key of `a` own in `b`, and deeply equal values under each key.
- `Object.is` makes `NaN` match and `0` differ from `-0`. A cycle needs a `WeakMap` of pairs already compared.
