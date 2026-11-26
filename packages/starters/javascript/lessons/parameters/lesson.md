# Parameters and Defaults

## Missing and extra arguments

**Code**

```js
function seat(row, number) {
  return `row ${row}, seat ${number}`;
}

console.log(seat("C", 4));
console.log(seat("C"));
console.log(seat());
console.log(seat("C", 4, "window", true));
```

**Output**

```text
row C, seat 4
row C, seat undefined
row undefined, seat undefined
row C, seat 4
```

**Rule:** A **parameter** is a name in the function's definition. An **argument** is a value in a call. Arguments fill the parameters by position, from the left. A parameter with no argument is `undefined`. An argument with no parameter is ignored. Neither is an error.

`seat(undefined, 4)` skips the first argument. `seat(, 4)` is a `SyntaxError`.

**Common mistake:** handing `map` a function that has a second parameter.

**Wrong**

```js
function shorten(word, keep) {
  return keep ? word.slice(0, keep) : word;
}

console.log(["apple", "melon", "grape"].map(«shorten»));
```

**Output**

```text
[ "apple", "m", "gr" ]
```

**Fix**

```js
function shorten(word, keep) {
  return keep ? word.slice(0, keep) : word;
}

console.log(["apple", "melon", "grape"].map(«(word) => shorten(word)»));
```

`map` calls its function with three arguments: the item, its index and the array. An extra argument is ignored only when no parameter takes it. Here the index landed in `keep`. The arrow function passes the word alone.

<!-- task -->

## Defaults replace undefined

**Code**

```js
function label(text, size = 12) {
  return `${text} at ${size}px`;
}

console.log(label("Title"));
console.log(label("Title", undefined));
console.log(label("Title", null));
console.log(label("Title", 0));
```

**Output**

```text
Title at 12px
Title at 12px
Title at nullpx
Title at 0px
```

**Rule:** `size = 12` gives the parameter a **default value**. The default is used when the argument is missing or `undefined`. Every other value stays, and that includes `null`, `0` and `""`.

`function f(a = 1, b) {}` is allowed. `f(undefined, 5)` keeps the default of `a` and sets `b`.

**Common mistake:** passing `null` and expecting the default.

**Wrong**

```js
function greet(name = "guest") {
  return `Hello, ${name}`;
}

const user = { name: null };

console.log(greet(«user.name»));
```

**Output**

```text
Hello, null
```

**Fix**

```js
function greet(name = "guest") {
  return `Hello, ${name}`;
}

const user = { name: null };

console.log(greet(«user.name ?? undefined»));
```

`null` is a value, so the default did not apply. `?? undefined` turns `null` into `undefined`, and then the default is used.

<!-- task -->

## Evaluated at each call

**Code**

```js
let calls = 0;

function nextId() {
  calls += 1;

  return calls;
}

function addTask(title, id = nextId(), list = []) {
  list.push(`${id}: ${title}`);

  return list;
}

console.log(addTask("wash"));
console.log(addTask("cook", 9));
console.log(addTask("shop"));
console.log(calls);
```

**Output**

```text
[ "1: wash" ]
[ "9: cook" ]
[ "2: shop" ]
2
```

**Rule:** A default is an expression. It is evaluated during the call, each time the default is needed. When another value is passed, it is not evaluated at all. So `list = []` makes a new array at every call.

`function crop(height = 100, width = height) {}` works. Parameters are set from left to right, and a default can read the ones before it.

**Common mistake:** a default that reads a later parameter.

**Wrong**

```js
function crop(«width = height, height = 100») {
  return `${width} x ${height}`;
}

console.log(crop());
```

**Error**

```text
ReferenceError: Cannot access 'height' before initialization.
```

**Fix**

```js
function crop(«height = 100, width = height») {
  return `${width} x ${height}`;
}

console.log(crop());
```

When `width` took its default, `height` was not set yet. It is the same error as reading a `let` variable above its line.

<!-- task -->

## Destructured parameters

**Code**

```js
function createButton({ label = "OK", colour = "blue" } = {}) {
  return `${label} in ${colour}`;
}

console.log(createButton({ label: "Save", colour: "green" }));
console.log(createButton({ colour: "red" }));
console.log(createButton({}));
console.log(createButton());
```

**Output**

```text
Save in green
OK in red
OK in blue
OK in blue
```

**Rule:** A parameter can be a destructuring pattern. Each property gets its own default inside the pattern. The `= {}` after the pattern is the default for the whole argument. With it, the call also works with no argument.

Without the `= {}`, `createButton()` destructures `undefined` and throws a `TypeError`.

**Common mistake:** putting the defaults in the default object.

**Wrong**

```js
function createButton({ label, colour } = «{ label: "OK", colour: "blue" }») {
  return `${label} in ${colour}`;
}

console.log(createButton({ colour: "red" }));
```

**Output**

```text
undefined in red
```

**Fix**

```js
function createButton({ label «= "OK"», colour «= "blue"» } = «{}») {
  return `${label} in ${colour}`;
}

console.log(createButton({ colour: "red" }));
```

The default object is used only when the whole argument is missing. Here an object was passed, so nothing filled in `label`. Defaults inside the pattern work property by property.

<!-- task -->

## Remember

- A missing argument is `undefined`. An extra argument is ignored. Neither is an error.
- A default is used for `undefined` only. `null`, `0` and `""` stay.
- A default is evaluated at each call that needs it, left to right. It can read the parameters before it.
- `function f({ a = 1, b = 2 } = {})` gives each option a default and works with no argument.
