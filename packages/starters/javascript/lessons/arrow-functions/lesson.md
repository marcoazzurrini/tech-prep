# Arrow Functions

## A body without braces

**Code**

```js
const double = n => n * 2;
const add = (a, b) => a + b;
const ready = () => "ready";

console.log(double(4));
console.log(add(2, 3));
console.log(ready());
```

**Output**

```text
8
5
ready
```

**Rule:** The body of an arrow function is what comes after `=>`. When the body is one expression with no braces, the function returns that expression. There is no `return`.

`n => n * 2` has exactly one parameter, so the parentheses around it are optional.

`() => "ready"` and `(a, b) => a + b` need the parentheses: they have no parameter, or more than one.

<!-- task -->

## Braces need return

**Code**

```js
const square = (n) => n * n;

const cube = (n) => {
  const squared = n * n;

  return squared * n;
};

const lost = (n) => {
  n * n;
};

console.log(square(3));
console.log(cube(3));
console.log(lost(3));
```

**Output**

```text
9
27
undefined
```

**Rule:** A body in braces is a block of statements. It returns only what a `return` says. With no `return`, the function gives `undefined`.

**Common mistake:** adding braces to a callback and forgetting `return`.

**Wrong**

```js
const names = ["ada", "lin"];

const upper = names.map((name) => {
  «name.toUpperCase();»
});

console.log(upper);
```

**Output**

```text
[ undefined, undefined ]
```

**Fix**

```js
const names = ["ada", "lin"];

const upper = names.map((name) => {
  «return» name.toUpperCase();
});

console.log(upper);
```

The callback worked out each name and threw it away. `map` collected what the callback returned: `undefined`, twice.

<!-- task -->

## Returning an object literal

**Code**

```js
const withParens = (name) => ({ name: name });
const noParens = (name) => { name: name };

console.log(JSON.stringify(withParens("Ada")));
console.log(noParens("Ada"));
```

**Output**

```text
{"name":"Ada"}
undefined
```

**Rule:** To return an object literal from a body without braces, wrap it in parentheses. Without them, `{` starts a block, and the function returns `undefined`.

`{ name: name }` read as a block is a label, `name:`, and then the expression `name`. It is valid code that does nothing.

**Common mistake:** leaving the parentheses out.

**Wrong**

```js
const toUser = (name) => «{ name: name, active: true }»;

console.log(toUser("Ada").active);
```

**Error**

```text
SyntaxError: Expected ";" but found ":"
```

**Fix**

```js
const toUser = (name) => «({ name: name, active: true })»;

console.log(toUser("Ada").active);
```

With two properties the braces cannot be read as a block, so the file does not run. With one property there is no error at all, which is worse.

<!-- task -->

## No new, no arguments

**Code**

```js
function Timer() {}

const Stopwatch = () => {};

console.log(typeof new Timer());

try {
  new Stopwatch();
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
object
TypeError
```

**Rule:** An arrow function can only be called. Using it with `new` throws a `TypeError`. The other two forms can make objects with `new`.

`arguments` does not exist in an arrow function. It is an older object that holds the arguments of a call, and a later lesson covers it.

`this` works differently in an arrow function than in the other two forms. A later chapter covers it.

<!-- task -->

## Remember

- `n => n * 2` returns its expression. A body in braces needs `return`.
- Return an object literal in parentheses: `() => ({ a: 1 })`.
- One parameter needs no parentheses. None, or several, need them.
- An arrow function cannot be used with `new` and has no `arguments`.
