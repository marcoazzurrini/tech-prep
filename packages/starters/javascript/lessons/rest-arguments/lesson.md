# Rest Parameters and arguments

## Rest collects the remainder

**Code**

```js
function order(table, ...dishes) {
  console.log(table, dishes);
}

order(4, "soup", "rice", "tea");
order(7, "tea");
order(2);
```

**Output**

```text
4 [ "soup", "rice", "tea" ]
7 [ "tea" ]
2 []
```

**Rule:** `...dishes` is a **rest parameter**. It collects every argument that is left after the named parameters, in a real array. When nothing is left, it is an empty array, never `undefined`.

`function log(...parts) {}` collects every argument of the call.

`order(4, ...list)` is spread: it expands an array into arguments. A rest parameter does the opposite.

**Common mistake:** a parameter after the rest parameter.

**Wrong**

```js
const order = («...dishes, table») => `Table ${table}: ${dishes.join(", ")}`;

console.log(order("soup", "rice", 4));
```

**Error**

```text
SyntaxError: Unexpected "," after rest pattern
```

**Fix**

```js
const order = («table, ...dishes») => `Table ${table}: ${dishes.join(", ")}`;

console.log(order(«4, "soup", "rice"»));
```

A rest parameter takes everything that is left, so it must come last, and there can be only one. Chrome and Node say `Rest parameter must be last formal parameter`.

<!-- task -->

## The arguments object

**Code**

```js
function report(status, code) {
  console.log(arguments.length);
  console.log(arguments[0], arguments[2]);
  console.log(Array.isArray(arguments));
  console.log(Array.from(arguments).join(" "));
}

report("ok", 200, "fast");
```

**Output**

```text
3
ok fast
false
ok 200 fast
```

**Rule:** Inside a function written with `function`, `arguments` holds every argument of the call, named or not. It is **array-like**: it has indexes and a `length`, but it is not an array. It has no `map`, `filter` or `join`.

`Array.from(arguments)` and `[...arguments]` give a real array.

`arguments` is the old way to read extra arguments. New code uses a rest parameter.

**Common mistake:** calling an array method on `arguments`.

**Wrong**

```js
function shout() {
  return «arguments».map((word) => word.toUpperCase());
}

console.log(shout("hey", "you"));
```

**Error**

```text
TypeError: arguments.map is not a function. (In 'arguments.map((word) => word.toUpperCase())', 'arguments.map' is undefined)
```

**Fix**

```js
function shout(«...words») {
  return «words».map((word) => word.toUpperCase());
}

console.log(shout("hey", "you"));
```

`arguments` looks like an array, but `map` lives on real arrays only. A rest parameter is a real array from the start.

<!-- task -->

## Not in arrow functions

**Code**

```js
function outer() {
  const inner = () => arguments[0];

  return inner("for inner");
}

const count = (...args) => args.length;

console.log(outer("for outer"));
console.log(count(1, 2, 3));
```

**Output**

```text
for outer
3
```

**Rule:** An arrow function has no `arguments` of its own. Inside it, the name is looked up outside, like any other variable. So `inner` reads the `arguments` of `outer`. A rest parameter works in every form of function.

**Common mistake:** reading `arguments` in an arrow function.

**Wrong**

```js
const highest = () => Math.max(...«arguments»);

console.log(highest(3, 9, 4));
```

**Error**

```text
ReferenceError: arguments is not defined
```

**Fix**

```js
const highest = («...numbers») => Math.max(...«numbers»);

console.log(highest(3, 9, 4));
```

No `function` surrounds this arrow function, so the name `arguments` leads nowhere. Give the arrow function a rest parameter.

<!-- task -->

## What the call passed

**Code**

```js
function rename(name, title = "Dr") {
  name = "Ben";

  console.log(name, title);
  console.log(arguments[0], arguments[1]);
  console.log(arguments.length);
}

rename("Ada");
```

**Output**

```text
Ben Dr
Ada undefined
1
```

**Rule:** `arguments` records what the call passed, and nothing else. A default value is not in it. Reassigning a parameter does not change it.

`arguments.length` counts the arguments that were passed. It tells `f()` from `f(undefined)`: `0` and `1`.

Old code outside strict mode is different. When every parameter is a plain name, `arguments[0]` and the first parameter are linked: changing one changes the other. Modules are always strict, so they have no link.

<!-- task -->

## Remember

- `...rest` collects the arguments that are left in a real array. It comes last, and it may be empty.
- `arguments` holds every argument of the call. It is array-like, not an array.
- An arrow function has no `arguments`. It reads the one of the `function` around it.
- `arguments` keeps what was passed: no defaults, and no link to the parameters.
