# Errors with await

## try around await

**Code**

```js
const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

async function pay(amount) {
  try {
    await fail(10, "card declined");
    console.log("paid " + amount);
  } catch (error) {
    console.log("caught: " + error.message);
  }
  return "done";
}

pay(30).then((status) => console.log(status));
```

**Output**

```text
caught: card declined
done
```

**Rule:** When the promise rejects, `await` throws the reason at that line. So `try` and `catch` around `await` work just as they do around code that does not wait. The lines after the `await` in `try` never run.

`await Promise.all(list)` throws the first rejection. One `try` covers every promise in the list.

<!-- task -->

## return await in try

**Code**

```js
const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

async function withoutAwait() {
  try {
    return fail(10, "no profile");
  } catch {
    return "guest";
  }
}

async function withAwait() {
  try {
    return await fail(30, "no profile");
  } catch {
    return "guest";
  }
}

withoutAwait().then(
  (name) => console.log("without await: " + name),
  (error) => console.log("without await, it escaped: " + error.message)
);
withAwait().then((name) => console.log("with await: " + name));
```

**Output**

```text
without await, it escaped: no profile
with await: guest
```

**Rule:** `return promise` inside `try` leaves the `try` at once, while the promise is still pending. When it rejects later, the `catch` is long gone. `return await promise` waits inside `try`, so the `catch` gets the error.

Outside `try`, `return promise` and `return await promise` give the same result. The `await` only matters inside `try`.

A `const result = promise;` without `await` lets the error escape the `try` in the same way.

<!-- task -->

## catch on the call

**Code**

```js
const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

async function loadPrices() {
  await fail(10, "price list is offline");
  return [3, 4];
}

async function showMenu() {
  const prices = await loadPrices();
  console.log("menu with " + prices.length + " prices");
}

showMenu().catch((error) => console.log("menu failed: " + error.message));
```

**Output**

```text
menu failed: price list is offline
```

**Rule:** Without a `try`, an error in an `async` function rejects its promise. Each `await` on that promise throws it again in the caller, like a `throw` climbing the call stack. At the top, a `catch` on the returned promise takes it.

`await loadPrices().catch(() => [])` gives a fallback for that one call. The rest of the function goes on.

End every chain of calls with a `catch`. A rejection that nothing handles is reported as an unhandled rejection.

<!-- task -->

## finally cleans up

**Code**

```js
const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

const screen = { loading: false };

async function refresh(source) {
  screen.loading = true;
  try {
    const news = await source;
    console.log("showing " + news);
  } catch (error) {
    console.log("could not refresh: " + error.message);
  } finally {
    screen.loading = false;
    console.log("loading: " + screen.loading);
  }
}

refresh(delay(10, "headlines")).then(() => refresh(fail(10, "offline")));
```

**Output**

```text
showing headlines
loading: false
could not refresh: offline
loading: false
```

**Rule:** In an `async` function, `finally` runs once the awaited promise has settled, whether it fulfilled or rejected. Put the cleanup there, such as clearing a flag.

**Common mistake:** cleanup on the last line of the function.

**Wrong**

```js
const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

const screen = { loading: false };

async function refresh(source) {
  screen.loading = true;
  const news = await source;
  console.log("showing " + news);
  «screen.loading = false;»
}

refresh(fail(10, "offline"))
  .catch((error) => console.log("failed: " + error.message))
  .then(() => console.log("loading: " + screen.loading));
```

**Output**

```text
failed: offline
loading: true
```

**Fix**

```js
const fail = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));

const screen = { loading: false };

async function refresh(source) {
  screen.loading = true;
  «try {»
    const news = await source;
    console.log("showing " + news);
  «} finally {»
    «screen.loading = false;»
  «}»
}

refresh(fail(10, "offline"))
  .catch((error) => console.log("failed: " + error.message))
  .then(() => console.log("loading: " + screen.loading));
```

The `await` threw, so the last line never ran and the flag stayed `true`. `try...finally` clears it on every path and still lets the error reach the caller.

<!-- task -->

## Remember

- `await` throws when its promise rejects. Wrap it in `try` and `catch`.
- Inside `try`, write `return await`. A promise returned without `await` rejects after the `try` has ended.
- Without `try`, the rejection climbs to the caller. End the chain with `catch`.
- `finally` runs after the awaited promise settles, either way. Put cleanup there.
