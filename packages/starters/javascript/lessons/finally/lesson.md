# finally

## Always runs on exit

**Code**

```js
const door = { open: false };

function deliver(parcel) {
  door.open = true;
  try {
    if (parcel.weight > 20) {
      throw new Error("too heavy");
    }
    console.log("delivered");
  } finally {
    door.open = false;
    console.log("door shut");
  }
}

deliver({ weight: 5 });

try {
  deliver({ weight: 30 });
} catch (error) {
  console.log("caught: " + error.message);
}

console.log("open: " + door.open);
```

**Output**

```text
delivered
door shut
door shut
caught: too heavy
open: false
```

**Rule:** A `finally` block runs every time the code leaves `try`: when `try` finishes, and when it throws. An error that no `catch` takes climbs on after `finally` has run.

`try { ... } finally { ... }` needs no `catch`. It does the cleanup and lets the error go on up the stack.

`catch` runs before `finally`. If `catch` throws, `finally` still runs.

**Common mistake:** putting the cleanup at the end of `try`.

**Wrong**

```js
const door = { open: false };

function deliver(parcel) {
  door.open = true;
  try {
    if (parcel.weight > 20) {
      throw new Error("too heavy");
    }
    console.log("delivered");
    «door.open = false;»
  } catch (error) {
    console.log("not delivered: " + error.message);
  }
}

deliver({ weight: 30 });
console.log("open: " + door.open);
```

**Output**

```text
not delivered: too heavy
open: true
```

**Fix**

```js
const door = { open: false };

function deliver(parcel) {
  door.open = true;
  try {
    if (parcel.weight > 20) {
      throw new Error("too heavy");
    }
    console.log("delivered");
  } catch (error) {
    console.log("not delivered: " + error.message);
  } «finally {
    door.open = false;
  }»
}

deliver({ weight: 30 });
console.log("open: " + door.open);
```

The `throw` skipped the rest of `try`, so the door stayed open. In `finally`, the cleanup runs on every path.

<!-- task -->

## finally and return

**Code**

```js
function closeTicket() {
  let status = "open";

  try {
    console.log("try");
    return status;
  } finally {
    status = "closed";
    console.log("finally");
  }
}

console.log("returned " + closeTicket());
```

**Output**

```text
try
finally
returned open
```

**Rule:** A `return` in `try` first works out its value. Then `finally` runs. Then the function returns the value it already worked out.

`status = "closed"` came too late. The value `"open"` was already chosen.

`break` and `continue` in a loop wait for `finally` in the same way.

<!-- task -->

## Jumps inside finally

**Code**

```js
function pickValue() {
  try {
    return "from try";
  } finally {
    return "from finally";
  }
}

function hideError() {
  try {
    throw new Error("boom");
  } finally {
    return "fallback";
  }
}

console.log(pickValue());
console.log(hideError());
```

**Output**

```text
from finally
fallback
```

**Rule:** A `return` or `throw` inside `finally` replaces the result of `try` and `catch`. A `return` there beats the earlier `return`. It also beats an error, and the error is lost.

`throw` inside `finally` replaces an earlier `return` or error in the same way.

**Common mistake:** a `return` in `finally`.

**Wrong**

```js
const cart = { busy: false, items: [] };

function addItem(item) {
  cart.busy = true;
  try {
    if (item.price < 0) {
      throw new Error("bad price");
    }
    cart.items.push(item);
  } finally {
    cart.busy = false;
    «return cart.items.length;»
  }
}

try {
  console.log(addItem({ price: 5 }));
  console.log(addItem({ price: -1 }));
} catch (error) {
  console.log("caught: " + error.message);
}
```

**Output**

```text
1
1
```

**Fix**

```js
const cart = { busy: false, items: [] };

function addItem(item) {
  cart.busy = true;
  try {
    if (item.price < 0) {
      throw new Error("bad price");
    }
    cart.items.push(item);
    «return cart.items.length;»
  } finally {
    cart.busy = false;
  }
}

try {
  console.log(addItem({ price: 5 }));
  console.log(addItem({ price: -1 }));
} catch (error) {
  console.log("caught: " + error.message);
}
```

The `return` in `finally` threw away the error, so the bad price looked like a success. Return from `try`, and keep `finally` for cleanup.

<!-- task -->

## Remember

- `finally` runs every time the code leaves `try` or `catch`: on a normal end, a `return`, a `break` or a `throw`.
- `try...finally` needs no `catch`. It cleans up and lets the error climb on.
- A `return` value is worked out before `finally` runs.
- A `return` or `throw` in `finally` replaces the earlier result or error. Keep `finally` for cleanup.
