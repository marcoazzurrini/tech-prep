# What Runs When

## Sync, microtasks, then tasks

**Code**

```js
console.log("script start");

setTimeout(() => console.log("timer"), 0);

new Promise((resolve) => {
  console.log("executor");
  resolve();
}).then(() => console.log("then"));

queueMicrotask(() => console.log("microtask"));

console.log("script end");
```

**Output**

```text
script start
executor
script end
then
microtask
timer
```

**Rule:** To find the order of output, work in rounds. First run all the synchronous code, top to bottom. Then run every microtask, in the order they were queued. Then run one task, such as a timer, and empty the microtask queue again.

The executor of `new Promise` is synchronous code. The microtasks are the callbacks of `then`, `catch`, `finally` and `queueMicrotask`, and the code after an `await`.

A `setTimeout` callback is a task. Of two timers set together, the one with the shorter delay runs first.

<!-- task -->

## await splits a function

**Code**

```js
async function checkout() {
  console.log("checkout: start");
  await null;
  console.log("checkout: after await");
}

console.log("script: start");
checkout();
Promise.resolve().then(() => console.log("then callback"));
console.log("script: end");
```

**Output**

```text
script: start
checkout: start
script: end
checkout: after await
then callback
```

**Rule:** The code before the first `await` runs at once, as part of the call. At the `await`, the function stops and the caller goes on. The rest of the function runs later, as a microtask.

The rest of `checkout` was queued when its `await` ran. That was before the `then` callback was queued, so it ran first.

`await` on a promise that is still pending queues the rest only when that promise settles.

<!-- task -->

## After every task

**Code**

```js
setTimeout(() => {
  console.log("task 1 starts");
  setTimeout(() => console.log("task 2"), 0);
  Promise.resolve().then(() => console.log("microtask from task 1"));
  console.log("task 1 ends");
}, 0);

Promise.resolve().then(() => console.log("microtask from the script"));
```

**Output**

```text
microtask from the script
task 1 starts
task 1 ends
microtask from task 1
task 2
```

**Rule:** The event loop empties the microtask queue after every task, not only after the script. A microtask queued inside a task runs as soon as that task ends, before the next task starts.

The script itself is the first task. That is why its microtask ran before the timer.

Even when two timers are due at the same moment, the microtasks queued by the first one run before the second one starts.

<!-- task -->

## Taking turns

**Code**

```js
async function pack(name) {
  console.log(name + ": step 1");
  await null;
  console.log(name + ": step 2");
  await null;
  console.log(name + ": step 3");
}

pack("Ana");
pack("Ben");
```

**Output**

```text
Ana: step 1
Ben: step 1
Ana: step 2
Ben: step 2
Ana: step 3
Ben: step 3
```

**Rule:** An `await` on a value that is ready sends the rest of its function to the back of the microtask queue. So two `async` functions take turns, one step each. A chain of `then` calls works the same way: each `then` waits one turn.

A promise that is resolved with another promise, as with `return promise` inside a `then` callback, takes extra turns. Do not try to count them.

**Common mistake:** a check and a change with an `await` between them.

**Wrong**

```js
let seats = 1;

async function book(name) {
  const free = seats;
  await null;
  if («free» > 0) {
    seats = «free - 1»;
    console.log(name + " booked");
  }
}

book("Ana");
book("Ben");
```

**Output**

```text
Ana booked
Ben booked
```

**Fix**

```js
let seats = 1;

async function book(name) {
  await null;
  if («seats» > 0) {
    seats = «seats - 1»;
    console.log(name + " booked");
  }
}

book("Ana");
book("Ben");
```

**Output**

```text
Ana booked
```

Both calls read `seats` before either one changed it, because the `await` let the other one run. Code between two `await`s runs without a break, so read and change the value in the same step.

<!-- task -->

## Remember

- First all synchronous code, then every microtask, then one task, then every microtask again.
- An `async` function runs at once up to its first `await`. The rest is a microtask.
- The microtask queue is emptied after every task, timers included.
- Each `await` and each `then` waits one turn, so async functions take turns. Do not count turns through `return promise`.
