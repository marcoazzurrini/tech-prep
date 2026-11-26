# Hoisting of Functions

## Hoisted with its body

**Code**

```js
console.log(typeof total);
console.log(total(20, 3));

function total(price, count) {
  return price * count;
}
```

**Output**

```text
function
60
```

**Rule:** A **function declaration** is a statement that starts with the word `function`. It is hoisted with its body, so you can call it above its line.

`var total = 5` hoists only the name, and the value stays on its line. A function declaration is whole before the first line of its scope runs.

A declaration below a `return` is hoisted too. Helpers can sit at the bottom of a function.

**Common mistake:** calling a hoisted function before its data is ready.

**Wrong**

```js
console.log(«priceTag(9)»);

var currency = "£";

function priceTag(amount) {
  return `${currency}${amount}`;
}
```

**Output**

```text
undefined9
```

**Fix**

```js
var currency = "£";

console.log(«priceTag(9)»);

function priceTag(amount) {
  return `${currency}${amount}`;
}
```

**Output**

```text
£9
```

The function was ready on the first line. The variable it reads was not: `currency` got its value one line later. Call the function after its data is set.

<!-- task -->

## Expressions follow their variable

**Code**

```js
console.log(typeof addTax);

try {
  addTax(100);
} catch (error) {
  console.log(error.name);
}

try {
  applyDiscount(100);
} catch (error) {
  console.log(error.name);
}

var addTax = function (price) {
  return price * 1.2;
};

const applyDiscount = (price) => price - 10;

console.log(addTax(100), applyDiscount(100));
```

**Output**

```text
undefined
TypeError
ReferenceError
120 90
```

**Rule:** A function written as a value, such as the right side of `=`, is a **function expression**. Neither it nor an arrow function is hoisted: only the variable is, by the rules of `var`, `let` or `const`.

`addTax(100)` above its `var` line calls `undefined`. That is a `TypeError`, not a `ReferenceError`: the name exists.

`new Cart()` above `class Cart {}` throws a `ReferenceError`, as `let` and `const` do. A class is not hoisted like a function.

**Common mistake:** calling a function expression above its line.

**Wrong**

```js
console.log(«shout»("sale"));

var shout = function (text) {
  return text.toUpperCase() + "!";
};
```

**Error**

```text
TypeError: shout is not a function. (In 'shout("sale")', 'shout' is undefined)
```

**Fix**

```js
console.log(shout("sale"));

«function shout(text)» {
  return text.toUpperCase() + "!";
}
```

`var shout` was hoisted with the value `undefined`. A declaration is hoisted with its body, so the call can stay on top.

<!-- task -->

## Declarations in blocks

**Code**

```js
function describe(member) {
  if (member) {
    console.log(label());

    function label() {
      return "member price";
    }
  }

  console.log(typeof label);
}

describe(true);
```

**Output**

```text
member price
undefined
```

**Rule:** A function declaration inside a block belongs to that block, as a `let` does. It is hoisted to the top of the block, not to the top of the function around it.

Old code that is not in strict mode lets the name leak out of the block. A module is always in strict mode, so this course is too.

**Common mistake:** declaring a function in each branch, then calling it after the `if`.

**Wrong**

```js
function greeting(hour) {
  if (hour < 12) {
    function welcome() {
      return "Good morning";
    }
  } else {
    function welcome() {
      return "Good evening";
    }
  }

  return «welcome()»;
}

console.log(greeting(9));
```

**Error**

```text
ReferenceError: welcome is not defined
```

**Fix**

```js
function greeting(hour) {
  «const welcome» = hour < 12 ? () => "Good morning" : () => "Good evening";

  return welcome();
}

console.log(greeting(9));
```

Each `welcome` lived only inside its own branch. Declare one variable outside the `if`, and give it the function you want.

<!-- task -->

## One name, declared twice

**Code**

```js
function checkout() {
  console.log(typeof fee);

  var fee = 5;

  function fee() {
    return 9;
  }

  console.log(typeof fee);
}

checkout();
```

**Output**

```text
function
number
```

**Rule:** Inside a function, a `var` and a function declaration with the same name are one variable. Hoisting fills it with the function, and the `var` line assigns over it when it runs.

`var fee;` with no value does nothing: `fee` stays the function.

`function fee() {}` written twice in one function is not an error. The last one wins, even for a call above both.

**Common mistake:** naming a result after the function that computes it.

**Wrong**

```js
function quote(price) {
  var tax = tax(price);
  var shipping = 4;

  return price + tax + shipping + «tax»(shipping);

  function tax(amount) {
    return amount * 0.5;
  }
}

console.log(quote(10));
```

**Error**

```text
TypeError: tax is not a function. (In 'tax(shipping)', 'tax' is 5)
```

**Fix**

```js
function quote(price) {
  var «priceTax» = tax(price);
  var shipping = 4;

  return price + «priceTax» + shipping + tax(shipping);

  function tax(amount) {
    return amount * 0.5;
  }
}

console.log(quote(10));
```

The first call worked, because `tax` still held the function. Its result was then stored in `tax`, so the second call found a number.

<!-- task -->

## Remember

- A function declaration is hoisted with its body. You can call it above its line.
- A function expression or an arrow is not hoisted. Above its line, a `var` gives a `TypeError`, and `let`, `const` or `class` a `ReferenceError`.
- A declaration inside a block belongs to that block.
- A `var` and a function declaration with one name share one variable: the function first, then the assignment.
