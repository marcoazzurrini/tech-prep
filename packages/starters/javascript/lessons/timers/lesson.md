# Timers

## Delay and arguments

**Code**

```js
function remind(name, item) {
  console.log(name + ", buy " + item);
}

setTimeout(remind, 40, "Ana", "milk");
setTimeout(remind, 0, "Ben", "bread");
console.log("reminders set");
```

**Output**

```text
reminders set
Ben, buy bread
Ana, buy milk
```

**Rule:** `setTimeout(fn, ms, ...args)` calls `fn(...args)` later, as a task, after at least `ms` milliseconds. Of two timers set together, the one with the shorter delay runs first.

The delay is a minimum, not an exact time. Even a delay of 0 waits until the current code has finished. A busy program runs the timer later still.

`setTimeout(fn)` with no delay means a delay of 0.

<!-- task -->

## Cancel with clearTimeout

**Code**

```js
const logout = setTimeout(() => console.log("logged out"), 30);

function onActivity() {
  clearTimeout(logout);
  console.log("still here");
}

setTimeout(onActivity, 10);
```

**Output**

```text
still here
```

**Rule:** `setTimeout` returns an **id** for its timer. `clearTimeout(id)` cancels that timer, so its callback never runs.

Keep the id in a variable to cancel the timer later. What the id looks like depends on where the code runs, so only pass it to `clearTimeout`.

`clearTimeout` on a timer that has already run, or on an id that is not a timer, does nothing. It does not throw.

<!-- task -->

## Repeat with setInterval

**Code**

```js
let laps = 0;

const timer = setInterval(() => {
  laps++;
  console.log("lap " + laps);

  if (laps === 3) {
    clearInterval(timer);
    console.log("race over");
  }
}, 10);
```

**Output**

```text
lap 1
lap 2
lap 3
race over
```

**Rule:** `setInterval(fn, ms)` calls `fn` every `ms` milliseconds, until `clearInterval(id)` stops it. The first call comes after `ms`, not at once.

An interval that is never cleared runs forever. It also keeps the program from ending.

A `setTimeout` that sets a new `setTimeout` at the end of its callback repeats too. It waits the full delay after each run, even when the callback is slow.

<!-- task -->

## Timers in a loop

**Code**

```js
for (let seat = 1; seat <= 3; seat++) {
  setTimeout(() => console.log("seat " + seat), seat * 20);
}
```

**Output**

```text
seat 1
seat 2
seat 3
```

**Rule:** Every callback runs after the loop has finished. With `let`, each round has its own `seat`, so each callback reads its own value.

**Common mistake:** a timer in a `var` loop.

**Wrong**

```js
for («var» seat = 1; seat <= 3; seat++) {
  setTimeout(() => console.log("seat " + seat), seat * 20);
}
```

**Output**

```text
seat 4
seat 4
seat 4
```

**Fix**

```js
for («let» seat = 1; seat <= 3; seat++) {
  setTimeout(() => console.log("seat " + seat), seat * 20);
}
```

**Output**

```text
seat 1
seat 2
seat 3
```

A `var` loop has one `seat` for all rounds. By the time the first timer runs, the loop has ended and `seat` is 4. This is the closures in loops trap, and a timer is where people meet it most.

<!-- task -->

## Remember

- `setTimeout(fn, ms, ...args)` runs `fn(...args)` once, after at least `ms`. Even 0 waits for the current code.
- `setTimeout` returns an id. `clearTimeout(id)` cancels the timer.
- `setInterval` repeats until `clearInterval(id)`. Always clear it.
- A callback runs after the loop that set it. With `var`, every callback sees the last value.
