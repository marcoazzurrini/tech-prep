# Throttle

## Once per interval

**Code**

```js
function throttle(fn, ms) {
  let waiting = false;

  return function (...args) {
    if (waiting) {
      return;
    }

    fn.apply(this, args);
    waiting = true;
    setTimeout(() => {
      waiting = false;
    }, ms);
  };
}

const report = throttle((y) => console.log(`scrolled to ${y}`), 40);

report(100);
setTimeout(() => report(200), 10);
setTimeout(() => report(300), 20);
setTimeout(() => report(400), 60);
```

**Output**

```text
scrolled to 100
scrolled to 400
```

**Rule:** A **throttled** function runs at most once per interval of `ms`. The first call runs at once and starts the interval. Calls during the interval are dropped. The first call after it runs at once again.

Throttle suits calls that come all the time, such as scroll positions or download progress, when steady updates are wanted.

The timer only opens the gate again. It does not call `fn`.

**Common mistake:** restarting the timer at every call.

**Wrong**

```js
function throttle(fn, ms) {
  let timer;

  return function (...args) {
    if (timer === undefined) {
      fn.apply(this, args);
    }

    «clearTimeout(timer);»
    timer = setTimeout(() => {
      timer = undefined;
    }, ms);
  };
}

const report = throttle((y) => console.log(`scrolled to ${y}`), 50);

for (const at of [0, 20, 40, 60, 80, 100]) {
  setTimeout(() => report(at), at);
}
```

**Output**

```text
scrolled to 0
```

**Fix**

```js
function throttle(fn, ms) {
  let timer;

  return function (...args) {
    if (timer === undefined) {
      fn.apply(this, args);
      «timer = setTimeout(() => {»
        «timer = undefined;»
      «}, ms);»
    }
  };
}

const report = throttle((y) => console.log(`scrolled to ${y}`), 50);

for (const at of [0, 20, 40, 60, 80, 100]) {
  setTimeout(() => report(at), at);
}
```

Each call moved the end of the interval further away. With calls every 20 ms, the interval never ended. That is a debounce with a leading call, not a throttle. Start the timer only when `fn` runs.

<!-- task -->

## Keep the last call

**Code**

```js
function throttle(fn, ms) {
  let waiting = false;
  let saved = null;

  function throttled(...args) {
    if (waiting) {
      saved = { self: this, args };
      return;
    }

    fn.apply(this, args);
    waiting = true;
    setTimeout(() => {
      waiting = false;

      if (saved) {
        const { self, args: last } = saved;
        saved = null;
        throttled.apply(self, last);
      }
    }, ms);
  }

  return throttled;
}

const report = throttle((y) => console.log(`at ${y}`), 40);

report(100);
setTimeout(() => report(200), 10);
setTimeout(() => report(300), 20);
```

**Output**

```text
at 100
at 300
```

**Rule:** A **trailing call** keeps the latest call that arrives during the interval. When the interval ends, that call runs and starts a new interval. So the first call runs at once, and the last call is never lost.

`throttled.apply(self, last)` calls the throttled function, not `fn`. That starts the next interval, so the trailing call obeys the limit too.

`saved` keeps `this` with the arguments. A later call replaces both, so `200` never ran.

<!-- task -->

## Debounce or throttle

**Code**

```js
function debounce(fn, ms) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function throttle(fn, ms) {
  let waiting = false;

  return (...args) => {
    if (waiting) {
      return;
    }

    fn(...args);
    waiting = true;
    setTimeout(() => {
      waiting = false;
    }, ms);
  };
}

const d = debounce((at) => console.log(`debounce ${at}`), 60);
const t = throttle((at) => console.log(`throttle ${at}`), 60);

for (const at of [0, 40, 80, 120, 160]) {
  setTimeout(() => {
    d(at);
    t(at);
  }, at);
}
```

**Output**

```text
throttle 0
throttle 80
throttle 160
debounce 160
```

**Rule:** Both get the same calls, 40 ms apart, with `ms` of 60. The throttled function runs at a steady pace while the calls go on. The debounced function waits for a pause, so it runs once, at the end.

Pick debounce when only the final value matters, such as a search box. Pick throttle when steady updates matter, such as a progress bar.

If the calls never stop, a debounced function never runs. A throttled one keeps running, once per interval.

<!-- task -->

## Remember

- A throttled function runs at most once per interval. The first call runs at once.
- Calls during the interval are dropped, or the latest is kept as a trailing call.
- Start the timer only when `fn` runs. Restarting it at each call makes a debounce.
- Debounce waits for the calls to stop. Throttle keeps a steady pace while they go on.
