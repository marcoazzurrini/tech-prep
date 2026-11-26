# Block Scope

## A block holds its variables

**Code**

```js
const order = { total: 80 };
let message = "no discount";

if (order.total > 50) {
  const discount = 10;
  message = "discount of " + discount;
}

console.log(message);
console.log(typeof discount);
```

**Output**

```text
discount of 10
undefined
```

**Rule:** A **block** is the code between `{` and `}`. A `let` or `const` declared in a block exists only inside that block. The part of the code where a name exists is its **scope**.

`typeof discount` gives `"undefined"` after the block. The name does not exist there.

The body of a `switch` is one block. Two of its `case` parts cannot both declare `const label`.

**Common mistake:** using a variable after its block has ended.

**Wrong**

```js
const order = { total: 80 };

if (order.total > 50) {
  const fee = 0;
} else {
  const fee = 5;
}

console.log(«fee»);
```

**Error**

```text
ReferenceError: fee is not defined
```

**Fix**

```js
const order = { total: 80 };
«let fee = 5;»

if (order.total > 50) {
  fee = 0;
}

console.log(fee);
```

Each `fee` ended with its own block. Declare the variable before the block, and assign to it inside.

<!-- task -->

## Inner blocks see out

**Code**

```js
const prices = [4, 12, 30];
const limit = 10;
let expensive = 0;

for (const price of prices) {
  if (price > limit) {
    expensive = expensive + 1;
  }
}

console.log(expensive);
```

**Output**

```text
2
```

**Rule:** Code in a block can read and reassign the variables of every block around it. JavaScript looks for a name in the block itself first, then in the next block out, and so on.

`limit` and `expensive` are declared outside both blocks. The `if` block still reads one and reassigns the other.

The search only goes outward. An outer block never sees the variables of an inner block.

<!-- task -->

## Shadowing

**Code**

```js
const price = 10;

if (price > 5) {
  const price = 99;
  console.log(price);
}

console.log(price);
```

**Output**

```text
99
10
```

**Rule:** An inner block may declare a name that an outer block already uses. This is **shadowing**. Inside the inner block the name means the inner variable. The outer variable is hidden there, and it is not changed.

`let price` twice in one block is a `SyntaxError`. In two blocks it makes two separate variables.

**Common mistake:** writing `let` in the inner block when you meant to reassign.

**Wrong**

```js
const order = { paid: true };
let status = "pending";

if (order.paid) {
  «let» status = "paid";
}

console.log(status);
```

**Output**

```text
pending
```

**Fix**

```js
const order = { paid: true };
let status = "pending";

if (order.paid) {
  status = "paid";
}

console.log(status);
```

**Output**

```text
paid
```

The `let` made a second `status` that ended with the block. Without `let`, the line reassigns the outer one.

<!-- task -->

## New in each round

**Code**

```js
const prices = [5, 8];

for (const price of prices) {
  const doubled = price * 2;
  console.log(doubled);
}

console.log(typeof doubled);
```

**Output**

```text
10
16
undefined
```

**Rule:** A loop body is a block that runs once in each round. Each round makes its variables anew. That is why a `const` works there: it is never reassigned, only made again.

`for (let i = 0; i < 3; i++)` keeps `i` inside the loop. After the loop, `i` does not exist.

**Common mistake:** declaring a running count inside the loop body.

**Wrong**

```js
const words = ["tea", "milk", "rice"];

for (const word of words) {
  «let count = 0;»
  count = count + 1;
  console.log(word, count);
}
```

**Output**

```text
tea 1
milk 1
rice 1
```

**Fix**

```js
const words = ["tea", "milk", "rice"];
«let count = 0;»

for (const word of words) {
  count = count + 1;
  console.log(word, count);
}
```

**Output**

```text
tea 1
milk 2
rice 3
```

Inside the body, `count` started again from `0` in every round. A value that must last across rounds is declared before the loop.

<!-- task -->

## Remember

- A `let` or `const` exists only in the `{ }` block where it is declared.
- An inner block can read and reassign outer variables. An outer block cannot see in.
- Declaring the same name in an inner block shadows the outer variable. It does not change it.
- A loop body makes its variables anew in each round.
