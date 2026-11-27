# Detecting a Type

## Choosing the right tool

**Code**

```js
console.log(typeof 42, typeof null, typeof (() => {}));
console.log(Array.isArray([1, 2]), Array.isArray({ length: 2 }));
console.log(new Date() instanceof Date, /a/ instanceof RegExp);
```

**Output**

```text
number object function
true false
true true
```

**Rule:** Use `typeof` for primitives and functions, `Array.isArray` for arrays, and `instanceof` to check a prototype chain.

`typeof null` is `"object"`, so always rule out `null` when testing for objects.

`Array.isArray` works even when an array comes from another realm, where `instanceof Array` can fail.

**Common mistake:** testing for an object with `instanceof Object`.

**Wrong**

```js
function isObject(value) {
  return value «instanceof Object»;
}

console.log(isObject({}));
console.log(isObject(Object.create(null)));
```

**Output**

```text
true
false
```

**Fix**

```js
function isObject(value) {
  return «value !== null && typeof value === "object"»;
}

console.log(isObject({}));
console.log(isObject(Object.create(null)));
```

`Object.create(null)` has no prototype, so `instanceof Object` returns `false`. Checking `value !== null && typeof value === "object"` handles bare objects too.

<!-- task -->

## Object.prototype.toString

**Code**

```js
const toTag = (v) => Object.prototype.toString.call(v);

console.log(toTag(null));
console.log(toTag([1, 2]));
console.log(toTag(new Date()));
console.log(toTag(/a/));
console.log(toTag(new Map()));
```

**Output**

```text
[object Null]
[object Array]
[object Date]
[object RegExp]
[object Map]
```

**Rule:** `Object.prototype.toString.call(value)` returns `"[object Type]"` for every built-in type, including `null`, `undefined`, arrays, dates and maps.

`Object.prototype.toString.call(value).slice(8, -1)` gives just the type name, such as `"Date"` or `"Null"`.

**Common mistake:** calling `value.toString()` directly instead of borrowing `Object.prototype.toString`.

**Wrong**

```js
console.log(«[1, 2].toString()»);
```

**Output**

```text
1,2
```

**Fix**

```js
console.log(«Object.prototype.toString.call([1, 2])»);
```

Built-in types like `Array` and `Date` override `toString` with their own versions, and `null` has no `toString` at all. Borrow `Object.prototype.toString` with `.call` to get the type tag.

<!-- task -->

## Tags and plain objects

**Code**

```js
const fake = { [Symbol.toStringTag]: "Array" };

console.log(Object.prototype.toString.call(fake));
console.log(Array.isArray(fake));

function isPlain(v) {
  if (v === null || typeof v !== "object") return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

console.log(isPlain({}), isPlain(Object.create(null)), isPlain([]), isPlain(new Date()));
```

**Output**

```text
[object Array]
false
true true false false
```

**Rule:** `Symbol.toStringTag` customises what `Object.prototype.toString.call` returns. To detect a plain object, check that its prototype is `Object.prototype` or `null`.

An object with `[Symbol.toStringTag]: "Array"` can spoof `Object.prototype.toString`, but `Array.isArray` still sees that it is not an array.

**Common mistake:** checking for arrays with `Object.prototype.toString.call`.

**Wrong**

```js
const fake = { [Symbol.toStringTag]: "Array" };

console.log(«Object.prototype.toString.call(fake) === "[object Array]"»);
```

**Output**

```text
true
```

**Fix**

```js
const fake = { [Symbol.toStringTag]: "Array" };

console.log(«Array.isArray(fake)»);
```

`Symbol.toStringTag` can fake the tag string on any object. Always use `Array.isArray` to test for arrays.

<!-- task -->

## Remember

- Use `typeof` for primitives (except `null`), `Array.isArray` for arrays, and `instanceof` for prototype chains.
- `Object.prototype.toString.call(x)` returns `"[object Type]"` for any value, including `null` and `undefined`.
- `Symbol.toStringTag` can customise the tag returned by `Object.prototype.toString.call`, so prefer `Array.isArray` for arrays.
- A plain object is a non-null object whose prototype is `Object.prototype` or `null`.
