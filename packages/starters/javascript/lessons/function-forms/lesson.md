# Three Ways to Write a Function

## Three forms, one value

**Code**

```js
function double(n) {
  return n * 2;
}

const triple = function (n) {
  return n * 3;
};

const half = (n) => n / 2;

console.log(double(4), triple(4), half(4));
console.log(typeof double, typeof triple, typeof half);
```

**Output**

```text
8 12 2
function function function
```

**Rule:** A function can be written as a **declaration**, a **function expression** or an **arrow function**. Each one makes a value of type `"function"`. You can store that value, pass it and call it.

`function double(n) {}` on a line of its own is a declaration. It is hoisted, so it can be called above its line.

`function (n) {}` and `(n) => n / 2` are expressions. They follow the rules of the variable that holds them.

**Common mistake:** storing the result of a call, not the function.

**Wrong**

```js
function sayHi() {
  return "hi";
}

const task = «sayHi()»;

console.log(task());
```

**Error**

```text
TypeError: task is not a function. (In 'task()', 'task' is "hi")
```

**Fix**

```js
function sayHi() {
  return "hi";
}

const task = «sayHi»;

console.log(task());
```

`sayHi()` calls the function and gives its result. `sayHi` with no parentheses is the function itself.

<!-- task -->

## No return gives undefined

**Code**

```js
function greet(name) {
  console.log(`Hello, ${name}`);
}

function checkAge(age) {
  if (age < 18) {
    return;
  }

  return "welcome";
}

console.log(greet("Ada"));
console.log(checkAge(12));
console.log(checkAge(30));
```

**Output**

```text
Hello, Ada
undefined
undefined
welcome
```

**Rule:** Every call gives a value. A function that ends with no `return`, or that runs a bare `return;`, gives `undefined`.

This holds for all three forms.

**Common mistake:** working out a value and not returning it.

**Wrong**

```js
function addTax(price) {
  const total = price * 1.2;
}

console.log(addTax(50) + 10);
```

**Output**

```text
NaN
```

**Fix**

```js
function addTax(price) {
  const total = price * 1.2;

  «return total;»
}

console.log(addTax(50) + 10);
```

Nothing fails. The call gives `undefined`, and `undefined + 10` is `NaN`. The mistake shows up far from the function.

<!-- task -->

## A named function expression

**Code**

```js
const greet = function hello(name) {
  console.log(typeof hello);

  return `Hello, ${name}`;
};

console.log(greet("Ada"));
console.log(typeof greet);
console.log(typeof hello);
```

**Output**

```text
function
Hello, Ada
function
undefined
```

**Rule:** A function expression may have a name of its own. That name exists only inside the function. Outside, only the variable exists.

`hello` lets the function refer to itself, even if `greet` is given another value later.

`hello = 1` inside the function throws a `TypeError`. The name cannot be reassigned.

**Common mistake:** calling the function by its inner name.

**Wrong**

```js
const greet = function hello(name) {
  return `Hello, ${name}`;
};

console.log(«hello»("Ada"));
```

**Error**

```text
ReferenceError: hello is not defined
```

**Fix**

```js
const greet = function hello(name) {
  return `Hello, ${name}`;
};

console.log(«greet»("Ada"));
```

A declaration puts its name in the scope around it. A named function expression does not.

<!-- task -->

## Remember

- Declaration, function expression, arrow function: each makes a function value.
- Only a declaration is hoisted with its body.
- No `return`, or a bare `return;`, gives `undefined`.
- The name of a named function expression exists only inside it.
