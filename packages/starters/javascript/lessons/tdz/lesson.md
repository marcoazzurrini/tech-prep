# The Temporal Dead Zone

## Hoisted, not initialised

**Code**

```js
console.log(stock);

try {
  console.log(price);
} catch (error) {
  console.log(error.name);
}

var stock = 4;
let price = 9;

console.log(stock, price);
```

**Output**

```text
undefined
ReferenceError
4 9
```

**Rule:** `let`, `const` and `class` are hoisted too, but they are not initialised. Using one before its declaration line throws a `ReferenceError`.

From the start of its block until that line runs, the variable is in its **temporal dead zone**. It exists, but it cannot be used. This lesson calls it the **dead zone**.

`price = 10` above the line throws as well. A write is no more allowed than a read.

`new Cart()` above `class Cart {}` throws the same error. A class has a dead zone too.

<!-- task -->

## Time, not position

**Code**

```js
function printTotal() {
  console.log(total);
}

try {
  printTotal();
} catch (error) {
  console.log(error.name);
}

const total = 30;

printTotal();
```

**Output**

```text
ReferenceError
30
```

**Rule:** The dead zone is a stretch of time, not a part of the file. It ends when the declaration line runs. Code written above that line is fine, as long as it runs after it.

`let total;` ends the dead zone too. It initialises `total` to `undefined`.

**Common mistake:** calling a hoisted function before its `const` is ready.

**Wrong**

```js
«start();»

const settings = { retries: 3 };

function start() {
  console.log(settings.retries);
}
```

**Error**

```text
ReferenceError: Cannot access 'settings' before initialization.
```

**Fix**

```js
const settings = { retries: 3 };

«start();»

function start() {
  console.log(settings.retries);
}
```

A function declaration is hoisted with its body, so `start()` can run on the first line. The `const` it reads is still in its dead zone then. Call the function after the `const`.

<!-- task -->

## The whole block

**Code**

```js
const discount = 10;

function finalPrice(price) {
  if (price > 100) {
    try {
      console.log(discount);
    } catch (error) {
      console.log(error.name);
    }

    const discount = 20;
    return price - discount;
  }

  return price - discount;
}

console.log(finalPrice(150));
console.log(finalPrice(50));
```

**Output**

```text
ReferenceError
130
40
```

**Rule:** A declaration takes its name for the whole block, from the first line of the block. Above the declaration line, the name does not mean the outer variable. It means the inner one, in its dead zone.

`console.log(discount)` would print `10` if `const` were not hoisted. The error proves that it is.

**Common mistake:** giving a new variable the name of the outer one it is made from.

**Wrong**

```js
function restock(count) {
  if (count < 5) {
    let count = «count» + 10;
    return count;
  }

  return count;
}

console.log(restock(2));
```

**Error**

```text
ReferenceError: Cannot access 'count' before initialization.
```

**Fix**

```js
function restock(count) {
  if (count < 5) {
    let «refilled» = count + 10;
    return «refilled»;
  }

  return count;
}

console.log(restock(2));
```

The `count` on the right is the new `count`, and it is not initialised yet. Give the new variable another name.

<!-- task -->

## typeof and parameters

**Code**

```js
console.log(typeof neverDeclared);

try {
  console.log(typeof limit);
} catch (error) {
  console.log(error.name);
}

let limit = 3;

console.log(typeof limit);
```

**Output**

```text
undefined
ReferenceError
number
```

**Rule:** `typeof` is safe on a name that was never declared: it gives `"undefined"`. It is not safe on a name in its dead zone: it throws, like any other read.

`function crate(width = depth, depth = 2) {}` throws when `width` is missing. Parameters are initialised from left to right, so `depth` is still in its dead zone.

`function crate(width, depth = width) {}` is fine. A default value may read a parameter on its left.

<!-- task -->

## Remember

- `let`, `const` and `class` are hoisted, but not initialised. Using one before its line throws a `ReferenceError`.
- The dead zone ends when the declaration line runs. What counts is when code runs, not where it is written.
- A declaration takes its name from the start of its block, so `let count = count + 1` throws.
- `typeof` throws in the dead zone. A default value can only read the parameters on its left.
