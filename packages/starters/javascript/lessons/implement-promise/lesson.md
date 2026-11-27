# Writing a Promise

## State, set once

**Code**

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;

    const settle = (state, value) => {
      if (this.state !== "pending") {
        return;
      }
      this.state = state;
      this.value = value;
    };

    const resolve = (value) => settle("fulfilled", value);
    const reject = (reason) => settle("rejected", reason);
    executor(resolve, reject);
  }
}

const vote = new MyPromise((resolve, reject) => {
  resolve("yes");
  reject(new Error("too late"));
  resolve("no");
});
console.log(vote.state, vote.value);

const parcel = new MyPromise((resolve) => setTimeout(resolve, 10, "delivered"));
console.log(parcel.state);
setTimeout(() => console.log(parcel.state, parcel.value), 30);
```

**Output**

```text
fulfilled yes
pending
fulfilled delivered
```

**Rule:** A promise is an object with a **state** and a **value**. The state starts as `"pending"`. `resolve` and `reject` are two functions that change it once, to `"fulfilled"` or `"rejected"`. A call after the first one returns early and changes nothing. The constructor runs the executor at once, and hands it the two functions.

The built-in constructor also wraps the executor in `try`. A `throw` inside it rejects the promise with the error.

**Common mistake:** settling without checking the state.

**Wrong**

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;

    const settle = (state, value) => {
      «this.state = state;»
      this.value = value;
    };

    const resolve = (value) => settle("fulfilled", value);
    const reject = (reason) => settle("rejected", reason);
    executor(resolve, reject);
  }
}

const vote = new MyPromise((resolve, reject) => {
  resolve("yes");
  reject(new Error("too late"));
  resolve("no");
});
console.log(vote.state, vote.value);
```

**Output**

```text
fulfilled no
```

**Fix**

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;

    const settle = (state, value) => {
      «if (this.state !== "pending") {
        return;
      }»
      this.state = state;
      this.value = value;
    };

    const resolve = (value) => settle("fulfilled", value);
    const reject = (reason) => settle("rejected", reason);
    executor(resolve, reject);
  }
}

const vote = new MyPromise((resolve, reject) => {
  resolve("yes");
  reject(new Error("too late"));
  resolve("no");
});
console.log(vote.state, vote.value);
```

**Output**

```text
fulfilled yes
```

Each call overwrote the one before, so the last one won. A promise must keep its first result for ever, or code that has already used it would be wrong.

<!-- task -->

## then waits its turn

**Code**

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.callbacks = [];

    const resolve = (value) => {
      if (this.state !== "pending") {
        return;
      }
      this.state = "fulfilled";
      this.value = value;
      this.callbacks.forEach((callback) => queueMicrotask(callback));
    };
    executor(resolve);
  }

  then(onFulfilled) {
    const run = () => onFulfilled(this.value);
    if (this.state === "pending") {
      this.callbacks.push(run);
    } else {
      queueMicrotask(run);
    }
  }
}

const ready = new MyPromise((resolve) => resolve("tea"));
ready.then((drink) => console.log("first: " + drink));
ready.then((drink) => console.log("second: " + drink));

const later = new MyPromise((resolve) => setTimeout(resolve, 10, "cake"));
later.then((food) => console.log("later: " + food));

console.log("sync code ends");
```

**Output**

```text
sync code ends
first: tea
second: tea
later: cake
```

**Rule:** `then` never runs its callback at once. While the promise is pending, `then` saves the callback in a list. When the promise settles, it queues each saved callback with `queueMicrotask`. When the promise has already settled, `then` queues the callback straight away. So callbacks run after the current code, in the order they were added.

**Common mistake:** calling the callback at once when the promise has settled.

**Wrong**

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.callbacks = [];

    const resolve = (value) => {
      if (this.state !== "pending") {
        return;
      }
      this.state = "fulfilled";
      this.value = value;
      this.callbacks.forEach((callback) => queueMicrotask(callback));
    };
    executor(resolve);
  }

  then(onFulfilled) {
    const run = () => onFulfilled(this.value);
    if (this.state === "pending") {
      this.callbacks.push(run);
    } else {
      «run();»
    }
  }
}

const ready = new MyPromise((resolve) => resolve("tea"));
ready.then((drink) => console.log("first: " + drink));
console.log("sync code ends");
```

**Output**

```text
first: tea
sync code ends
```

**Fix**

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.callbacks = [];

    const resolve = (value) => {
      if (this.state !== "pending") {
        return;
      }
      this.state = "fulfilled";
      this.value = value;
      this.callbacks.forEach((callback) => queueMicrotask(callback));
    };
    executor(resolve);
  }

  then(onFulfilled) {
    const run = () => onFulfilled(this.value);
    if (this.state === "pending") {
      this.callbacks.push(run);
    } else {
      «queueMicrotask(run);»
    }
  }
}

const ready = new MyPromise((resolve) => resolve("tea"));
ready.then((drink) => console.log("first: " + drink));
console.log("sync code ends");
```

**Output**

```text
sync code ends
first: tea
```

With `run()`, a promise that has settled calls back at once, and a pending one calls back later. Code that uses it would run in a different order, depending on when the promise settled. A promise always calls back later.

<!-- task -->

## then returns a promise

**Code**

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.callbacks = [];

    const settle = (state, value) => {
      if (this.state !== "pending") {
        return;
      }
      this.state = state;
      this.value = value;
      this.callbacks.forEach((callback) => queueMicrotask(callback));
    };

    executor(
      (value) => settle("fulfilled", value),
      (reason) => settle("rejected", reason)
    );
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = () => {
        const fulfilled = this.state === "fulfilled";
        const callback = fulfilled ? onFulfilled : onRejected;
        if (typeof callback !== "function") {
          if (fulfilled) {
            resolve(this.value);
          } else {
            reject(this.value);
          }
          return;
        }
        try {
          resolve(callback(this.value));
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === "pending") {
        this.callbacks.push(handle);
      } else {
        queueMicrotask(handle);
      }
    });
  }
}

new MyPromise((resolve) => resolve(2))
  .then((n) => n * 10)
  .then((n) => {
    throw new Error("too big: " + n);
  })
  .then(() => console.log("skipped"))
  .then(undefined, (error) => {
    console.log("caught " + error.message);
    return "recovered";
  })
  .then((value) => console.log(value));
```

**Output**

```text
caught too big: 20
recovered
```

**Rule:** `then` returns a new promise. When the callback runs, its return value resolves the new promise, and a `throw` rejects it. That is how a chain works: each step settles the promise of the next one.

When the callback for the outcome is missing, the new promise takes the same outcome. So a rejection skips each `then` that has no `onRejected`, until one handles it.

`then` must return a new promise, not `this`. With `this`, every step would see the first value, and a step could never change it.

<!-- task -->

## Following other promises

**Code**

```js
const isThenable = (value) =>
  value !== null && (typeof value === "object" || typeof value === "function") && typeof value.then === "function";

class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.callbacks = [];

    const settle = (state, value) => {
      if (this.state !== "pending") {
        return;
      }
      this.state = state;
      this.value = value;
      this.callbacks.forEach((callback) => queueMicrotask(callback));
    };

    const follow = (value) => {
      if (!isThenable(value)) {
        settle("fulfilled", value);
        return;
      }
      queueMicrotask(() => {
        try {
          value.then(follow, (reason) => settle("rejected", reason));
        } catch (error) {
          settle("rejected", error);
        }
      });
    };

    let resolved = false;
    const resolve = (value) => {
      if (!resolved) {
        resolved = true;
        follow(value);
      }
    };

    executor(resolve);
  }

  then(onFulfilled) {
    const run = () => onFulfilled(this.value);
    if (this.state === "pending") {
      this.callbacks.push(run);
    } else {
      queueMicrotask(run);
    }
  }
}

const seat = new MyPromise((resolve) => setTimeout(resolve, 20, "seat 12"));
const booking = new MyPromise((resolve) => resolve(seat));
console.log(booking.state);
booking.then((value) => console.log("booked " + value));

const native = new MyPromise((resolve) => resolve(Promise.resolve("a built-in promise")));
native.then((value) => console.log("followed " + value));
```

**Output**

```text
pending
followed a built-in promise
booked seat 12
```

**Rule:** When `resolve` gets a **thenable**, an object with a `then` method, it does not keep it as the value. As a microtask, it calls the thenable's `then`, and the promise settles the way the thenable does. Test for a `then` method, not for `instanceof MyPromise`, so built-in promises are followed too. A `then` that returns a promise passes each callback's result to `resolve`, so a callback that returns a promise is followed as well. The `resolved` flag keeps the first `resolve` in charge while the thenable is still pending.

`catch(onRejected)` is `this.then(undefined, onRejected)`.

`finally(fn)` is `this.then((v) => { fn(); return v; }, (e) => { fn(); throw e; })`. The built-in one also waits when `fn` returns a promise.

<!-- task -->

## Remember

- A promise holds a state and a value. `resolve` and `reject` change them once, and the first call wins.
- `then` saves its callback while pending, and always runs it later, as a microtask.
- `then` returns a new promise. The callback's result resolves it, a `throw` rejects it, and a missing callback passes the outcome on.
- `resolve` follows any thenable: it calls its `then` and settles the same way.
