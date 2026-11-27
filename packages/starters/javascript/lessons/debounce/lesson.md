# Debounce

## Wait for a pause

**Code**

```js
function debounce(fn, ms) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const search = debounce((text) => console.log(`search: ${text}`), 30);

search("c");
setTimeout(() => search("ca"), 10);
setTimeout(() => search("cat"), 20);
setTimeout(() => search("dog"), 80);
```

**Output**

```text
search: cat
search: dog
```

**Rule:** A **debounced** function waits until the calls stop. Each call cancels the timer of the call before and starts a new one. So `fn` runs once per **burst**, `ms` after its last call. A burst is a run of calls less than `ms` apart.

Here `"cat"` comes at 20 ms and runs at 50 ms. `"dog"` comes after a pause, so it starts a new burst.

A search box is the classic case: search once the user stops typing.

**Common mistake:** starting a timer without cancelling the one before.

**Wrong**

```js
function debounce(fn, ms) {
  return (...args) => {
    «setTimeout(() => fn(...args), ms);»
  };
}

const search = debounce((text) => console.log(`search: ${text}`), 30);

search("c");
setTimeout(() => search("ca"), 10);
setTimeout(() => search("cat"), 20);
```

**Output**

```text
search: c
search: ca
search: cat
```

**Fix**

```js
function debounce(fn, ms) {
  «let timer;»

  return (...args) => {
    «clearTimeout(timer);»
    «timer = setTimeout(() => fn(...args), ms);»
  };
}

const search = debounce((text) => console.log(`search: ${text}`), 30);

search("c");
setTimeout(() => search("ca"), 10);
setTimeout(() => search("cat"), 20);
```

**Output**

```text
search: cat
```

Every call started its own timer, so every call ran, only later. Keep the timer's id in the closure, so the next call can cancel it.

<!-- task -->

## Latest arguments and this

**Code**

```js
function debounce(fn, ms) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

const editor = {
  file: "notes.txt",
  save: debounce(function (text) {
    console.log(`${this.file}: ${text}`);
  }, 30),
};

editor.save("H");
editor.save("Hi");
editor.save("Hi!");
```

**Output**

```text
notes.txt: Hi!
```

**Rule:** The returned function must be a regular function, so it gets `this` from its call. The arrow function in `setTimeout` keeps that `this` and that call's `args`, and hands both to `fn` with `apply`. Only the last call's arguments reach `fn`.

Each call makes a new arrow function with its own `args`. The earlier ones are cancelled with their timers.

**Common mistake:** handing `fn` itself to `setTimeout`.

**Wrong**

```js
function debounce(fn, ms) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(«fn», ms);
  };
}

const search = debounce((text) => console.log(`search: ${text}`), 30);

search("cat");
```

**Output**

```text
search: undefined
```

**Fix**

```js
function debounce(fn, ms) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(«() => fn.apply(this, args)», ms);
  };
}

const search = debounce((text) => console.log(`search: ${text}`), 30);

search("cat");
```

**Output**

```text
search: cat
```

`setTimeout(fn, ms)` calls `fn` later with no arguments, and not as a method. So `text` was `undefined`. Wrap the call in an arrow function that passes on `this` and `args`.

<!-- task -->

## Cancel a waiting call

**Code**

```js
function debounce(fn, ms) {
  let timer;

  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  }

  debounced.cancel = () => clearTimeout(timer);

  return debounced;
}

const save = debounce((text) => console.log(`saved ${text}`), 30);

save("draft");
setTimeout(() => save.cancel(), 10);
setTimeout(() => save("final"), 50);
```

**Output**

```text
saved final
```

**Rule:** `cancel` clears the waiting timer, so the waiting call never runs. The debounced function still works after it. Use it when the work is no longer wanted, such as a form that closes before it saves.

A function is an object, so `cancel` can be a property of the function itself.

Another common extra is `flush`: it runs the waiting call at once, instead of dropping it.

<!-- task -->

## Run at the start

**Code**

```js
function debounce(fn, ms, { leading = false } = {}) {
  let timer;

  return function (...args) {
    const callNow = leading && timer === undefined;

    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;

      if (!leading) {
        fn.apply(this, args);
      }
    }, ms);

    if (callNow) {
      fn.apply(this, args);
    }
  };
}

const pay = debounce((n) => console.log(`pay ${n}`), 30, { leading: true });

pay(1);
setTimeout(() => pay(2), 10);
setTimeout(() => pay(3), 20);
setTimeout(() => pay(4), 80);
```

**Output**

```text
pay 1
pay 4
```

**Rule:** With `leading: true`, the first call of a burst runs at once, and the calls after it are dropped. The timer only marks the end of the burst: it is set back to `undefined` after `ms` with no calls. The next call then starts a new burst.

Leading suits a button that must react at once and ignore a double click. Trailing, the default, suits work that needs the final value.

Each dropped call restarts the timer. So steady calls, closer than `ms`, keep the burst going, and only the first one runs.

<!-- task -->

## Remember

- A debounced function runs `fn` once, `ms` after the last call of a burst.
- Each call clears the timer before and starts a new one. Keep the id in the closure.
- Return a regular function, and call `fn.apply(this, args)` with the latest arguments.
- `cancel` drops the waiting call. `leading: true` runs the first call of a burst instead of the last.
