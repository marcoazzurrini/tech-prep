# import() and Top-level await

## import() gives a promise

**chart.js**

```js
console.log("chart.js runs");

export const kind = "bar";

export default function draw(values) {
  return values.map((n) => "#".repeat(n)).join(" ");
}
```

**main.js**

```js
console.log("main.js starts");

import("./chart.js").then((chart) => {
  console.log(chart.kind);
  console.log(chart.default([1, 3]));
});

console.log("main.js goes on");
```

**Output**

```text
main.js starts
main.js goes on
chart.js runs
bar
# ###
```

**Rule:** `import(path)` loads a module when that line runs, not before the file starts. It returns a promise of the module's namespace object.

`chart.default` is the default export. The namespace object holds it under the name `default`.

`chart.js runs` comes after `main.js goes on`. The module is loaded later, and `main.js` does not wait for it.

<!-- task -->

## Top-level await

**config.js**

```js
console.log("config.js starts");

const load = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ theme: "dark" }), 20);
  });

export const settings = await load();

console.log("config.js is done");
```

**main.js**

```js
import { settings } from "./config.js";

console.log("main.js runs");
console.log(settings.theme);
```

**Output**

```text
config.js starts
config.js is done
main.js runs
dark
```

**Rule:** A module can use `await` at its top level, outside any function. This is called top-level `await`. Every module that imports it waits until it has finished.

`await` inside a function still needs `async`. Only the top level of a module is free of that.

`import "./other.js"` in `main.js` would not wait for `config.js`. A module that does not import `config.js` can run while it is paused.

<!-- task -->

## Load when needed

**en.js**

```js
console.log("en.js runs");

export const hello = "Hello";
```

**it.js**

```js
console.log("it.js runs");

export const hello = "Ciao";
```

**main.js**

```js
const lang = "it";

const words = await import(`./${lang}.js`);
console.log(words.hello);

const again = await import("./it.js");
console.log(again === words);
```

**Output**

```text
it.js runs
Ciao
true
```

**Rule:** `import()` is an expression. It can sit in an `if` or a function, and its path can be built while the program runs. A module that has already run does not run again: the promise gives the same namespace object.

`en.js` never runs, because nothing asks for it.

`import("./missing.js")` gives a rejected promise. Catch it with `try` and `catch` around the `await`.

**Common mistake:** using the result of `import()` without waiting for it.

**greet.js**

```js
export function greet() {
  return "hi";
}
```

**main.js**

```js
const { greet } = «import("./greet.js")»;

console.log(greet());
```

**Error**

```text
TypeError: greet is not a function. (In 'greet()', 'greet' is undefined)
```

`import()` returns a promise, and a promise has no `greet`. Wait for the module first: `const { greet } = await import("./greet.js")`.

<!-- task -->

## Remember

- `import(path)` loads a module when the line runs. It returns a promise of the namespace object.
- The default export is the property `default` of that object.
- A module runs once. A second `import()` gives the same namespace object.
- A module can `await` at its top level, and its importers wait for it.
