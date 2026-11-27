# throw, try and catch

## throw climbs the stack

**Code**

```js
function readAge(user) {
  if (user.age < 0) {
    throw new Error("Age cannot be negative");
  }

  console.log("age is fine");
  return user.age;
}

function register(user) {
  const age = readAge(user);
  console.log("registered");
  return age;
}

try {
  register({ age: -3 });
  console.log("after register");
} catch (error) {
  console.log("caught: " + error.message);
}

console.log("still running");
```

**Output**

```text
caught: Age cannot be negative
still running
```

**Rule:** `throw` stops the running code at once. The error climbs the call stack, out of one call after another, until a `catch` takes it. The code that was skipped never runs.

Three pieces of code were skipped: the rest of `readAge`, the rest of `register` and the rest of the `try` block.

After the `catch` block, the program carries on below it. An error that no `catch` takes stops the whole program.

<!-- task -->

## catch gets the value

**Code**

```js
const values = ["out of tea", 404, new Error("out of milk")];

for (const value of values) {
  try {
    throw value;
  } catch (error) {
    console.log(typeof error, error === value);
  }
}
```

**Output**

```text
string true
number true
object true
```

**Rule:** `throw` takes any value, and `catch (error)` receives exactly that value. Throw an `Error` object all the same: it has a `message`, and it records where it was thrown.

`catch {` with no name in parentheses is allowed. Use it when the handler does not need the value.

`error` is a variable of the `catch` block alone. It does not exist after the block.

**Common mistake:** throwing a string.

**Wrong**

```js
function pay(amount) {
  if (amount <= 0) {
    throw «"Amount must be positive"»;
  }
}

try {
  pay(0);
} catch (error) {
  console.log(error.message);
}
```

**Output**

```text
undefined
```

**Fix**

```js
function pay(amount) {
  if (amount <= 0) {
    throw «new Error("Amount must be positive")»;
  }
}

try {
  pay(0);
} catch (error) {
  console.log(error.message);
}
```

A string has no `message`, so the handler printed `undefined`. An `Error` object carries the text in `message`.

<!-- task -->

## Rethrow the unknown

**Code**

```js
function stockOf(item) {
  if (item.stock === undefined) {
    throw new Error("unknown stock");
  }

  return item.stock;
}

function canBuy(item) {
  try {
    return stockOf(item) > 0;
  } catch (error) {
    if (error.message === "unknown stock") {
      return false;
    }

    throw error;
  }
}

console.log(canBuy({ stock: 3 }));
console.log(canBuy({}));

try {
  canBuy(null);
} catch (error) {
  console.log("rethrown: " + error.name);
}
```

**Output**

```text
true
false
rethrown: TypeError
```

**Rule:** A `catch` takes every error from its `try` block, also the ones you did not expect. Handle the error you know. **Rethrow** the others: `throw error` sends the same error on up the stack.

`canBuy(null)` is a bug in the caller. Reading `null.stock` throws a `TypeError`, and the rethrow keeps it visible.

`catch { return false; }` would answer `false` for that bug too. A `catch` that swallows everything hides mistakes.

<!-- task -->

## Only while try runs

**Code**

```js
let later;

try {
  later = () => {
    throw new Error("too late");
  };
  console.log("try finished");
} catch {
  console.log("caught inside");
}

try {
  later();
} catch (error) {
  console.log("caught outside: " + error.message);
}
```

**Output**

```text
try finished
caught outside: too late
```

**Rule:** A `try` covers only what runs while its block is running. A function that is created inside the block but called after it is not covered.

The first `try` only stored the function. It had finished long before `later()` threw.

A callback that a timer runs later is not covered either, for the same reason.

An error thrown inside a `catch` block is not caught by that same `catch`. It climbs on to the next `try` further out.

<!-- task -->

## Remember

- `throw` stops the code and climbs the stack to the nearest `catch`. Skipped code never runs.
- `catch` receives the exact value that was thrown. Throw `Error` objects.
- Handle the errors you expect, and rethrow the others with `throw error`.
- A `try` covers only what runs while its block is running.
