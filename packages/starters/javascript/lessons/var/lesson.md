# var

## var ignores blocks

**Code**

```js
function shipping(total) {
  if (total > 50) {
    var fee = 0;
  } else {
    var fee = 5;
  }

  return fee;
}

console.log(shipping(80));
console.log(shipping(20));
console.log(typeof fee);
```

**Output**

```text
0
5
undefined
```

**Rule:** A `var` variable belongs to the whole function where it is declared. A block does not hold it, so it can be used after the `if` that declared it. This is **function scope**.

`typeof fee` gives `"undefined"` outside `shipping`. A function does hold its `var` variables.

`var` outside every function belongs to the whole file.

<!-- task -->

## The counter survives

**Code**

```js
const names = ["Ada", "Bo", "Cy"];

for (var i = 0; i < names.length; i++) {
  var last = names[i];
}

console.log(i);
console.log(last);
```

**Output**

```text
3
Cy
```

**Rule:** A loop does not hold a `var` either. The counter and every `var` of the body still exist after the loop, with their last values. There is one variable for all the rounds.

`i` ends at `3`, not `2`. The loop stops when `i < 3` is false.

**Common mistake:** two nested loops that use the same `var` counter.

**Wrong**

```js
function countCells(rows, columns) {
  var cells = 0;

  for (var i = 0; i < rows; i++) {
    for («var i» = 0; i < columns; i++) {
      cells++;
    }
  }

  return cells;
}

console.log(countCells(3, 2));
```

**Output**

```text
2
```

**Fix**

```js
function countCells(rows, columns) {
  let cells = 0;

  for («let» i = 0; i < rows; i++) {
    for («let» i = 0; i < columns; i++) {
      cells++;
    }
  }

  return cells;
}

console.log(countCells(3, 2));
```

**Output**

```text
6
```

Both loops used one `i`. The inner loop left it at `2`, so the outer loop ended after one round. With `let`, each loop has its own `i`.

<!-- task -->

## Declared twice, no error

**Code**

```js
var user = "Ada";
var user = "Bo";
console.log(user);

var user;
console.log(user);
```

**Output**

```text
Bo
Bo
```

**Rule:** `var` can declare a name that already exists in the same function. There is no error, and no second variable. A second `var` with a value is a plain assignment. A second `var` with no value does nothing.

`let user = "Ada"; let user = "Bo";` is a `SyntaxError`. `var` gives no such warning.

**Common mistake:** reusing a name inside a block, as if the block kept it apart.

**Wrong**

```js
function receipt(prices) {
  var label = "Total";
  var sum = 0;

  for (const price of prices) {
    «var» label = "Item";
    console.log(label, price);
    sum += price;
  }

  console.log(label, sum);
}

receipt([5, 7]);
```

**Output**

```text
Item 5
Item 7
Item 12
```

**Fix**

```js
function receipt(prices) {
  var label = "Total";
  var sum = 0;

  for (const price of prices) {
    «const» label = "Item";
    console.log(label, price);
    sum += price;
  }

  console.log(label, sum);
}

receipt([5, 7]);
```

**Output**

```text
Item 5
Item 7
Total 12
```

The `var` in the loop named the same variable as the outer `label`, and overwrote it. A `const` in the block shadows the outer variable instead.

<!-- task -->

## Remember

- `var` has function scope: it belongs to the whole function, or to the whole file.
- `if` blocks and loops do not hold a `var`. It is still there after them.
- A loop has one `var` counter for all its rounds, and the counter survives the loop.
- Declaring a `var` twice is silent: the second one is an assignment, or nothing.
