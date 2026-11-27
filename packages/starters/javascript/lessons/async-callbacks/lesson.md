# Asynchronous Callbacks

## Pass the next step in

**Code**

```js
function getPrice(item, callback) {
  setTimeout(() => callback(item.length * 2), 20);
}

getPrice("tea", (price) => console.log("tea costs " + price));
console.log("asked for the price");
```

**Output**

```text
asked for the price
tea costs 6
```

**Rule:** An **asynchronous** function starts some work and returns at once, before the work is done. It takes a **callback**, and calls it later with the result.

`getPrice` returned straight away. The rest of the file ran, and only then did the timer call the callback.

**Common mistake:** returning the result from inside the timer.

**Wrong**

```js
function getPrice(item) {
  setTimeout(() => {
    «return item.length * 2;»
  }, 20);
}

const price = getPrice("tea");
console.log("tea costs " + price);
```

**Output**

```text
tea costs undefined
```

**Fix**

```js
function getPrice(item, «callback») {
  setTimeout(() => {
    «callback(item.length * 2);»
  }, 20);
}

getPrice("tea", (price) => console.log("tea costs " + price));
```

**Output**

```text
tea costs 6
```

The `return` went back to the timer, which ignores it. `getPrice` itself had already returned `undefined`. A result that comes later can only be handed to a callback.

<!-- task -->

## The error comes first

**Code**

```js
const stock = { tea: 4 };

function countStock(item, callback) {
  setTimeout(() => {
    if (!(item in stock)) {
      callback(new Error("unknown item: " + item));
      return;
    }

    callback(null, stock[item]);
  }, 10);
}

function show(error, count) {
  if (error) {
    console.log("failed: " + error.message);
    return;
  }

  console.log("in stock: " + count);
}

countStock("tea", show);
setTimeout(countStock, 30, "jam", show);
```

**Output**

```text
in stock: 4
failed: unknown item: jam
```

**Rule:** By convention, the callback takes the error first: `callback(error, result)`. On failure, the function calls `callback(error)`. On success, it calls `callback(null, result)`.

This is an **error-first callback**. The caller checks `error` before it touches the result.

**Common mistake:** no `return` after handling the error.

**Wrong**

```js
function show(error, count) {
  if (error) {
    console.log("failed: " + error.message);
  }

  «console.log("in stock: " + count);»
}

show(new Error("unknown item: jam"));
```

**Output**

```text
failed: unknown item: jam
in stock: undefined
```

**Fix**

```js
function show(error, count) {
  if (error) {
    console.log("failed: " + error.message);
    «return;»
  }

  console.log("in stock: " + count);
}

show(new Error("unknown item: jam"));
```

**Output**

```text
failed: unknown item: jam
```

Without the `return`, the code went on to the success path with no result.

<!-- task -->

## try cannot wait

**Code**

```js
function loadUser(id, callback) {
  setTimeout(() => callback(null, { id, name: "Ana" }), 10);
}

try {
  loadUser(7, (error, user) => {
    try {
      console.log(user.address.city);
    } catch (problem) {
      console.log("caught inside: " + problem.name);
    }
  });
  console.log("try finished");
} catch {
  console.log("caught outside");
}
```

**Output**

```text
try finished
caught inside: TypeError
```

**Rule:** A `try` around an asynchronous call cannot catch an error thrown in its callback. The `try` has finished before the callback runs.

Only a `try` inside the callback can catch it. Without one, the error would stop the program.

This is why asynchronous functions pass errors to the callback instead of throwing them. Nobody is left to catch a `throw`.

<!-- task -->

## Nesting and trust

**Code**

```js
function step(name, callback) {
  setTimeout(() => {
    console.log(name);
    callback();
  }, 10);
}

step("find the user", () => {
  step("load the cart", () => {
    step("charge the card", () => {
      console.log("done");
    });
  });
});
```

**Output**

```text
find the user
load the cart
charge the card
done
```

**Rule:** Each step that needs the step before it goes one level deeper. With error checks at each level, this grows fast. It is called **callback hell**.

There is a second problem, called **inversion of control**. You hand your callback to code you do not control. It might call it twice, never, or before it returns. Promises were made to solve both problems.

**Common mistake:** trusting a callback to run once.

**Wrong**

```js
function charge(amount, callback) {
  callback("charged " + amount);
  «callback("charged " + amount);»
}

charge(30, (receipt) => console.log("email: " + receipt));
```

**Output**

```text
email: charged 30
email: charged 30
```

**Fix**

```js
function charge(amount, callback) {
  callback("charged " + amount);
  callback("charged " + amount);
}

«let sent = false;»

charge(30, (receipt) => {
  «if (sent) return;»
  «sent = true;»
  console.log("email: " + receipt);
});
```

**Output**

```text
email: charged 30
```

A bug in `charge` sent two emails. The caller cannot fix `charge`, so it has to guard its own callback.

<!-- task -->

## Remember

- An asynchronous function returns at once, and calls its callback later with the result.
- Error first: `callback(error)` on failure, `callback(null, result)` on success. Check `error`, then `return`.
- A `try` around the call cannot catch an error thrown later, in the callback.
- Nested callbacks get deep, and you must trust the code that calls them. Promises fix both.
