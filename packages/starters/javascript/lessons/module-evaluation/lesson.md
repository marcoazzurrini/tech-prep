# A Module Runs Once

## Imports run first

**greet.js**

```js
console.log("greet.js runs");

export const greeting = "Hello";
```

**main.js**

```js
console.log("main.js starts");

import { greeting } from "./greet.js";

console.log(greeting);
```

**Output**

```text
greet.js runs
main.js starts
Hello
```

**Rule:** Imports are hoisted. Every imported module runs before the first line of the importing file, wherever the `import` line is written.

`import "./setup.js"` has no names. It runs the module and imports nothing.

**Common mistake:** preparing something on the line before an import.

**settings.js**

```js
export const mode = globalThis.MODE ?? "live";
```

**main.js**

```js
«globalThis.MODE = "test";»

import { mode } from "./settings.js";

console.log(mode);
```

**Output**

```text
live
```

`settings.js` ran before the first line of `main.js`, so `MODE` was not set yet. Move that line into a module of its own, and import it first.

<!-- task -->

## Once, in order

**theme.js**

```js
console.log("theme.js runs");
```

**layout.js**

```js
import "./theme.js";

console.log("layout.js runs");
```

**main.js**

```js
import "./layout.js";
import "./theme.js";

console.log("main.js runs");
```

**Output**

```text
theme.js runs
layout.js runs
main.js runs
```

**Rule:** A module runs once, the first time it is imported. Before a module runs, its own imports run, in the order of its `import` lines.

`import "./theme.js"` in `main.js` runs nothing. `layout.js` had already imported that module, so it is reused.

<!-- task -->

## State is shared

**log.js**

```js
const lines = [];

export function log(text) {
  lines.push(text);

  return lines.length;
}
```

**cart.js**

```js
import { log } from "./log.js";

export function addItem(name) {
  return log(`added ${name}`);
}
```

**main.js**

```js
import { log } from "./log.js";
import { addItem } from "./cart.js";

console.log(log("start"));
console.log(addItem("pen"));
console.log(log("end"));
```

**Output**

```text
1
2
3
```

**Rule:** Every importer gets the same module, not a fresh copy. A variable at the top of a module exists once, so the whole program shares it.

`lines` is one array. `main.js` and `cart.js` both add to it through the same `log`.

`export const config = { debug: false }` exports one object. A change made by one importer shows in every other.

<!-- task -->

## Remember

- Imports are hoisted. Imported modules run before the first line of the importing file.
- A module's own imports run before it, in the order of the `import` lines.
- A module runs once. A later import reuses it.
- A module's variables exist once, and every importer shares them.
