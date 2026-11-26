# Default Exports and Renaming

## One default export

**format.js**

```js
export const CURRENCY = "EUR";

export default function formatPrice(amount) {
  return `${amount.toFixed(2)} ${CURRENCY}`;
}
```

**main.js**

```js
import show, { CURRENCY } from "./format.js";

console.log(show(4.5));
console.log(CURRENCY);
console.log(show.name);
```

**Output**

```text
4.50 EUR
EUR
formatPrice
```

**Rule:** A module can have one `default` export. It is imported without braces, under any name the importer picks. Exports with a name of their own are called named exports.

`import show, { CURRENCY } from "./format.js"` takes the default export and a named export together. The default comes first.

`import { formatPrice } from "./format.js"` fails. Braces ask for a named export, and `formatPrice` is the default.

**Common mistake:** putting `const` after `export default`.

**Wrong**

```js
export default «const» TAX = 0.2;
```

**Error**

```text
SyntaxError: Unexpected const
```

**Fix**

```js
«const TAX = 0.2;»

export default TAX;
```

`export default` takes a function, a class or an expression, such as `export default 42`. A `const` declaration is none of these. Declare the variable first, then export it.

<!-- task -->

## Rename with as

**date.js**

```js
export function format(day, month) {
  return `${day}/${month}`;
}
```

**money.js**

```js
function euros(amount) {
  return `${amount} EUR`;
}

export { euros as format };
```

**main.js**

```js
import { format as formatDate } from "./date.js";
import { format as formatMoney } from "./money.js";

console.log(formatDate(3, 11));
console.log(formatMoney(20));
```

**Output**

```text
3/11
20 EUR
```

**Rule:** `import { a as b }` brings in the export `a` under the local name `b`. `export { a as b }` exports the local `a` under the name `b`. The existing name is on the left, and the new name is on the right.

`import { format }` from both files would be a syntax error, because one name is declared twice. Rename at least one with `as`.

`import { default as show } from "./format.js"` is the long way to write `import show from "./format.js"`. The default export is an export named `default`.

<!-- task -->

## The namespace object

**cart.js**

```js
export const items = ["pen", "ink"];

export function count() {
  return items.length;
}

export default "my cart";
```

**main.js**

```js
import * as cart from "./cart.js";

console.log(cart.count());
console.log(cart.default);
console.log(Object.keys(cart).join(", "));
```

**Output**

```text
2
my cart
count, default, items
```

**Rule:** `import * as cart` gives one object with every export of the module as a property. It is called the namespace object. The default export is its property `default`.

`Object.keys(cart)` lists the names in sorted order, not in the order of the file. Capital letters sort before small ones.

`cart.count = null` throws a `TypeError`. The namespace object is read-only.

**Common mistake:** calling the namespace object as if it were the default export.

**sum.js**

```js
export default function sum(a, b) {
  return a + b;
}
```

**main.js**

```js
import «* as sum» from "./sum.js";

console.log(sum(1, 2));
```

**Error**

```text
TypeError: sum is not a function. (In 'sum(1, 2)', 'sum' is an instance of Module)
```

Here `sum` is the namespace object, and the function is `sum.default`. Write `import sum from "./sum.js"` to get the function itself.

<!-- task -->

## Passing exports on

**pen.js**

```js
export const price = 2;

export default "pen";
```

**shop.js**

```js
export { price as penPrice } from "./pen.js";
export { default as penName } from "./pen.js";

export const open = true;
```

**main.js**

```js
import * as shop from "./shop.js";

console.log(Object.keys(shop).join(", "));
console.log(shop.penName, shop.penPrice);
```

**Output**

```text
open, penName, penPrice
pen 2
```

**Rule:** `export { name } from "./file.js"` passes on an export of another module. This is called a re-export. `export * from "./file.js"` passes on every named export, but not the default.

A re-export does not import. `shop.js` has no variable called `price` or `penPrice`. To use one there, import it as well.

`export { default as penName } from "./pen.js"` passes on the default export under a name.

<!-- task -->

## Remember

- One `default` export per module. Import it without braces, under any name.
- `as` renames: the existing name on the left, the new name on the right.
- `import * as ns` gives the namespace object. The default export is `ns.default`.
- `export ... from` passes exports on. `export *` leaves out the default.
