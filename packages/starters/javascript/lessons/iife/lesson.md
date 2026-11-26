# Immediately Invoked Functions

## Define and call at once

**Code**

```js
const total = (function () {
  const prices = [4, 6, 10];
  let sum = 0;

  for (const price of prices) {
    sum += price;
  }

  return sum;
})();

console.log(total);
console.log(typeof sum);
```

**Output**

```text
20
undefined
```

```steps
(function () { return 5; })«()» => 5
(function (n) { return n * 2; })«(21)» => 42
```

**Rule:** `(function () { ... })()` makes a function and calls it at once. It is called an **IIFE**: an immediately invoked function expression.

`typeof sum` gives `"undefined"` outside. The variables of an IIFE stay inside it, and only its return value comes out.

`(() => { ... })()` is an IIFE made with an arrow function. It works the same way.

<!-- task -->

## Why the parentheses

**Code**

```js
(function () {
  console.log("parentheses");
})();

void function () {
  console.log("void");
}();

const answer = function () {
  return 42;
}();

console.log(answer);
```

**Output**

```text
parentheses
void
42
```

**Rule:** A statement that starts with `function` is a declaration, and it cannot be called on the spot. Inside an expression the call works: use parentheses, `void`, or an `=` before the function.

`;(function () { ... })()` starts with a semicolon on purpose. If the line before has none, the `(` would call that line's value.

**Common mistake:** leaving the parentheses out.

**Wrong**

```js
function setUp() {
  console.log("ready");
}«()»;
```

**Error**

```text
SyntaxError: Expected "=>" but found ";"
```

**Fix**

```js
«(»function setUp() {
  console.log("ready");
}«)»();
```

The declaration ends at `}`. The `()` after it is a separate, empty pair of parentheses, and that is not valid code. Chrome and Node say `Unexpected token ')'`.

<!-- task -->

## A scope per round

**Code**

```js
const readers = [];

for (var i = 0; i < 3; i++) {
  (function (round) {
    readers.push(() => round);
  })(i);
}

console.log(readers[0]());
console.log(readers[1]());
console.log(readers[2]());
```

**Output**

```text
0
1
2
```

**Rule:** An IIFE with a parameter copies a value into a new variable. In a `var` loop, that gives each closure a variable of its own.

`(function (round) { ... })(i)` was the usual fix before `let` existed.

**Common mistake:** an IIFE with no parameter.

**Wrong**

```js
const readers = [];

for (var i = 0; i < 3; i++) {
  (function () {
    readers.push(() => «i»);
  })();
}

console.log(readers[0]());
console.log(readers[2]());
```

**Output**

```text
3
3
```

**Fix**

```js
const readers = [];

for (var i = 0; i < 3; i++) {
  (function («round») {
    readers.push(() => round);
  })(i);
}

console.log(readers[0]());
console.log(readers[2]());
```

**Output**

```text
0
2
```

The IIFE made a new scope, but nothing was copied into it. The closure still read the one shared `i`.

<!-- task -->

## The module pattern

**Code**

```js
const cart = (function () {
  const items = [];

  function add(name, price) {
    items.push({ name, price });
  }

  function total() {
    let sum = 0;

    for (const item of items) {
      sum += item.price;
    }

    return sum;
  }

  return { add, total };
})();

cart.add("tea", 4);
cart.add("cake", 6);

console.log(cart.total());
console.log(cart.items);
```

**Output**

```text
10
undefined
```

**Rule:** The **module pattern** is an IIFE that returns an object. The object is public, and everything else stays private.

`return { add, total }` decides what is public. `items` is not in it, so `cart.items` gives `undefined`.

`cart` exists exactly once, because the function is called once. This is how modules were built before `import`.

<!-- task -->

## Remember

- `(function () { ... })()` defines a function and calls it at once.
- The parentheses make the function an expression. A declaration cannot be called on the spot.
- The variables of an IIFE are private. Its parameters copy values in.
- The module pattern is an IIFE that returns an object of functions.
