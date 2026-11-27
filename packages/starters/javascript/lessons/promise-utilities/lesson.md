# Timeout and Retry

## sleep

**Code**

```js
const sleep = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

async function makeTea() {
  console.log("boil water");
  await sleep(20);
  console.log("add tea");
  const cup = await sleep(20, "cup of tea");
  console.log("ready: " + cup);
}

makeTea();
console.log("waiting");
```

**Output**

```text
boil water
waiting
add tea
ready: cup of tea
```

**Rule:** `sleep(ms, value)` returns a promise that fulfils with `value` after `ms` milliseconds. `await sleep(ms)` pauses the `async` function for that long. The rest of the program goes on.

`setTimeout(resolve, ms, value)` passes its third argument to `resolve` when the timer fires.

**Common mistake:** calling `resolve` instead of passing it.

**Wrong**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(«resolve()», ms));

setTimeout(() => console.log("timer at 30 ms"), 30);
sleep(50).then(() => console.log("slept 50 ms"));
```

**Output**

```text
slept 50 ms
timer at 30 ms
```

**Fix**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(«resolve», ms));

setTimeout(() => console.log("timer at 30 ms"), 30);
sleep(50).then(() => console.log("slept 50 ms"));
```

**Output**

```text
timer at 30 ms
slept 50 ms
```

`resolve()` ran at once, while `sleep` was building its timer. So the promise fulfilled at once, and the timer got `undefined` as its callback. Pass the function itself.

<!-- task -->

## Timeouts that clean up

**Code**

```js
const sleep = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

function timeout(promise, ms) {
  let timer;
  const limit = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      console.log("time is up");
      reject(new Error("timed out"));
    }, ms);
  });

  return Promise.race([promise, limit]).finally(() => clearTimeout(timer));
}

timeout(sleep(10, "fast reply"), 40).then((reply) => console.log(reply));
timeout(sleep(50, "slow reply"), 20).catch((error) => console.log(error.message));
```

**Output**

```text
fast reply
time is up
timed out
```

**Rule:** `timeout(promise, ms)` races the work against a timer that rejects, as in the lesson on `Promise.race`. Whichever settles first decides the result. Then `finally` calls `clearTimeout`, so the timer does not fire after the work has won.

`clearTimeout(timer)` cancels the timer. Without it, the timer fires anyway, and its callback stays in memory until then.

`finally` passes the value or the error on unchanged, so the caller still gets the result.

**Common mistake:** leaving the timer running.

**Wrong**

```js
const sleep = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

function timeout(promise, ms) {
  let timer;
  const limit = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      console.log("time is up");
      reject(new Error("timed out"));
    }, ms);
  });

  return Promise.race([promise, limit]);
}

timeout(sleep(10, "fast reply"), 40).then((reply) => console.log(reply));
```

**Output**

```text
fast reply
time is up
```

**Fix**

```js
const sleep = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

function timeout(promise, ms) {
  let timer;
  const limit = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      console.log("time is up");
      reject(new Error("timed out"));
    }, ms);
  });

  return Promise.race([promise, limit])«.finally(() => clearTimeout(timer))»;
}

timeout(sleep(10, "fast reply"), 40).then((reply) => console.log(reply));
```

**Output**

```text
fast reply
```

The reply won after 10 ms, but the timer still fired at 40 ms. Its rejection went nowhere. With a timeout around every request, those stray timers add up.

<!-- task -->

## Try again on failure

**Code**

```js
async function retry(fn, times) {
  let lastError;
  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log("attempt " + attempt + ": " + error.message);
    }
  }
  throw lastError;
}

let calls = 0;
async function connect() {
  calls += 1;
  if (calls < 3) {
    throw new Error("busy");
  }
  return "connected";
}

retry(connect, 5).then((result) => console.log(result));
```

**Output**

```text
attempt 1: busy
attempt 2: busy
connected
```

**Rule:** `retry(fn, times)` calls `fn` in a loop. The first success is returned at once. A failure is caught, and the loop calls `fn` again. After `times` failures, `retry` throws the last error.

`retry` takes a function, not a promise. A promise is work that has already started, and it settles only once. Each call of `fn` starts the work again.

**Common mistake:** `return` without `await` inside `try`.

**Wrong**

```js
async function retry(fn, times) {
  let lastError;
  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      «return fn();»
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

let calls = 0;
async function connect() {
  calls += 1;
  if (calls < 3) {
    throw new Error("busy");
  }
  return "connected";
}

retry(connect, 5)
  .then((result) => console.log(result))
  .catch((error) => console.log("failed: " + error.message));
```

**Output**

```text
failed: busy
```

**Fix**

```js
async function retry(fn, times) {
  let lastError;
  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      «return await fn();»
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

let calls = 0;
async function connect() {
  calls += 1;
  if (calls < 3) {
    throw new Error("busy");
  }
  return "connected";
}

retry(connect, 5)
  .then((result) => console.log(result))
  .catch((error) => console.log("failed: " + error.message));
```

**Output**

```text
connected
```

`return fn()` left the `try` while the promise was still pending. It rejected after the `catch` was gone, so the first failure ended `retry`. `return await` waits inside the `try`.

<!-- task -->

## Wait between tries

**Code**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retry(fn, times, ms) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === times) {
        throw error;
      }
      console.log("wait " + ms + " ms");
      await sleep(ms);
    }
  }
}

let ready = false;
setTimeout(() => {
  ready = true;
}, 20);

async function ping() {
  if (!ready) {
    throw new Error("not ready");
  }
  return "pong";
}

retry(ping, 3, 40).then((reply) => console.log(reply));
```

**Output**

```text
wait 40 ms
pong
```

**Rule:** A service that is busy now is often fine a moment later. So `retry` sleeps between attempts. After the last attempt it throws at once, because there is nothing left to wait for.

To wait longer each time, double the pause: `await sleep(ms * 2 ** (attempt - 1))`. This is called **backoff**.

**Common mistake:** calling `sleep` without `await`.

**Wrong**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retry(fn, times, ms) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === times) {
        throw error;
      }
      «sleep(ms);»
    }
  }
}

let ready = false;
setTimeout(() => {
  ready = true;
}, 20);

async function ping() {
  if (!ready) {
    throw new Error("not ready");
  }
  return "pong";
}

retry(ping, 3, 40)
  .then((reply) => console.log(reply))
  .catch((error) => console.log("failed: " + error.message));
```

**Output**

```text
failed: not ready
```

**Fix**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retry(fn, times, ms) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === times) {
        throw error;
      }
      «await sleep(ms);»
    }
  }
}

let ready = false;
setTimeout(() => {
  ready = true;
}, 20);

async function ping() {
  if (!ready) {
    throw new Error("not ready");
  }
  return "pong";
}

retry(ping, 3, 40)
  .then((reply) => console.log(reply))
  .catch((error) => console.log("failed: " + error.message));
```

**Output**

```text
pong
```

Without `await`, the timer started but nothing waited for it. All three attempts ran before the service was ready.

<!-- task -->

## Remember

- `sleep(ms)` is a promise around `setTimeout(resolve, ms)`. Pass `resolve`, do not call it.
- A timeout races the work against a timer that rejects. Clear the timer in `finally`.
- `retry` takes a function and calls it in a loop. Use `return await` inside `try`, and throw the last error.
- Sleep between attempts, never after the last one. Doubling the pause is backoff.
