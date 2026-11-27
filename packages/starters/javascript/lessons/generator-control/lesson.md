# Talking to a Generator

## Sending values in

**Code**

```js
function* runningTotal() {
  let total = 0;

  while (true) {
    const amount = yield total;
    total += amount;
  }
}

const till = runningTotal();
console.log(till.next().value);
console.log(till.next(5).value);
console.log(till.next(10).value);
```

**Output**

```text
0
5
15
```

**Rule:** `next(value)` resumes the generator, and `value` becomes the result of the paused `yield` expression. The generator then runs to the next `yield` and hands out that value.

`const amount = yield total` works in two steps. It hands out `total` and pauses. On the next call, `amount` gets the value passed to `next`.

The first `next()` only starts the generator. No `yield` is waiting yet, so a value passed to it is lost.

**Common mistake:** sending the first value with the first `next()`.

**Wrong**

```js
function* runningTotal() {
  let total = 0;

  while (true) {
    const amount = yield total;
    total += amount;
  }
}

const till = runningTotal();
«till.next(5);»
console.log(till.next(10).value);
```

**Output**

```text
10
```

**Fix**

```js
function* runningTotal() {
  let total = 0;

  while (true) {
    const amount = yield total;
    total += amount;
  }
}

const till = runningTotal();
«till.next();»
till.next(5);
console.log(till.next(10).value);
```

**Output**

```text
15
```

The first call ran the body up to the first `yield`, with nothing waiting to receive the 5. Start the generator with a bare `next()`, then send values.

<!-- task -->

## Ending early

**Code**

```js
function* lines() {
  try {
    yield "first";
    yield "second";
    yield "third";
  } finally {
    console.log("file closed");
  }
}

const reader = lines();
console.log(reader.next().value);
console.log(JSON.stringify(reader.return("stop")));
console.log(reader.next().done);

for (const line of lines()) {
  if (line === "second") break;
}
console.log("after loop");
```

**Output**

```text
first
file closed
{"value":"stop","done":true}
true
file closed
after loop
```

**Rule:** `gen.return(value)` ends the generator at the paused `yield`, and gives `{ value, done: true }`. Every later `next()` gives `done: true`. A `finally` block around the `yield` still runs, so the generator can clean up.

`break` in a `for...of` calls `return()` for you, so the `finally` runs then too.

`return()` on a generator that has not started ends it at once. Its body never runs, so its `finally` does not run either.

**Common mistake:** cleaning up after the last `yield`.

**Wrong**

```js
function* lines() {
  console.log("file opened");
  yield "first";
  yield "second";
  «console.log("file closed");»
}

for (const line of lines()) {
  if (line === "first") break;
}
```

**Output**

```text
file opened
```

**Fix**

```js
function* lines() {
  console.log("file opened");
  «try {»
    yield "first";
    yield "second";
  «} finally {»
    console.log("file closed");
  «}»
}

for (const line of lines()) {
  if (line === "first") break;
}
```

**Output**

```text
file opened
file closed
```

The `break` ended the generator at its first `yield`, so the code after the last `yield` never ran. A `finally` block runs on every way out.

<!-- task -->

## Throwing an error in

**Code**

```js
function* orders() {
  while (true) {
    try {
      const item = yield "ready";
      console.log("order " + item);
    } catch (error) {
      console.log("skipped: " + error.message);
    }
  }
}

const desk = orders();
desk.next();
desk.next("tea");
console.log(desk.throw(new Error("sold out")).value);
desk.next("cake");
```

**Output**

```text
order tea
skipped: sold out
ready
order cake
```

**Rule:** `gen.throw(error)` throws `error` at the paused `yield`. If the generator catches it, it runs on to the next `yield`, and `throw()` returns that result. If not, the error comes out of the `throw()` call, and the generator is done.

`throw()` on a generator that has not started throws at once, outside its body. No `catch` inside can see it.

**Common mistake:** a `try` around the whole loop.

**Wrong**

```js
function* orders() {
  «try» {
    while (true) {
      const item = yield "ready";
      console.log("order " + item);
    }
  } catch (error) {
    console.log("skipped: " + error.message);
  }
}

const desk = orders();
desk.next();
desk.throw(new Error("sold out"));
console.log(desk.next("cake").done);
```

**Output**

```text
skipped: sold out
true
```

**Fix**

```js
function* orders() {
  while (true) {
    «try» {
      const item = yield "ready";
      console.log("order " + item);
    } catch (error) {
      console.log("skipped: " + error.message);
    }
  }
}

const desk = orders();
desk.next();
desk.throw(new Error("sold out"));
console.log(desk.next("cake").done);
```

**Output**

```text
skipped: sold out
order cake
false
```

The `catch` sat outside the loop. After it ran, the body ended, so the generator was done. With the `try` inside the loop, the loop goes on.

<!-- task -->

## Remember

- `next(value)` makes `value` the result of the paused `yield`. The first `next()` only starts the generator, and its value is lost.
- `return(value)` ends the generator and gives `{ value, done: true }`.
- `throw(error)` throws at the paused `yield`. The generator can catch it and go on.
- A `finally` around the `yield` runs on every way out, `break` included.
