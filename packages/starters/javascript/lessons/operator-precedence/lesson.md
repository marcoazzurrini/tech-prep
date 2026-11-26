# Precedence and Associativity

## Unary operators bind tighter

**Code**

```js
const price = 20;
const qty = 3;

console.log(typeof price + qty);
console.log(typeof (price + qty));
console.log(-price + qty * 2);
console.log(!price > 5);
```

**Output**

```text
number3
number
-14
false
```

```steps
typeof 20 + 3 => «"number"» + 3
-20 + 3 * 2 => «-20» + «6»
!20 > 5 => «false» > 5
```

**Rule:** **Precedence** ranks the operators: the one that binds tighter takes its operands first. A **unary** operator, such as `typeof`, `!` or `-`, takes one operand and binds tighter than maths and comparisons.

`typeof price + qty` means `(typeof price) + qty`. The unary operator takes only the value right beside it.

`*`, `/` and `%` bind tighter than `+` and `-`, as in school maths. Parentheses bind tightest of all.

**Common mistake:** `!` before a comparison.

**Wrong**

```js
const task = { status: "open" };

if (!task.status === "done") {
  console.log("still to do");
} else {
  console.log("finished");
}
```

**Output**

```text
finished
```

**Fix**

```js
const task = { status: "open" };

if («task.status !== "done"») {
  console.log("still to do");
} else {
  console.log("finished");
}
```

`!` took `task.status` alone and gave `false`. Then `false === "done"` is `false`, whatever the status is.

<!-- task -->

## Maths, comparison, then logic

**Code**

```js
const cart = { total: 45, member: false, coupon: true };

console.log(cart.total + 10 > 50 && cart.member || cart.coupon);
console.log(cart.coupon || cart.member && cart.total > 100);
```

**Output**

```text
true
true
```

```steps
45 + 10 > 50 && false || true => «55» > 50 && false || true
55 > 50 && false || true => «true» && false || true
true && false || true => «false» || true
true || false && 45 > 100 => true || «false»
```

**Rule:** After the unary operators come maths, then `<` and `>`, then `===`, then `&&`, then `||`. The conditional `? :` and assignment bind looser than all of these.

`a || b && c` means `a || (b && c)`. `&&` binds tighter than `||`.

**Common mistake:** `? :` inside text that is joined with `+`.

**Wrong**

```js
const count = 3;

console.log("Items: " + count > 1 ? "many" : "one");
```

**Output**

```text
one
```

**Fix**

```js
const count = 3;

console.log("Items: " + «(count > 1 ? "many" : "one")»);
```

`+` binds tighter than `>`, and `? :` binds looser than both. So the test was `"Items: 3" > 1`, which is `false`. The label was lost as well. Parentheses keep the `? :` together.

<!-- task -->

## Associativity

**Code**

```js
console.log(10 - 4 - 3);
console.log(100 / 10 / 2);
console.log(2 ** 3 ** 2);

const age = 15;

console.log(age < 13 ? "child" : age < 20 ? "teen" : "adult");
```

**Output**

```text
3
5
512
teen
```

```steps
10 - 4 - 3 => «(10 - 4)» - 3
100 / 10 / 2 => «(100 / 10)» / 2
2 ** 3 ** 2 => 2 ** «(3 ** 2)»
```

**Rule:** **Associativity** decides the order among operators of the same precedence. Most operators group from the left. `**`, assignment and `? :` group from the right.

`a = b = 5` means `a = (b = 5)`. That is why a chain of assignments runs from the right.

A chain of `? :` groups from the right too. So it reads like `if`, `else if`, `else`.

**Common mistake:** a minus sign before `**`.

**Wrong**

```js
const side = 3;

console.log(-side ** 2);
```

**Error**

```text
SyntaxError: Unexpected **
```

**Fix**

```js
const side = 3;

console.log(«-(side ** 2)»);
```

JavaScript refuses `-side ** 2`, because it could be read in two ways. Say which one you mean: `-(side ** 2)` gives `-9`, and `(-side) ** 2` gives `9`.

<!-- task -->

## Grouping is not order

**Code**

```js
function read(name, value) {
  console.log("read", name);
  return value;
}

const total = read("a", 1) + read("b", 2) * read("c", 3);
console.log(total);

const open = read("x", true) || read("y", false) && read("z", false);
console.log(open);
```

**Output**

```text
read a
read b
read c
7
read x
true
```

**Rule:** Precedence decides how the operands are grouped, not when they run. Operands run left to right, and `||` and `&&` still skip a right side they do not need.

`read("b", 2) * read("c", 3)` is grouped first, but `read("a", 1)` runs first.

`x || y && z` means `x || (y && z)`. Here `x` is truthy, so the whole group on the right is skipped.

<!-- task -->

## Remember

- Unary operators bind tighter than maths. Then come comparisons, `===`, `&&`, `||`, and then `? :` and `=`.
- Operators of the same precedence group from the left. `**`, `=` and `? :` group from the right.
- Precedence groups the operands. They still run left to right.
- When a line needs a second look, add parentheses.
