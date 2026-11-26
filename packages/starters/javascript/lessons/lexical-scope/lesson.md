# Lexical Scope

## Where it is written

**Code**

```js
const currency = "EUR";

function priceTag(amount) {
  return `${amount} ${currency}`;
}

function checkout() {
  const currency = "USD";

  return priceTag(20);
}

console.log(checkout());
```

**Output**

```text
20 EUR
```

**Rule:** A function looks up a name where the function is **written**, not where it is called. This is **lexical scope**: scope that follows the written code.

`priceTag(20)` is called inside `checkout`, beside a `currency` of `"USD"`. But `priceTag` is not written inside `checkout`, so it never sees that variable.

**Common mistake:** expecting a function to see the variables of its caller.

**Wrong**

```js
function printLine(text) {
  console.log(«indent» + text);
}

function printList(items) {
  const indent = "- ";

  for (const item of items) {
    printLine(item);
  }
}

printList(["tea", "milk"]);
```

**Error**

```text
ReferenceError: indent is not defined
```

**Fix**

```js
function printLine(text«, indent») {
  console.log(indent + text);
}

function printList(items) {
  const indent = "- ";

  for (const item of items) {
    printLine(item«, indent»);
  }
}

printList(["tea", "milk"]);
```

`indent` belongs to `printList`. `printLine` is written outside `printList`, so it cannot see it. Pass the value as an argument.

<!-- task -->

## Outward, scope by scope

**Code**

```js
const shop = "Corner Shop";

function printReceipt(items) {
  const count = items.length;

  function footer() {
    const thanks = "Thank you";

    return `${thanks}: ${count} items at ${shop}`;
  }

  console.log(footer());
}

printReceipt(["tea", "milk"]);
```

**Output**

```text
Thank you: 2 items at Corner Shop
```

**Rule:** A lookup starts in the scope where the name is used. If the name is not declared there, it moves to the scope around it, and so on, out to the top of the file. This path is the **scope chain**.

`thanks` is found in `footer`, `count` in `printReceipt`, and `shop` at the top of the file.

`typeof thanks` gives `"undefined"` inside `printReceipt`, but outside `footer`. A lookup goes outward, never inward.

<!-- task -->

## The nearest one wins

**Code**

```js
let total = 0;

function addOrder(prices) {
  let total = 0;

  function add(price) {
    total += price;
  }

  for (const price of prices) {
    add(price);
  }

  return total;
}

console.log(addOrder([5, 7]));
console.log(total);
```

**Output**

```text
12
0
```

**Rule:** A lookup stops at the first scope that declares the name. The nearer variable **shadows** a farther one with the same name: it hides it. An assignment finds its variable the same way a read does.

`total += price` changes the `total` of `addOrder`. The `total` at the top of the file stays `0`.

`function show(total) {}` shadows too. A parameter is a variable of its function, even when no argument is passed.

**Common mistake:** declaring a variable again when you meant to assign to it.

**Wrong**

```js
let itemCount = 0;

function countItems(items) {
  «let» itemCount = items.length;
}

countItems(["tea", "milk"]);
console.log(itemCount);
```

**Output**

```text
0
```

**Fix**

```js
let itemCount = 0;

function countItems(items) {
  «itemCount» = items.length;
}

countItems(["tea", "milk"]);
console.log(itemCount);
```

With `let`, the function makes a new `itemCount` that shadows the outer one. Without it, the assignment finds the outer variable.

<!-- task -->

## Remember

- A name is looked up where the function is written. Where the function is called from does not matter.
- The lookup moves outward, scope by scope, to the top of the file. That path is the scope chain.
- It stops at the first scope that declares the name. A nearer variable shadows a farther one.
- A function cannot see the variables of its caller. Pass them as arguments.
