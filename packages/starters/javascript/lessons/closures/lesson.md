# Closures

## A function remembers

**Code**

```js
function makeGreeter(greeting) {
  return function (name) {
    return `${greeting}, ${name}!`;
  };
}

const hello = makeGreeter("Hello");

console.log(hello("Ada"));
console.log(hello("Lin"));
```

**Output**

```text
Hello, Ada!
Hello, Lin!
```

**Rule:** A function keeps access to the variables of the scope where it was created, even after that scope has finished. The function together with those variables is a **closure**.

`makeGreeter("Hello")` has already returned when `hello` runs. Its `greeting` is still there, because the returned function uses it.

`greeting` is a parameter. A parameter is a variable of the function's scope, so a closure keeps it too.

<!-- task -->

## The variable lives on

**Code**

```js
function makeTicketMachine() {
  let last = 0;

  return function () {
    last += 1;
    return last;
  };
}

const nextTicket = makeTicketMachine();

console.log(nextTicket());
console.log(nextTicket());
console.log(nextTicket());
```

**Output**

```text
1
2
3
```

**Rule:** A closure can change its variables, not only read them. The variable lives on between calls, for as long as the function does.

**Common mistake:** declaring the variable inside the returned function.

**Wrong**

```js
function makeTicketMachine() {
  return function () {
    «let last = 0;»
    last += 1;
    return last;
  };
}

const nextTicket = makeTicketMachine();

console.log(nextTicket());
console.log(nextTicket());
```

**Output**

```text
1
1
```

**Fix**

```js
function makeTicketMachine() {
  «let last = 0;»

  return function () {
    last += 1;
    return last;
  };
}

const nextTicket = makeTicketMachine();

console.log(nextTicket());
console.log(nextTicket());
```

Each call of a function makes its own variables from scratch. Only a variable of the scope around the function lasts from one call to the next.

<!-- task -->

## Called from anywhere

**Code**

```js
function makeLabeller() {
  const unit = "kg";

  return (amount) => `${amount} ${unit}`;
}

function printAll(amounts, format) {
  const unit = "litres";

  for (const amount of amounts) {
    console.log(format(amount));
  }
}

printAll([2, 5], makeLabeller());
```

**Output**

```text
2 kg
5 kg
```

**Rule:** A closure uses the variables of the place where it was created. The place where it is called does not matter, even when that place has a variable with the same name.

`scores.filter((score) => score > pass)` hands a closure to `filter`. The arrow function reads `pass` from the scope where it was written.

<!-- task -->

## Remember

- A closure is a function together with the variables of the scope where it was created.
- Those variables stay alive after that scope has finished, for as long as the function does.
- A closure can change its variables, and the change lasts between calls.
- Where the function is called from does not matter.
