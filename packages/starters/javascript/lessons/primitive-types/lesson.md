# The Seven Primitive Types

## typeof names the type

**Code**

```js
console.log(typeof 42);
console.log(typeof "42");
console.log(typeof true);
console.log(typeof undefined);
```

**Output**

```text
number
string
boolean
undefined
```

```steps
typeof 42 => "number"
typeof «"42"» => "string"
typeof 10n => "bigint"
typeof Symbol("id") => "symbol"
```

**Rule:** `typeof value` gives the name of the value's type, as a string.

`typeof "42"` gives `"string"`. The quotes decide the type, not what is inside them.

<!-- task -->

## Two surprises

**Code**

```js
console.log(typeof null);
console.log(typeof [1, 2]);
console.log(typeof function () {});
```

**Output**

```text
object
object
function
```

**Rule:** `typeof null` is `"object"`, and so is `typeof` of an array. A function gives `"function"`.

`typeof null` is an old bug that can never be fixed. `null` is a primitive.

**Common mistake:** testing for an object with `typeof` alone.

**Wrong**

```js
const user = null;

if (typeof user === "object") {
  console.log(user.name);
}
```

**Error**

```text
TypeError: null is not an object (evaluating 'null.name')
```

**Fix**

```js
const user = null;

if (user «!== null &&» typeof user === "object") {
  console.log(user.name);
}
```

`null` passed the `typeof` test, so the code read a property of `null`. Rule out `null` first.

<!-- task -->

## Seven primitives, and objects

**Code**

```js
const primitives = ["a", 1, 1n, true, undefined, Symbol("s"), null];

for (const value of primitives) {
  console.log(typeof value);
}
```

**Output**

```text
string
number
bigint
boolean
undefined
symbol
object
```

**Rule:** There are seven primitive types: string, number, bigint, boolean, undefined, symbol and null. Every other value is an object.

`Array.isArray([1, 2])` gives `true`. Use it to tell an array from other objects.

`typeof missing` gives `"undefined"` for a name that was never declared. It does not throw.

<!-- task -->

## Remember

- `typeof` gives a string: `"number"`, `"string"`, `"boolean"`, `"undefined"`, `"bigint"`, `"symbol"`, `"object"` or `"function"`.
- `typeof null` is `"object"`. Test for `null` with `=== null`.
- An array is an object. Test for it with `Array.isArray`.
- Seven types are primitive. Everything else is an object.
