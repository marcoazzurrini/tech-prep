# Hoisting of var

## Declared from the top

**Code**

```js
function greet() {
  console.log(name);

  var name = "Ada";
  console.log(name);
}

greet();
```

**Output**

```text
undefined
Ada
```

**Rule:** Before a function runs, JavaScript moves each of its `var` declarations to the top of the function. This is **hoisting**. The assignment stays on its line, so the variable holds `undefined` until that line runs.

`var name = "Ada"` works as two steps: `var name` at the top of the function, and `name = "Ada"` where you wrote it.

`let name` is different: reading it above its line throws an error.

**Common mistake:** reading a `var` above the line that gives it a value.

**Wrong**

```js
function priceWithTax(price) {
  var total = price + «tax»;
  var tax = 2;

  return total;
}

console.log(priceWithTax(10));
```

**Output**

```text
NaN
```

**Fix**

```js
function priceWithTax(price) {
  «var tax = 2;»
  var total = price + tax;

  return total;
}

console.log(priceWithTax(10));
```

**Output**

```text
12
```

`tax` existed on the first line, but it held `undefined`. `10 + undefined` is `NaN`, and no error warns you. Assign before you read.

<!-- task -->

## Blocks that never run

**Code**

```js
function status(paid) {
  if (paid) {
    var label = "paid";
  }

  return label;
}

console.log(status(true));
console.log(status(false));
```

**Output**

```text
paid
undefined
```

**Rule:** Hoisting does not depend on which lines run. A `var` inside a block that is skipped still declares the variable for the whole function. Only the assignment is skipped.

`status(false)` gives `undefined`, not a `ReferenceError`. The name exists, and it has no value yet.

A `var` below a `return` is hoisted too. Its assignment never runs.

<!-- task -->

## Hiding an outer variable

**Code**

```js
var theme = "light";

function show() {
  console.log(theme);

  var theme = "dark";
  console.log(theme);
}

show();
console.log(theme);
```

**Output**

```text
undefined
dark
light
```

**Rule:** A `var` anywhere in a function makes that name local to the whole function. An outer variable of the same name is hidden from the first line of the function, not from the `var` line.

**Common mistake:** a `var` in a branch that hides an outer variable.

**Wrong**

```js
const discount = 10;

function price(amount, member) {
  if (!member) {
    «var discount = 0;»
  }

  return amount - discount;
}

console.log(price(100, false));
console.log(price(100, true));
```

**Output**

```text
100
NaN
```

**Fix**

```js
const discount = 10;

function price(amount, member) {
  «const applied = member ? discount : 0;»

  return amount - applied;
}

console.log(price(100, false));
console.log(price(100, true));
```

**Output**

```text
100
90
```

The `var` made `discount` local to all of `price`. For a member the block was skipped, so `discount` held `undefined`. Give the local value a name of its own.

<!-- task -->

## Remember

- A `var` declaration is hoisted to the top of its function. The assignment stays where it is.
- Before its assignment, a `var` holds `undefined`. Reading it is not an error.
- A `var` in a block that never runs, or below a `return`, still declares the variable.
- A `var` hides an outer variable of the same name in the whole function.
