# Modules

## export and import

**prices.js**

```js
export const TAX = 0.2;

export function withTax(price) {
  return price + price * TAX;
}
```

**main.js**

```js
import { TAX, withTax } from "./prices.js";

console.log(TAX);
console.log(withTax(50));
```

**Output**

```text
0.2
60
```

**Rule:** Each file is a module. `export` in front of a declaration makes its name available to other files. `import { name } from "./file.js"` brings that name into another file.

`"./prices.js"` is the path from the importing file to the other file. `./` means the same folder, and the extension is needed.

`import { TAX } from "./prices.js"` takes one name and leaves the rest. The names in the braces must match the exported names.

<!-- task -->

## Each module, own scope

**cart.js**

```js
const label = "cart";
const items = ["pen", "ink"];

export function describe() {
  return `${label}: ${items.length} items`;
}
```

**main.js**

```js
import { describe } from "./cart.js";

const label = "main";

console.log(describe());
console.log(label);
console.log(typeof items);
```

**Output**

```text
cart: 2 items
main
undefined
```

**Rule:** A variable declared at the top of a module belongs to that module alone. Another file sees a name only when the module exports it and the file imports it.

`describe()` reads the `label` of `cart.js`, the file where the function was written.

`typeof items` gives `"undefined"` in `main.js`. Nothing exported `items`, so the name does not exist there.

**Common mistake:** using a name from another file without importing it.

**stock.js**

```js
export const stock = { pen: 3 };
const limit = 10;
```

**main.js**

```js
import { stock } from "./stock.js";

console.log(stock.pen < «limit»);
```

**Error**

```text
ReferenceError: limit is not defined
```

`limit` is private to `stock.js`. Export it there, then import it: `import { stock, limit } from "./stock.js"`.

<!-- task -->

## The export list

**temperature.js**

```js
const FREEZING = 32;

function toCelsius(fahrenheit) {
  return round(((fahrenheit - FREEZING) * 5) / 9);
}

function round(n) {
  return Math.round(n * 10) / 10;
}

export { FREEZING, toCelsius };
```

**main.js**

```js
import { FREEZING, toCelsius } from "./temperature.js";

console.log(FREEZING);
console.log(toCelsius(100));
```

**Output**

```text
32
37.8
```

**Rule:** `export { a, b };` exports names that are declared elsewhere in the file. It does the same as `export` in front of each declaration. A name that is not listed stays private, like `round`.

The braces hold a list of names. They are not an object, so `export { FREEZING: 32 }` is a syntax error.

`import` and `export` work only at the top level of a file. Inside a function or an `if`, they are a syntax error.

**Common mistake:** exporting a bare name.

**Wrong**

```js
const TAX = 0.2;

export «TAX»;
```

**Error**

```text
SyntaxError: Unexpected TAX
```

**Fix**

```js
const TAX = 0.2;

export «{ TAX }»;
```

`export` takes a declaration or a list in braces. A bare name is neither, so put it in a list.

<!-- task -->

## Remember

- Each file is a module with its own scope. Its top-level variables are private.
- `export` makes a name available: in front of a declaration, or in a list, `export { a, b }`.
- `import { a } from "./file.js"` brings an exported name into another file.
- `import` and `export` work only at the top level of a file.
