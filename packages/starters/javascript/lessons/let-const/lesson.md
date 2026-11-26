# let and const

## let changes, const stays

**Code**

```js
let stock = 5;
const limit = 10;

stock = stock - 2;
stock = stock + 4;

console.log(stock);
console.log(limit);
```

**Output**

```text
7
10
```

**Rule:** To **reassign** a variable is to give it a new value with `=`. A `let` variable can be reassigned. A `const` variable cannot.

**Common mistake:** reassigning a `const`.

**Wrong**

```js
const limit = 10;

«limit = 20;»
console.log(limit);
```

**Error**

```text
TypeError: Cannot assign to "limit" because it is a constant
```

**Fix**

```js
«let» limit = 10;

limit = 20;
console.log(limit);
```

Every way of reassigning a `const` fails, and that includes `limit += 1` and `limit++`. Use `let` for a value that must change.

Chrome and Node word it as `TypeError: Assignment to constant variable.` They throw it when the line runs.

<!-- task -->

## Declaring without a value

**Code**

```js
let winner;
console.log(winner);

winner = "Ada";
console.log(winner);
```

**Output**

```text
undefined
Ada
```

**Rule:** A `let` can be declared without a value. It holds `undefined` until you assign one. A `const` must get its value in its declaration.

`let stock = 5; let stock = 6;` is a `SyntaxError`. A name can be declared only once in the same place.

**Common mistake:** declaring a `const` first, and giving it a value later.

**Wrong**

```js
const order = { total: 80 };
const fee«;»

if (order.total > 50) {
  fee = 0;
} else {
  fee = 5;
}

console.log(fee);
```

**Error**

```text
SyntaxError: The constant "fee" must be initialized
```

**Fix**

```js
const order = { total: 80 };
const fee = «order.total > 50 ? 0 : 5»;

console.log(fee);
```

A `SyntaxError` is found before the program starts, so not one line runs. Work the value out in one expression, or declare with `let`.

<!-- task -->

## const does not freeze

**Code**

```js
const cart = ["tea"];
const user = { name: "Ada", visits: 1 };

cart.push("milk");
user.visits = 2;

console.log(cart.join(","));
console.log(user.visits);
```

**Output**

```text
tea,milk
2
```

**Rule:** `const` fixes which value the name holds. It does not freeze that value. The items of a `const` array and the properties of a `const` object can still change.

`cart = ["milk"]` is an error, because it reassigns the name. `cart.push("milk")` is fine, because it changes the array and leaves the name alone.

**Common mistake:** trusting `const` to protect an object.

**Wrong**

```js
const defaults = { theme: "light", size: 12 };

function settingsFor(theme) {
  const settings = «defaults»;
  settings.theme = theme;
  return settings;
}

const dark = settingsFor("dark");
console.log(dark.theme);
console.log(defaults.theme);
```

**Output**

```text
dark
dark
```

**Fix**

```js
const defaults = { theme: "light", size: 12 };

function settingsFor(theme) {
  const settings = «{ ...defaults }»;
  settings.theme = theme;
  return settings;
}

const dark = settingsFor("dark");
console.log(dark.theme);
console.log(defaults.theme);
```

**Output**

```text
dark
light
```

`settings` and `defaults` held the same object, and `const` did not stop the change. Copy the object first, then change the copy.

<!-- task -->

## Remember

- `let` can be reassigned. `const` cannot: reassigning it is a `TypeError`.
- A `let` with no value holds `undefined`. A `const` with no value is a `SyntaxError`.
- Declaring the same name twice with `let` or `const` is a `SyntaxError`.
- `const` fixes the name, not the value. A `const` object or array can still change.
