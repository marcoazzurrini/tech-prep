# finally

## Always runs on exit

**Code**

```js
let locked = false;

function runTask(shouldFail) {
  locked = true;
  try {
    console.log("start");
    if (shouldFail) {
      throw new Error("disk full");
    }
    console.log("done");
  } finally {
    locked = false;
    console.log("unlocked");
  }
}

runTask(false);
console.log("locked:", locked);

try {
  runTask(true);
} catch (error) {
  console.log("caught:", error.message);
}
console.log("locked:", locked);
```

**Output**

```text
start
done
unlocked
locked: false
start
unlocked
caught: disk full
locked: false
```

**Rule:** A `finally` block runs whenever code leaves `try`, whether it finished normally, caught an error or threw an uncaught one.

`try { ... } finally { ... }` needs no `catch`. It runs cleanup and lets the error keep climbing.

When a `catch` block is present, it runs before `finally`. If `catch` rethrows, `finally` still runs first.

**Common mistake:** putting cleanup after `try...catch` instead of in `finally`.

**Wrong**

```js
let locked = false;

function save(data) {
  locked = true;
  try {
    if (!data) {
      throw new Error("empty");
    }
  } catch (error) {
    throw error;
  }
  «locked = false;»
}

try {
  save("");
} catch {
  console.log("locked:", locked);
}
```

**Output**

```text
locked: true
```

**Fix**

```js
let locked = false;

function save(data) {
  locked = true;
  try {
    if (!data) {
      throw new Error("empty");
    }
  } catch (error) {
    throw error;
  } «finally {
    locked = false;
  }»
}

try {
  save("");
} catch {
  console.log("locked:", locked);
}
```

The rethrow skipped the line after `try...catch`, leaving `locked` as `true`. Putting the reset in `finally` runs it before the error leaves `save`.

<!-- task -->

## finally and return

**Code**

```js
function readDraft() {
  let status = "open";
  try {
    return status;
  } finally {
    status = "closed";
    console.log("in finally:", status);
  }
}

console.log("returned:", readDraft());
```

**Output**

```text
in finally: closed
returned: open
```

**Rule:** `finally` runs before a `return` leaves the function. The expression after `return` is evaluated before `finally` runs, so reassigning a primitive variable inside `finally` does not change the returned value.

`break` and `continue` inside a loop wait for `finally` the same way.

If `return` gives back an object, changing a property on that object inside `finally` still shows in the returned object. Both hold the same reference.

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

**Rule:** A `return`, `throw`, `break` or `continue` inside `finally` replaces whatever exit was waiting from `try` or `catch`. A `return` in `finally` silently erases an uncaught error.

`throw` inside `finally` replaces a pending `return` or `throw`. The earlier error is lost.

**Common mistake:** returning a fallback from `finally`.

**Wrong**

```js
function readLimit(config) {
  let limit = 10;
  try {
    if (config.limit <= 0) {
      throw new Error("bad limit");
    }
    limit = config.limit;
  } finally {
    «return limit;»
  }
}

try {
  console.log(readLimit({ limit: -5 }));
} catch (error) {
  console.log("caught:", error.message);
}
```

**Output**

```text
10
```

**Fix**

```js
function readLimit(config) {
  let limit = 10;
  try {
    if (config.limit <= 0) {
      throw new Error("bad limit");
    }
    limit = config.limit;
  } finally {
    console.log("checked");
  }
  «return limit;»
}

try {
  console.log(readLimit({ limit: -5 }));
} catch (error) {
  console.log("caught:", error.message);
}
```

`return` in `finally` cancelled the thrown error, so the caller got `10` instead of an error. Keep `finally` for cleanup, and return after the block.

<!-- task -->

## Remember

- `finally` runs whenever code leaves `try` or `catch`, even on `return`, `break`, `continue` or an uncaught `throw`.
- `try...finally` needs no `catch`. It runs cleanup and lets the error keep climbing.
- A `return` expression is evaluated before `finally` runs, and `finally` finishes before the caller gets the value.
- A `return` or `throw` inside `finally` replaces the pending result or error. Keep `finally` for cleanup only.
