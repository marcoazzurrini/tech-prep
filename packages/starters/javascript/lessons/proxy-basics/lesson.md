# Proxy

## Wrapping an object

**Code**

```js
const cart = { apples: 3 };

const watched = new Proxy(cart, {
  get(target, key, receiver) {
    console.log(`read ${String(key)}`);
    return Reflect.get(target, key, receiver);
  },
});

console.log(watched.apples);
watched.pears = 2;
console.log(cart.pears);
console.log(watched === cart);
```

**Output**

```text
read apples
3
2
false
```

**Rule:** `new Proxy(target, handler)` makes a new object that stands in front of `target`. Each operation on the proxy looks for a matching method on `handler`, called a **trap**. A `get` trap runs on every read. An operation with no trap goes straight to `target`.

`get(target, key, receiver)` gets the target, the key and the proxy itself as the receiver. `Reflect.get(target, key, receiver)` does the normal read, so a getter on the target runs with the proxy as `this`.

`String(key)` is there because a key can be a symbol.

**Common mistake:** reading from the receiver inside the trap.

**Wrong**

```js
const prices = new Proxy({ tea: 3 }, {
  get(target, key, receiver) {
    return «receiver[key]»;
  },
});

console.log(prices.tea);
```

**Error**

```text
RangeError: Maximum call stack size exceeded.
```

**Fix**

```js
const prices = new Proxy({ tea: 3 }, {
  get(target, key, receiver) {
    return «Reflect.get(target, key, receiver)»;
  },
});

console.log(prices.tea);
```

`receiver` is the proxy, so `receiver[key]` ran the trap again, and again, until the stack ran out. Read from the target with `Reflect.get`.

<!-- task -->

## A default for missing keys

**Code**

```js
const votes = new Proxy({}, {
  get(target, key, receiver) {
    if (typeof key === "string" && !(key in target)) {
      return 0;
    }

    return Reflect.get(target, key, receiver);
  },
});

votes.tea += 1;
votes.tea += 1;
votes.coffee += 1;

console.log(votes.tea, votes.coffee, votes.juice);
console.log("juice" in votes);
console.log(JSON.stringify(votes));
```

**Output**

```text
2 1 0
false
{"tea":2,"coffee":1}
```

**Rule:** A `get` trap can answer for a key the target does not have. Here a missing key reads as `0`, so `votes.tea += 1` works from the first vote. The target holds only the keys that were assigned.

`"juice" in votes` is `false`. A `get` trap changes reads, not `in`.

**Common mistake:** a default for every key.

**Wrong**

```js
const votes = new Proxy({}, {
  get(target, key, receiver) {
    return «key in target» ? Reflect.get(target, key, receiver) : 0;
  },
});

console.log(`Votes: ${votes}`);
```

**Error**

```text
TypeError: Symbol.toPrimitive is not a function, undefined, or null
```

**Fix**

```js
const votes = new Proxy({}, {
  get(target, key, receiver) {
    return «typeof key === "symbol" || key in target» ? Reflect.get(target, key, receiver) : 0;
  },
});

console.log(`Votes: ${votes}`);
```

To make text of `votes`, the language reads `votes[Symbol.toPrimitive]`. The trap gave `0`, which is not a function, so the conversion threw. Leave symbol keys to the target. Chrome and Node say `number 0 is not a function`.

<!-- task -->

## Checking writes

**Code**

```js
const profile = new Proxy({}, {
  set(target, key, value, receiver) {
    if (key === "age" && !Number.isInteger(value)) {
      throw new TypeError(`age must be a whole number, not ${value}`);
    }

    return Reflect.set(target, key, value, receiver);
  },
});

profile.age = 36;
profile.name = "Ada";

try {
  profile.age = "old";
} catch (error) {
  console.log(error.message);
}

console.log(profile.age, profile.name);
```

**Output**

```text
age must be a whole number, not old
36 Ada
```

**Rule:** A `set` trap runs on every assignment. It gets the target, the key, the new value and the receiver. It must return `true` when the write worked. To refuse a value, throw your own error.

`Proxy.revocable(target, handler)` gives `{ proxy, revoke }`. After `revoke()`, every operation on that proxy throws a `TypeError`. Use it to hand out access that you can take back.

**Common mistake:** forgetting to return `true`.

**Wrong**

```js
const profile = new Proxy({}, {
  set(target, key, value) {
    «target[key] = value;»
  },
});

profile.name = "Ada";
console.log(profile.name);
```

**Error**

```text
TypeError: Proxy object's 'set' trap returned falsy value for property 'name'
```

**Fix**

```js
const profile = new Proxy({}, {
  set(target, key, value) {
    target[key] = value;
    «return true;»
  },
});

profile.name = "Ada";
console.log(profile.name);
```

The trap returned `undefined`, which counts as "the write failed". In strict mode a failed write throws, even though the target got the value. Chrome and Node say `trap returned falsish`.

<!-- task -->

## Remember

- `new Proxy(target, handler)` runs a trap from `handler` for each operation. Operations with no trap go to `target`.
- `get(target, key, receiver)` runs on reads. `set(target, key, value, receiver)` runs on writes and must return `true`.
- Forward with `Reflect.get` and `Reflect.set`. Reading `receiver[key]` in a trap runs it again, forever.
- A default for missing keys must leave symbol keys alone. `Proxy.revocable` gives a proxy that `revoke()` switches off.
