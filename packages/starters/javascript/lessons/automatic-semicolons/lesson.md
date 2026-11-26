# Automatic Semicolons

## Lines join when possible

**Code**

```js
const double = (n) => n * 2
const price = 21

const result = double
(price)

console.log(result)
```

**Output**

```text
42
```

**Rule:** A line break alone does not end a statement. JavaScript adds the missing semicolon only when the next line cannot continue the statement.

`(price)` can continue `double`, so the two lines are the call `double(price)`. A line that starts with `+`, `-`, `*`, `/` or `.` joins in the same way.

`const price = 21` gets a semicolon, because the `const` on the next line cannot continue it. This is called **automatic semicolon insertion**, or ASI.

**Common mistake:** starting a line with `(` after a line with no semicolon.

**Wrong**

```js
const order = { total: 20, tip: 3, items: ["tea"] }

const sum = order.total + order.tip
(order.items || []).forEach((item) => console.log(item))

console.log(sum)
```

**Error**

```text
TypeError: order.tip is not a function. (In 'order.tip(order.items || [])', 'order.tip' is 3)
```

**Fix**

```js
const order = { total: 20, tip: 3, items: ["tea"] }

const sum = order.total + order.tip«;»
(order.items || []).forEach((item) => console.log(item))

console.log(sum)
```

The `(` on the next line continued the statement, so `order.tip` was called as a function. A semicolon ends the statement before the `(`.

<!-- task -->

## [ and backtick

**Code**

```js
const sizes = ["S", "M", "L"]
const chosen = sizes
[0, 2]

console.log(chosen)

const shout = (parts) => parts[0].toUpperCase()
const sign = shout
`sale`

console.log(sign)
```

**Output**

```text
L
SALE
```

**Rule:** A line that starts with `[` or a backtick joins the line before it too. `[` reads a property of the value before it, and a backtick calls that value as a function.

`sizes[0, 2]` gives `"L"`. Inside the brackets, the comma gives its right side, so the index is `2`.

`shout` gets the parts of the text in an array, so `parts[0]` is `"sale"`.

**Common mistake:** swapping two variables after a line with no semicolon.

**Wrong**

```js
let low = 9
let high = 4
[low, high] = [high, low]

console.log(low, high)
```

**Error**

```text
ReferenceError: Cannot access 'high' before initialization.
```

**Fix**

```js
let low = 9
let high = 4«;»
[low, high] = [high, low]

console.log(low, high)
```

The last two lines joined into `let high = 4[low, high] = [high, low]`. That reads `high` inside its own declaration, before it has a value. In code without semicolons, put one before a line that starts with `(`, `[` or a backtick.

<!-- task -->

## return ends the line

**Code**

```js
function total(a, b) {
  return
    a + b
}

console.log(total(2, 3))
```

**Output**

```text
undefined
```

**Rule:** After `return`, a line break ends the statement, even when the next line could continue it. The semicolon is added right after `return`, so the function returns `undefined`.

`a + b` stays in the function as a statement of its own. It never runs, and no error tells you.

`break` and `continue` follow the same rule. `throw` with a line break right after it is a syntax error.

**Common mistake:** putting the `{` of a returned object on the next line.

**Wrong**

```js
function makeUser(name) {
  return
  {
    name: name
  }
}

console.log(makeUser("Ada"))
```

**Output**

```text
undefined
```

**Fix**

```js
function makeUser(name) {
  return «{»
    name: name
  }
}

console.log(makeUser("Ada"))
```

The function returned at the line break. The lines below it became a block that holds a label, which is valid code, so nothing failed. Start the value on the line of `return`. For a long expression, open a `(` there.

<!-- task -->

## ++ between two lines

**Code**

```js
let done = 1
let left = 5

done
++
left

console.log(done, left)
```

**Output**

```text
1 6
```

**Rule:** A `++` or `--` after a line break never joins the line before it. It goes with what follows, so the three lines mean `done; ++left;`.

`done++` must stand on one line. Keep `++` and `--` beside their variable.

<!-- task -->

## Remember

- A line break ends a statement only when the next line cannot continue it.
- A line that starts with `(`, `[` or a backtick joins the line before it. End that line with `;`.
- After `return`, a line break ends the statement: the function returns `undefined`.
- A `++` or `--` after a line break goes with the next line.
