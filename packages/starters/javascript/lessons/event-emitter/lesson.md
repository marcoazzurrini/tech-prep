# Event Emitter

## on and emit

**Code**

```js
class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
  }

  emit(name, ...args) {
    for (const listener of this.listeners.get(name) ?? []) {
      listener(...args);
    }
  }
}

const shop = new Emitter();
shop.on("sale", (item, price) => console.log(`email: ${item} at ${price}`));
shop.on("sale", (item) => console.log(`log: ${item}`));

shop.emit("sale", "lamp", 30);
shop.emit("refund", "lamp");
```

**Output**

```text
email: lamp at 30
log: lamp
```

**Rule:** An **event emitter** keeps a list of functions, called **listeners**, for each event name. `on(name, listener)` adds a listener to the list. `emit(name, ...args)` calls each listener of that name, in the order they were added, with the arguments.

`shop.emit("refund", "lamp")` does nothing. No listener was added for `"refund"`, so `?? []` gives an empty list.

A `Map` from name to array fits well. In a plain object, the name `"toString"` would find an inherited function.

**Common mistake:** emitting an event that has no list.

**Wrong**

```js
class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
  }

  emit(name, ...args) {
    for (const listener of «this.listeners.get(name)») {
      listener(...args);
    }
  }
}

const shop = new Emitter();
shop.on("sale", (item) => console.log(`log: ${item}`));

shop.emit("sale", "lamp");
shop.emit("refund", "lamp");
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'listener of this.listeners.get(name)')
```

**Fix**

```js
class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
  }

  emit(name, ...args) {
    for (const listener of «this.listeners.get(name) ?? []») {
      listener(...args);
    }
  }
}

const shop = new Emitter();
shop.on("sale", (item) => console.log(`log: ${item}`));

shop.emit("sale", "lamp");
shop.emit("refund", "lamp");
```

`get` gives `undefined` for a name with no list, and `for...of` cannot loop over `undefined`. An event that nobody listens to is normal. Treat it as an empty list.

<!-- task -->

## off and unsubscribe

**Code**

```js
class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
    return () => this.off(name, listener);
  }

  off(name, listener) {
    const list = this.listeners.get(name) ?? [];
    this.listeners.set(name, list.filter((item) => item !== listener));
  }

  emit(name, ...args) {
    for (const listener of this.listeners.get(name) ?? []) {
      listener(...args);
    }
  }
}

const chat = new Emitter();
const show = (text) => console.log(`show: ${text}`);
const stopBeep = chat.on("message", () => console.log("beep"));
chat.on("message", show);

chat.emit("message", "hi");
stopBeep();
chat.off("message", show);
chat.emit("message", "bye");
console.log(chat.listeners.get("message").length);
```

**Output**

```text
beep
show: hi
0
```

**Rule:** `off(name, listener)` removes a listener from the list. It finds the listener by identity, so you must pass the same function that you gave to `on`.

`on` returns an **unsubscribe** function: calling it removes that listener. The caller does not need to keep the listener in a variable.

`off` with a function that is not in the list removes nothing.

**Common mistake:** passing a new function to `off`.

**Wrong**

```js
class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
  }

  off(name, listener) {
    const list = this.listeners.get(name) ?? [];
    this.listeners.set(name, list.filter((item) => item !== listener));
  }

  emit(name, ...args) {
    for (const listener of this.listeners.get(name) ?? []) {
      listener(...args);
    }
  }
}

const chat = new Emitter();
chat.on("message", (text) => console.log(`show: ${text}`));
chat.off("message", «(text) => console.log(`show: ${text}`)»);
chat.emit("message", "bye");
```

**Output**

```text
show: bye
```

**Fix**

```js
class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
  }

  off(name, listener) {
    const list = this.listeners.get(name) ?? [];
    this.listeners.set(name, list.filter((item) => item !== listener));
  }

  emit(name, ...args) {
    for (const listener of this.listeners.get(name) ?? []) {
      listener(...args);
    }
  }
}

const chat = new Emitter();
«const show = (text) => console.log(`show: ${text}`);»
chat.on("message", «show»);
chat.off("message", «show»);
chat.emit("message", "bye");
```

Two arrow functions with the same code are two different functions. `off` compared them with `!==` and kept the first one. Keep the listener in a variable, or use what `on` returns.

<!-- task -->

## once

**Code**

```js
class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
    return () => this.off(name, listener);
  }

  off(name, listener) {
    const list = this.listeners.get(name) ?? [];
    this.listeners.set(name, list.filter((item) => item !== listener));
  }

  once(name, listener) {
    const wrapper = (...args) => {
      this.off(name, wrapper);
      listener(...args);
    };
    return this.on(name, wrapper);
  }

  emit(name, ...args) {
    for (const listener of this.listeners.get(name) ?? []) {
      listener(...args);
    }
  }
}

const game = new Emitter();
game.once("start", (level) => console.log(`welcome to level ${level}`));
game.on("start", (level) => console.log(`loading ${level}`));

game.emit("start", 1);
game.emit("start", 2);
```

**Output**

```text
welcome to level 1
loading 1
loading 2
```

**Rule:** `once(name, listener)` adds a listener that runs one time only. It adds a **wrapper**: a new function that first removes itself, then calls the listener with the arguments.

The wrapper removes itself before it calls the listener. If the listener emits the same event again, the wrapper is already gone.

`once` returns what `on` returns, so its listener can be unsubscribed before it ever runs.

**Common mistake:** removing the listener instead of the wrapper.

**Wrong**

```js
class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
  }

  off(name, listener) {
    const list = this.listeners.get(name) ?? [];
    this.listeners.set(name, list.filter((item) => item !== listener));
  }

  once(name, listener) {
    const wrapper = (...args) => {
      this.off(name, «listener»);
      listener(...args);
    };
    this.on(name, wrapper);
  }

  emit(name, ...args) {
    for (const listener of this.listeners.get(name) ?? []) {
      listener(...args);
    }
  }
}

const game = new Emitter();
game.once("start", (level) => console.log(`welcome to level ${level}`));
game.emit("start", 1);
game.emit("start", 2);
```

**Output**

```text
welcome to level 1
welcome to level 2
```

**Fix**

```js
class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
  }

  off(name, listener) {
    const list = this.listeners.get(name) ?? [];
    this.listeners.set(name, list.filter((item) => item !== listener));
  }

  once(name, listener) {
    const wrapper = (...args) => {
      this.off(name, «wrapper»);
      listener(...args);
    };
    this.on(name, wrapper);
  }

  emit(name, ...args) {
    for (const listener of this.listeners.get(name) ?? []) {
      listener(...args);
    }
  }
}

const game = new Emitter();
game.once("start", (level) => console.log(`welcome to level ${level}`));
game.emit("start", 1);
game.emit("start", 2);
```

The list holds the wrapper, not the listener. So `off` found nothing to remove, and the wrapper ran again.

<!-- task -->

## Removing while emitting

**Code**

```js
class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
  }

  off(name, listener) {
    const list = this.listeners.get(name) ?? [];
    const index = list.indexOf(listener);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  emit(name, ...args) {
    for (const listener of [...(this.listeners.get(name) ?? [])]) {
      listener(...args);
    }
  }
}

const door = new Emitter();
function chime() {
  console.log("chime");
  door.off("open", chime);
}
door.on("open", chime);
door.on("open", () => console.log("light on"));

door.emit("open");
door.emit("open");
```

**Output**

```text
chime
light on
light on
```

**Rule:** A listener may call `off` while `emit` is looping. So `emit` loops over a copy of the list. A listener removed during the loop still runs this time. A listener added during the loop waits for the next `emit`.

This `off` changes the array in place with `splice`. An `off` that builds a new array with `filter` is safe too, because the loop keeps the old array.

If a listener throws, `emit` stops there. The later listeners do not run, and the error goes to the code that called `emit`.

**Common mistake:** looping over the live array.

**Wrong**

```js
class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
  }

  off(name, listener) {
    const list = this.listeners.get(name) ?? [];
    const index = list.indexOf(listener);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  emit(name, ...args) {
    for (const listener of «this.listeners.get(name) ?? []») {
      listener(...args);
    }
  }
}

const door = new Emitter();
function chime() {
  console.log("chime");
  door.off("open", chime);
}
door.on("open", chime);
door.on("open", () => console.log("light on"));

door.emit("open");
```

**Output**

```text
chime
```

**Fix**

```js
class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
  }

  off(name, listener) {
    const list = this.listeners.get(name) ?? [];
    const index = list.indexOf(listener);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  emit(name, ...args) {
    for (const listener of «[...(this.listeners.get(name) ?? [])]») {
      listener(...args);
    }
  }
}

const door = new Emitter();
function chime() {
  console.log("chime");
  door.off("open", chime);
}
door.on("open", chime);
door.on("open", () => console.log("light on"));

door.emit("open");
```

`chime` ran at index 0 and removed itself. The light moved to index 0, and the loop went on to index 1, which was now empty. The copy does not move when the real list changes.

<!-- task -->

## Remember

- Keep a `Map` from event name to an array of listeners. `emit` calls each one with the arguments, and does nothing for a name with no list.
- `off` finds a listener by identity. `on` returns a function that unsubscribes.
- `once` adds a wrapper that removes itself, then calls the listener.
- `emit` loops over a copy, so listeners can call `off` safely. A listener that throws stops the rest.
