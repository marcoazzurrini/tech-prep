# The Global Object

## Properties as bare names

**Code**

```js
globalThis.shopName = "Corner Shop";

console.log(shopName);
console.log(globalThis.Math === Math);
console.log(globalThis.parseInt("42px"));
console.log(typeof globalThis.console);
```

**Output**

```text
Corner Shop
true
42
object
```

**Rule:** `globalThis` is the **global object**. Each of its properties can be read as a bare name, everywhere in the program. Built-ins such as `Math`, `parseInt` and `console` are properties of it.

`const Math = 1` inside a function shadows the global `Math` there. The global object is the last stop of the scope chain, after every scope of the file.

`window` in a browser and `global` in Node are older names for the same object. `globalThis` works everywhere.

<!-- task -->

## A module keeps its names

**Code**

```js
var visits = 1;
let user = "Ada";

function greet() {
  return "hi";
}

console.log(globalThis.visits);
console.log(globalThis.user);
console.log(typeof globalThis.greet);

globalThis.visits = 50;

console.log(visits);
```

**Output**

```text
undefined
undefined
undefined
1
```

**Rule:** In a module, a top-level variable or function stays inside the module. It does not become a property of the global object. Nothing is global unless you put it on `globalThis`.

A **module** is a file that can use `import` and `export`. All the code in this course runs as a module.

`var visits = 1` at the top of an old script, a file that is not a module, does make `globalThis.visits`. So does a function declaration. `let`, `const` and `class` never do.

**Common mistake:** looking up a top-level variable by its name on `globalThis`.

**Wrong**

```js
var retries = 3;
var timeout = 500;

function readSetting(name) {
  return «globalThis»[name];
}

console.log(readSetting("retries"));
```

**Output**

```text
undefined
```

**Fix**

```js
const «settings» = { retries: 3, timeout: 500 };

function readSetting(name) {
  return «settings»[name];
}

console.log(readSetting("retries"));
```

In a module, `var retries` is not a property of the global object. Keep values you look up by name in an object of your own.

<!-- task -->

## A name nobody declared

**Code**

```js
console.log(globalThis.discount);
console.log(typeof discount);

try {
  console.log(discount);
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
undefined
undefined
ReferenceError
```

**Rule:** Reading a bare name throws a `ReferenceError` when no scope declares it and the global object does not have it. Reading it as a property, `globalThis.discount`, gives `undefined`, like any missing property.

**Common mistake:** testing for an optional global with its bare name.

**Wrong**

```js
if («tracker») {
  console.log("tracking on");
} else {
  console.log("tracking off");
}
```

**Error**

```text
ReferenceError: tracker is not defined
```

**Fix**

```js
if («globalThis.tracker») {
  console.log("tracking on");
} else {
  console.log("tracking off");
}
```

A bare `tracker` throws when nothing declares it. `globalThis.tracker` only reads a property, so a missing one gives `undefined`.

<!-- task -->

## Remember

- `globalThis` is the global object. Its properties can be read as bare names everywhere.
- Built-ins such as `Math` and `parseInt` live there. It is the last stop of the scope chain.
- In a module, top-level names stay in the module. In an old script, `var` and function declarations become global properties.
- Reading an undeclared bare name throws a `ReferenceError`. `globalThis.name` and `typeof name` do not.
