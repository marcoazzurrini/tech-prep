# using and Symbol.dispose

## Disposed at block end

**Code**

```js
function openTab(title) {
  console.log("open " + title);
  return {
    title,
    [Symbol.dispose]() {
      console.log("close " + this.title);
    },
  };
}

{
  using tab = openTab("Inbox");
  console.log("reading " + tab.title);
}

console.log("after the block");
```

**Output**

```text
open Inbox
reading Inbox
close Inbox
after the block
```

**Rule:** `using` declares a variable like `const`. When the block ends, JavaScript calls the value's `[Symbol.dispose]()` method. To **dispose** of a resource is to clean it up: close a tab, release a lock.

`using` in a function body disposes when the function returns. The `return` value is worked out first.

`using` also works at the top level of a module. The resource is disposed when the module has finished running.

**Common mistake:** returning a resource that `using` declared.

**Wrong**

```js
function openTab(title) {
  const tab = {
    title,
    closed: false,
    [Symbol.dispose]() {
      tab.closed = true;
    },
  };
  return tab;
}

function inbox() {
  «using» tab = openTab("Inbox");
  return tab;
}

const tab = inbox();
console.log(tab.closed);
```

**Output**

```text
true
```

**Fix**

```js
function openTab(title) {
  const tab = {
    title,
    closed: false,
    [Symbol.dispose]() {
      tab.closed = true;
    },
  };
  return tab;
}

function inbox() {
  «const» tab = openTab("Inbox");
  return tab;
}

«using» tab = inbox();
console.log(tab.closed);
```

`inbox` disposed the tab as it returned, so the caller got a closed tab. Declare with `using` where the resource is last used.

<!-- task -->

## Last in, first out

**Code**

```js
function lock(name) {
  console.log("lock " + name);
  return {
    [Symbol.dispose]() {
      console.log("unlock " + name);
    },
  };
}

try {
  using cart = lock("cart");
  using stock = lock("stock");
  throw new Error("payment failed");
} catch (error) {
  console.log("caught: " + error.message);
}
```

**Output**

```text
lock cart
lock stock
unlock stock
unlock cart
caught: payment failed
```

**Rule:** Resources are disposed in reverse order: the last one declared is the first one disposed. This happens even when the block throws, before the error leaves the block.

`{ using x = r; work(); }` acts like `const x = r; try { work(); } finally { x[Symbol.dispose](); }`.

`[Symbol.dispose]()` may throw while the block is already throwing. Then a `SuppressedError` is thrown, which holds both: `error` is the new one, `suppressed` the earlier one.

<!-- task -->

## What using accepts

**Code**

```js
function findCache(name) {
  if (name === "none") {
    return null;
  }
  return {
    [Symbol.dispose]() {
      console.log("cache cleared");
    },
  };
}

{
  using cache = findCache("none");
  console.log("no cache needed");
}

try {
  using file = { name: "notes.txt" };
  console.log("never printed");
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
no cache needed
TypeError
```

**Rule:** The value of `using` must be `null`, `undefined` or an object with a `[Symbol.dispose]` method. `null` and `undefined` are skipped at the end. Any other value throws a `TypeError` at the `using` line.

`new DisposableStack()` collects resources while the code runs: `stack.use(resource)` adds one, `stack.defer(fn)` adds a cleanup function. `stack.dispose()` runs them in reverse order.

`await using` works the same way with `[Symbol.asyncDispose]`, for cleanup that must wait. Asynchronous code comes later in the course.

**Common mistake:** naming the method `dispose`.

**Wrong**

```js
const timer = {
  «dispose()» {
    console.log("timer stopped");
  },
};

try {
  using running = timer;
  console.log("timing");
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
TypeError
```

**Fix**

```js
const timer = {
  «[Symbol.dispose]()» {
    console.log("timer stopped");
  },
};

try {
  using running = timer;
  console.log("timing");
} catch (error) {
  console.log(error.name);
}
```

`using` looks only for the key `Symbol.dispose`, a built-in symbol. A method named with the string `"dispose"` does not count.

<!-- task -->

## Remember

- `using x = resource` calls `resource[Symbol.dispose]()` when the block ends.
- Several resources are disposed in reverse order, also when the block throws.
- The value must be `null`, `undefined` or have a `[Symbol.dispose]` method. Anything else throws a `TypeError`.
- Do not return a resource that `using` declared. It is disposed as the function returns.
