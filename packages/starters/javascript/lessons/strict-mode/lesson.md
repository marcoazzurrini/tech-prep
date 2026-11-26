# Strict Mode

## Undeclared names throw

**Code**

```js
function addPoints(points) {
  try {
    score = points;
  } catch (error) {
    console.log(error.name);
  }
}

addPoints(5);
console.log(typeof score);
```

**Output**

```text
ReferenceError
undefined
```

**Rule:** **Strict mode** is a stricter set of rules for JavaScript, and every module runs in it. In strict mode, assigning to a name that no scope declares throws a `ReferenceError`.

`score = points` is silent when strict mode is off, which is called **sloppy mode**. There it makes a new property of the global object, so `score` becomes a global variable.

**Common mistake:** a typo in the name you assign to.

**Wrong**

```js
function addItem(cart, price) {
  let total = cart.total;

  «totl» = total + price;

  return total;
}

console.log(addItem({ total: 5 }, 2));
```

**Error**

```text
ReferenceError: totl is not defined
```

**Fix**

```js
function addItem(cart, price) {
  let total = cart.total;

  «total» = total + price;

  return total;
}

console.log(addItem({ total: 5 }, 2));
```

In sloppy mode the typo makes a global `totl`, and the function returns `5` with no warning. Strict mode stops at the typo.

<!-- task -->

## Failed writes throw

**Code**

```js
const settings = Object.freeze({ theme: "dark" });

try {
  settings.theme = "light";
} catch (error) {
  console.log(error.name);
}

try {
  Math.PI = 3;
} catch (error) {
  console.log(error.name);
}

console.log(settings.theme);
```

**Output**

```text
TypeError
TypeError
dark
```

**Rule:** In strict mode, a write that cannot happen throws a `TypeError`. In sloppy mode, where strict mode is off, the same line does nothing and the program goes on.

`Object.freeze(settings)` makes every property of `settings` read-only. `Math.PI` is read-only from the start.

`"Ada".age = 36` throws too. A primitive cannot hold a new property.

**Common mistake:** changing an object that was handed to you.

**Wrong**

```js
const defaults = Object.freeze({ size: "M", colour: "black" });

function withSize(options, size) {
  «options.size = size;»

  return options;
}

console.log(withSize(defaults, "L").size);
```

**Error**

```text
TypeError: Attempted to assign to readonly property.
```

**Fix**

```js
const defaults = Object.freeze({ size: "M", colour: "black" });

function withSize(options, size) {
  return «{ ...options, size }»;
}

console.log(withSize(defaults, "L").size);
```

`defaults` is frozen, so the write throws. Build a new object instead. Chrome and Node say `Cannot assign to read only property 'size' of object`.

<!-- task -->

## Syntax it refuses

**Code**

```js
function parses(source) {
  try {
    new Function(`"use strict"; ${source}`);
    return "ok";
  } catch (error) {
    return error.name;
  }
}

console.log(parses("function area(width, height) {}"));
console.log(parses("function area(size, size) {}"));
console.log(parses("delete total;"));
console.log(parses("with (Math) { round(2.5); }"));
```

**Output**

```text
ok
SyntaxError
SyntaxError
SyntaxError
```

**Rule:** Strict mode refuses some old syntax with a `SyntaxError`: two parameters with one name, `delete` of a plain name, and the `with` statement. Sloppy mode, where strict mode is off, accepts all three.

`new Function(text)` builds a function from text. The example uses it so that the error can be caught.

`try` cannot catch a `SyntaxError` in its own file. The file is refused before its first line runs.

**Common mistake:** using `delete` to clear a variable.

**Wrong**

```js
let cache = { ada: 36 };

«delete cache;»

console.log(cache);
```

**Error**

```text
SyntaxError: Cannot delete unqualified property 'cache' in strict mode.
```

**Fix**

```js
let cache = { ada: 36 };

«cache = null;»

console.log(cache);
```

`delete` removes a property from an object, as in `delete cache.ada`. It cannot remove a variable. Assign `null` to let the object go.

<!-- task -->

## Where it is on

**Code**

```js
function inModule() {
  return this === undefined;
}

const fromText = new Function("return this === undefined;");
const strictText = new Function('"use strict"; return this === undefined;');

console.log(inModule());
console.log(fromText());
console.log(strictText());
```

**Output**

```text
true
false
true
```

**Rule:** A module and the body of a class are always in strict mode. Other code needs `"use strict";` as the first statement of its file or its function.

`this` in a plain call such as `inModule()` is `undefined` in strict mode. With strict mode off, which is called sloppy mode, it is the global object.

`new Function(text)` builds a function from text. The text is not part of the module, so it is sloppy unless it starts with `"use strict";`.

**Common mistake:** writing `"use strict";` below another statement.

**Wrong**

```js
const isStrict = new Function(`
  const answer = this === undefined;
  «"use strict";»
  return answer;
`);

console.log(isStrict());
```

**Output**

```text
false
```

**Fix**

```js
const isStrict = new Function(`
  «"use strict";»
  const answer = this === undefined;
  return answer;
`);

console.log(isStrict());
```

**Output**

```text
true
```

`"use strict";` only counts as the first statement of a file or a function. Lower down it is a string that does nothing, and no error tells you.

<!-- task -->

## Remember

- A module and a class are always in strict mode. Elsewhere, `"use strict";` as the first statement turns it on.
- Assigning to an undeclared name throws a `ReferenceError`. A write that cannot happen throws a `TypeError`.
- Two parameters with one name, `delete name` and `with` are each a `SyntaxError`.
- In a plain call, `this` is `undefined`, not the global object.
