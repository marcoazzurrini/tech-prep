# Circular Imports

## Who runs first

**user.js**

```js
import "./order.js";

console.log("user.js runs");
```

**order.js**

```js
import "./user.js";

console.log("order.js runs");
```

**main.js**

```js
import "./user.js";

console.log("main.js runs");
```

**Output**

```text
order.js runs
user.js runs
main.js runs
```

**Rule:** Two modules that import each other form a cycle. A module that has already started is not started again. So the module that closes the cycle runs first, before the other has run a single line.

`import "./order.js"` makes `user.js` wait for `order.js`.

`import "./user.js"` in `order.js` waits for nothing. `user.js` has already started, so `order.js` runs first.

<!-- task -->

## Functions work early

**user.js**

```js
import { describeOrder } from "./order.js";

export function userName() {
  return "Ada";
}

console.log("user.js:", describeOrder());
```

**order.js**

```js
import { userName } from "./user.js";

console.log("order.js:", userName());

export function describeOrder() {
  return `order for ${userName()}`;
}
```

**main.js**

```js
import "./user.js";
```

**Output**

```text
order.js: Ada
user.js: order for Ada
```

**Rule:** A function declaration is hoisted. It is ready before any line of its module runs. So the module that runs first in a cycle can already call a function declared in the other module.

`userName()` works in `order.js`, although no line of `user.js` has run yet.

`export const userName = () => "Ada"` would not work there. Only a function declaration is ready early.

<!-- task -->

## A const is not ready

**user.js**

```js
import { limit } from "./order.js";

export const userName = "Ada";

console.log("user.js:", limit);
```

**order.js**

```js
import { userName } from "./user.js";

try {
  console.log(userName);
} catch (error) {
  console.log("order.js:", error.name);
}

export const limit = 3;
export const owner = () => userName;
```

**main.js**

```js
import "./user.js";
import { owner } from "./order.js";

console.log("main.js:", owner());
```

**Output**

```text
order.js: ReferenceError
user.js: 3
main.js: Ada
```

**Rule:** The module that runs first finds the other's `let`, `const` and `class` exports in their temporal dead zone. Reading one throws a `ReferenceError`. Reading it later, after the other module has run, works.

`owner()` reads `userName` when `main.js` calls it. By then `user.js` has run.

`export var userName` would give `undefined` in `order.js`, not an error.

**Common mistake:** building a top-level value from a `const` of the other module.

**shop.js**

```js
import { TAX } from "./tax.js";

export const BASE = 10;
export const price = BASE + TAX;
```

**tax.js**

```js
import { BASE } from "./shop.js";

export const TAX = «BASE» * 0.2;
```

**main.js**

```js
import { price } from "./shop.js";

console.log(price);
```

**Error**

```text
ReferenceError: Cannot access 'BASE' before initialization.
```

`tax.js` runs first, when `BASE` has no value yet. Move `BASE` into a third module that imports nothing, and import it from both files. Then there is no cycle.

<!-- task -->

## Remember

- In a cycle, a module that has already started is not started again. The other one runs first.
- The module that runs first sees the other's exports before that module has run.
- A function declaration works there, because it is hoisted.
- A `let`, `const` or `class` throws a `ReferenceError` there. Read it later, or break the cycle.
