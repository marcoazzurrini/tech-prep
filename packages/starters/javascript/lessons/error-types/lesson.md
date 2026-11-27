# Built-in Errors

## What throws which

**Code**

```js
const shop = { owner: null };

const attempts = [
  () => shop.owner.name,
  () => shop.open(),
  () => console.log(basket),
  () => "ab".repeat(-1),
  () => JSON.parse("{oops}"),
];

for (const attempt of attempts) {
  try {
    attempt();
  } catch (error) {
    console.log(error.name);
  }
}
```

**Output**

```text
TypeError
TypeError
ReferenceError
RangeError
SyntaxError
```

**Rule:** JavaScript throws a different error class for each kind of failure. `TypeError`: a value of the wrong kind, such as `null` or a non-function. `ReferenceError`: a name that does not exist. `RangeError`: a number outside the allowed range. `SyntaxError`: text that does not parse.

`let total` read before its line throws a `ReferenceError` too.

`SyntaxError` in your own file stops the whole file before any line runs. You can only catch one from text parsed while the program runs, as in `JSON.parse`.

<!-- task -->

## name, message and cause

**Code**

```js
const reason = new Error("only 3 left");
const error = new RangeError("Quantity must be 1 to 3", { cause: reason });

console.log(error.name);
console.log(error.message);
console.log(String(error));
console.log(error.cause.message);
```

**Output**

```text
RangeError
Quantity must be 1 to 3
RangeError: Quantity must be 1 to 3
only 3 left
```

**Rule:** Every error has a `name`, which names its class, and a `message`, the text you passed in. `String(error)` joins them as `name: message`. The option `{ cause }` stores the error that led to this one in `error.cause`.

`error.stack` holds the calls that led to the error, as text. Its format differs between engines, so never compare it.

**Common mistake:** turning an error into JSON.

**Wrong**

```js
const error = new RangeError("Quantity must be 1 to 3");

console.log(«JSON.stringify(error)»);
```

**Output**

```text
{}
```

**Fix**

```js
const error = new RangeError("Quantity must be 1 to 3");

console.log(«JSON.stringify({ name: error.name, message: error.message })»);
```

`JSON.stringify` copies only own enumerable properties. `name` lives on the prototype, and `message` is not enumerable. Copy the fields you need into a plain object.

<!-- task -->

## Test with instanceof

**Code**

```js
const problems = [new TypeError("not a list"), new RangeError("too long"), "just text"];

for (const problem of problems) {
  console.log(problem instanceof RangeError, problem instanceof Error);
}
```

**Output**

```text
false true
true true
false false
```

```steps
Object.getPrototypeOf(TypeError) === Error => true
new TypeError("x") instanceof «Error» => true
```

**Rule:** Every built-in error class extends `Error`. So `instanceof RangeError` tells one class apart, and `instanceof Error` is true for all of them.

`name` is a plain property, and code can change it. `instanceof` checks the class itself.

**Common mistake:** testing the text of the message.

**Wrong**

```js
function itemCount(cart) {
  try {
    return cart.items.length;
  } catch (error) {
    if («error.message.startsWith("Cannot read properties")») {
      return 0;
    }
    throw error;
  }
}

try {
  console.log(itemCount(null));
} catch (error) {
  console.log("crashed: " + error.name);
}
```

**Output**

```text
crashed: TypeError
```

**Fix**

```js
function itemCount(cart) {
  try {
    return cart.items.length;
  } catch (error) {
    if («error instanceof TypeError») {
      return 0;
    }
    throw error;
  }
}

try {
  console.log(itemCount(null));
} catch (error) {
  console.log("crashed: " + error.name);
}
```

Chrome and Node word this message `Cannot read properties of null`. The app's engine words it differently, so the check failed. The language fixes the class of an error, not its message.

<!-- task -->

## Throw the right class

**Code**

```js
function setVolume(level) {
  if (typeof level !== "number") {
    throw new TypeError("level must be a number");
  }
  if (level < 0 || level > 10) {
    throw new RangeError("level must be 0 to 10");
  }
  return level;
}

for (const level of [5, "loud", 11]) {
  try {
    console.log(setVolume(level));
  } catch (error) {
    console.log(String(error));
  }
}
```

**Output**

```text
5
TypeError: level must be a number
RangeError: level must be 0 to 10
```

**Rule:** You can throw the built-in classes yourself. Throw a `TypeError` for an argument of the wrong kind, and a `RangeError` for a value outside the allowed range. Callers can then tell them apart with `instanceof`.

`TypeError("text")` without `new` also makes an error. Every error class works both ways.

`new AggregateError([first, second], "text")` holds several errors at once, in its `errors` array.

<!-- task -->

## Remember

- `TypeError`: wrong kind of value. `ReferenceError`: unknown name. `RangeError`: out of range. `SyntaxError`: text that does not parse.
- An error has a `name` and a `message`, and `{ cause }` keeps the error behind it.
- Tell errors apart with `instanceof`, never by the text of the message.
- Throw `TypeError` or `RangeError` yourself when an argument is wrong.
