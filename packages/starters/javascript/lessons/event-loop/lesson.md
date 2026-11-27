# The Event Loop

## Wait for an empty stack

**Code**

```js
console.log("order placed");
setTimeout(() => console.log("email sent"), 0);
console.log("receipt printed");
```

**Output**

```text
order placed
receipt printed
email sent
```

**Rule:** JavaScript runs one thing at a time, on one call stack. `setTimeout(fn, 0)` does not call `fn` now. It puts `fn` in the **task queue**, and the **event loop** runs it once the call stack is empty.

A **task** is a function that waits in the task queue. The task queue is a line: tasks run in the order they joined it.

The **event loop** repeats one step forever: when the stack is empty, take the next task and run it.

`Promise.resolve().then(fn)` also runs `fn` later, but before any waiting timer. The lesson on microtasks explains why.

<!-- task -->

## Nothing interrupts code

**Code**

```js
setTimeout(() => console.log("timer"), 0);

let total = 0;
for (let i = 1; i <= 5_000_000; i++) {
  total += i;
}

console.log("loop done: " + total);
```

**Output**

```text
loop done: 12500002500000
timer
```

**Rule:** A callback never runs while other code is running. The timer was due at once, but it waited for the whole loop to finish.

A long loop delays every task in the queue. Nothing else can happen until it ends.

**Common mistake:** waiting in a loop for a callback.

**Wrong**

```js
let paid = false;
setTimeout(() => {
  paid = true;
}, 0);

let checks = 0;
«while (!paid && checks < 1_000_000) {»
  checks++;
}

console.log(paid, checks);
```

**Output**

```text
false 1000000
```

**Fix**

```js
let paid = false;
setTimeout(() => {
  paid = true;
  «console.log(paid);»
}, 0);
```

**Output**

```text
true
```

The loop held the stack, so the callback could never run and `paid` never changed. Put the code that needs the result inside the callback.

<!-- task -->

## Run to completion

**Code**

```js
setTimeout(() => {
  console.log("task 1: start");
  setTimeout(() => console.log("task 2"), 0);
  console.log("task 1: end");
}, 0);

console.log("script: end");
```

**Output**

```text
script: end
task 1: start
task 1: end
task 2
```

**Rule:** Each task runs to its end before the next task starts. This is called **run to completion**.

The whole file runs first, as one task. A timer set inside a task joins the back of the queue. It waits until the current task has finished.

No other code can run in the middle of a task. So a function can read a variable and change it, and no other task can change it in between.

<!-- task -->

## Remember

- JavaScript runs one thing at a time, on one call stack.
- A callback waits in the task queue until the call stack is empty.
- Nothing interrupts running code. A long loop delays every task.
- Each task runs to completion before the next one starts.
