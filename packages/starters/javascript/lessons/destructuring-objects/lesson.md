# Destructuring Objects

## Properties by name

**Code**

```js
const product = { name: "Lamp", price: 30, stock: 4 };
const { price, name, colour } = product;
const { stock: left } = product;

console.log(name);
console.log(price);
console.log(colour);
console.log(left);
```

**Output**

```text
Lamp
30
undefined
4
```

**Rule:** `const { a, b } = obj` gives each variable the property with the same name. The order does not matter, and a missing property gives `undefined`. `{ stock: left }` reads the property `stock` into a variable named `left`.

`const { length } = "Lamp"` gives `4`. The right side can be any value that has properties.

**Common mistake:** writing a rename the wrong way round.

**Wrong**

```js
const product = { name: "Lamp", price: 30 };
const { «cost: price» } = product;

console.log(cost);
```

**Error**

```text
ReferenceError: cost is not defined
```

**Fix**

```js
const product = { name: "Lamp", price: 30 };
const { «price: cost» } = product;

console.log(cost);
```

The property comes first and the new variable second: `{ property: variable }`. The wrong code looked for a property named `cost` and made a variable named `price`.

<!-- task -->

## Defaults

**Code**

```js
const settings = { theme: "dark", size: undefined, sound: null };
const { theme = "light", size = 14, sound = "on" } = settings;
const { lang: language = "en" } = settings;

console.log(theme);
console.log(size);
console.log(sound);
console.log(language);
```

**Output**

```text
dark
14
null
en
```

**Rule:** A default, written after `=`, is used when the property is missing or `undefined`. `null` is a value, so it stays. A rename and a default go together as `{ property: variable = default }`.

`const { id = makeId() } = { id: 7 }` never calls `makeId`. A default is evaluated only when it is used.

**Common mistake:** counting on a default when the object itself is missing.

**Wrong**

```js
function fontSize(options) {
  const { size = 14 } = options;

  return size;
}

console.log(fontSize());
```

**Error**

```text
TypeError: Cannot destructure property 'size' from null or undefined value
```

**Fix**

```js
function fontSize(options) {
  const { size = 14 } = options «?? {}»;

  return size;
}

console.log(fontSize());
```

Destructuring `undefined` or `null` throws a `TypeError`, because neither has properties. The default covers a missing property, not a missing object. Chrome and Node say `Cannot read properties of undefined (reading 'size')`.

<!-- task -->

## Nested patterns

**Code**

```js
const order = {
  id: 7,
  customer: { name: "Ada", address: { city: "Turin" } },
};
const { customer: { name, address: { city } } } = order;

console.log(name);
console.log(city);
```

**Output**

```text
Ada
Turin
```

**Rule:** A pattern after the colon reaches into a nested object. Only the names at the ends become variables. Here `customer` and `address` are the path to follow, so neither is a variable.

`const { customer: { name } = {} } = { id: 8 }` gives `undefined` for `name`. Without the `= {}`, the missing `customer` throws a `TypeError`.

**Common mistake:** using a name from the middle of the path.

**Wrong**

```js
const order = { id: 7, customer: { name: "Ada" } };
const { customer: { name } } = order;

console.log(name, «customer».name);
```

**Error**

```text
ReferenceError: customer is not defined
```

**Fix**

```js
const order = { id: 7, customer: { name: "Ada" } };
const { «customer, »customer: { name } } = order;

console.log(name, customer.name);
```

`customer: { name }` only says where to look. To get the object as well, name the property a second time on its own.

<!-- task -->

## Rest and assignment

**Code**

```js
const user = { id: 3, name: "Ada", role: "admin" };
const { id, ...profile } = user;

console.log(id);
console.log(JSON.stringify(profile));
console.log(JSON.stringify(user));
```

**Output**

```text
3
{"name":"Ada","role":"admin"}
{"id":3,"name":"Ada","role":"admin"}
```

**Rule:** `...profile` collects the properties that the pattern did not name, in a new object. It must come last. The original object does not change.

`const { [key]: value } = user` reads the property whose name is held in `key`. A computed key always needs a variable name after the colon.

`...profile` copies own properties only: the ones stored on the object itself, not inherited ones.

**Common mistake:** assigning to existing variables without parentheses.

**Wrong**

```js
const user = { id: 3, name: "Ada" };
let id;
let name;

«{ id, name } = user;»
console.log(id, name);
```

**Error**

```text
SyntaxError: Unexpected =
```

**Fix**

```js
const user = { id: 3, name: "Ada" };
let id;
let name;

«(»{ id, name } = user«)»;
console.log(id, name);
```

A statement that starts with `{` is read as a block of code, not as a pattern. The parentheses make it an expression.

<!-- task -->

## Remember

- `const { a, b: x } = obj` takes properties by name. `b: x` reads `b` into a variable named `x`.
- A default applies to a missing or `undefined` property, not to `null`. Destructuring `null` or `undefined` throws a `TypeError`.
- In `{ a: { b } }` only `b` is a variable. `...rest` collects the other properties in a new object.
- With no `const` or `let`, wrap it in parentheses: `({ a, b } = obj)`.
