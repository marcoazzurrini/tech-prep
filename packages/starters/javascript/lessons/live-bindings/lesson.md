# Imports Are Live

## Not a copy

**counter.js**

```js
export let count = 0;

export function increment() {
  count += 1;
}
```

**main.js**

```js
import { count, increment } from "./counter.js";

console.log(count);

increment();
increment();

console.log(count);
```

**Output**

```text
0
2
```

**Rule:** An import is not a copy. It is a view of the exporter's variable, called a live binding. When the exporting module changes the variable, every importer sees the new value.

`const start = count` does copy. It takes the value at that moment, so `start` stays `0` after `increment()`.

`import * as counter` is live too. `counter.count` reads the variable each time.

<!-- task -->

## Imports are read-only

**settings.js**

```js
export let theme = "light";
export const colours = { accent: "blue" };

export function setTheme(name) {
  theme = name;
}
```

**main.js**

```js
import { theme, colours, setTheme } from "./settings.js";

try {
  theme = "dark";
} catch (error) {
  console.log(error.name);
}

setTheme("dark");
colours.accent = "red";

console.log(theme, colours.accent);
```

**Output**

```text
TypeError
dark red
```

**Rule:** An importer cannot assign to an import, even when the exporter declared it with `let`. Only the exporting module can assign to its variable. To let others change it, export a function that does.

`colours.accent = "red"` works. It changes the object, not the import, and every importer sees the change.

`theme = "dark"` fails in Chrome and Node with `TypeError: Assignment to constant variable.`

**Common mistake:** counting up an imported variable.

**visits.js**

```js
export let visits = 10;
```

**main.js**

```js
import { visits } from "./visits.js";

«visits += 1»;
console.log(visits);
```

**Error**

```text
TypeError: Attempted to assign to readonly property.
```

`visits += 1` is an assignment, and so is `visits++`. Add a function to `visits.js` that changes the variable, and call it from `main.js`.

<!-- task -->

## export default copies

**counter.js**

```js
let count = 0;

export function increment() {
  count += 1;
}

export { count };
export default count;
```

**main.js**

```js
import snapshot, { count, increment } from "./counter.js";

increment();
increment();

console.log(snapshot);
console.log(count);
```

**Output**

```text
0
2
```

**Rule:** `export default count` exports the value that `count` holds when that line runs. It does not export the variable, so later changes do not show. A named export stays live.

`export default count + 1` shows why. What follows `export default` here is an expression. It is worked out once, and the result is exported.

`export { count as default }` exports the variable itself, so this default export is live.

<!-- task -->

## Remember

- An import is a live view of the exporter's variable. It always shows the latest value.
- An importer cannot assign to an import. Only the exporting module can.
- An imported object can still be changed through its properties.
- `export default value` exports a copy of the value. Named exports are live.
