# Microtasks

## Two queues

**Code**

```js
console.log("start");

setTimeout(() => console.log("timer"), 0);

new Promise((resolve) => resolve()).then(() => console.log("promise"));

console.log("end");
```

**Output**

```text
start
end
promise
timer
```

**Rule:** A promise callback waits in the **microtask queue**, not in the task queue. When the current code ends, every microtask runs before the next task. So a `then` callback runs before a timer of 0 ms.

A **microtask** is a small job that runs as soon as the current code has finished, before any task. A timer callback is a task, and it waits for its turn after the microtasks.

`catch` and `finally` callbacks are microtasks too. Every promise callback goes through the microtask queue.

<!-- task -->

## queueMicrotask

**Code**

```js
const ready = new Promise((resolve) => resolve());

queueMicrotask(() => console.log("micro 1"));
ready.then(() => console.log("then 1")).then(() => console.log("then 2"));
queueMicrotask(() => console.log("micro 2"));
```

**Output**

```text
micro 1
then 1
micro 2
then 2
```

**Rule:** `queueMicrotask(fn)` puts `fn` straight into the microtask queue. Microtasks run in the order they were queued: first in, first out.

`then 2` was not queued at the start. Its promise is fulfilled only when `then 1` has run, so it joins the queue behind `micro 2`.

`queueMicrotask` returns nothing. A microtask cannot be cancelled once it is queued.

<!-- task -->

## Microtasks add microtasks

**Code**

```js
setTimeout(() => console.log("timer"), 0);

let count = 0;

function tick() {
  count += 1;
  console.log("tick " + count);
  if (count < 3) {
    queueMicrotask(tick);
  }
}

queueMicrotask(tick);
console.log("queued");
```

**Output**

```text
queued
tick 1
tick 2
tick 3
timer
```

**Rule:** The microtask queue is emptied completely before the next task. A microtask that a microtask queues runs in the same round, still before the timer.

The timer was due at once. It still had to wait for all three ticks.

A microtask that always queues another one never lets a task run. Timers never fire, and the program hangs.

<!-- task -->

## Remember

- Promise callbacks wait in the microtask queue. Timer callbacks wait in the task queue.
- When the current code ends, every microtask runs before the next task.
- `queueMicrotask(fn)` queues `fn` as a microtask. Microtasks run first in, first out.
- Microtasks queued by microtasks run in the same round, so an endless chain blocks every timer.
