# More Proxy Traps

## in and delete

**Code**

```js
const isHidden = (key) => typeof key === "string" && key.startsWith("_");

const stock = new Proxy({ apples: 3, _cost: 1 }, {
  has(target, key) {
    return !isHidden(key) && Reflect.has(target, key);
  },
  deleteProperty(target, key) {
    return !isHidden(key) && Reflect.deleteProperty(target, key);
  },
});

console.log("apples" in stock, "_cost" in stock);
console.log(delete stock.apples, "apples" in stock);

try {
  delete stock._cost;
} catch (error) {
  console.log(error.name);
}

console.log(stock._cost);
```

**Output**

```text
true false
true false
TypeError
1
```

**Rule:** A `has` trap answers the `in` operator, and a `deleteProperty` trap answers `delete`. Each one returns a boolean. When `deleteProperty` returns `false`, `delete` throws a `TypeError` in strict mode.

`has` changes `in` and nothing else. `stock._cost` still reads `1`, and `for...in` still lists `_cost`.

`Reflect.has` and `Reflect.deleteProperty` take the same arguments as the traps, so they forward the keys you let through.

<!-- task -->

## Hiding keys from lists

**Code**

```js
const isHidden = (key) => typeof key === "string" && key.startsWith("_");

const user = new Proxy({ name: "Ada", _token: "x9" }, {
  ownKeys(target) {
    return Reflect.ownKeys(target).filter((key) => !isHidden(key));
  },
});

const looped = [];
for (const key in user) looped.push(key);

console.log(Object.keys(user).join(","));
console.log(looped.join(","));
console.log(JSON.stringify(user));
console.log(user._token);
```

**Output**

```text
name
name
{"name":"Ada"}
x9
```

**Rule:** An `ownKeys` trap answers every tool that lists keys: `Object.keys`, `for...in`, `Reflect.ownKeys`, spread and `JSON.stringify`. It returns an array of keys. Most tools then ask for the descriptor of each key, and keep only the keys they want.

`user._token` still reads `x9`. Hiding a key from lists does not stop a read.

**Common mistake:** listing keys the target does not have.

**Wrong**

```js
const week = new Proxy({}, {
  ownKeys() {
    return «["mon", "tue"]»;
  },
});

console.log(Object.keys(week).length);
```

**Output**

```text
0
```

**Fix**

```js
const week = new Proxy({}, {
  ownKeys() {
    return ["mon", "tue"];
  },
  «getOwnPropertyDescriptor() {
    return { value: "open", enumerable: true, configurable: true };
  },»
});

console.log(Object.keys(week).length);
```

**Output**

```text
2
```

`Object.keys` asked for the descriptor of each key. The target has neither key, so both were dropped. A `getOwnPropertyDescriptor` trap reports them as enumerable. It must say `configurable: true` for a key the target lacks.

<!-- task -->

## Calls and new

**Code**

```js
function add(a, b) {
  return a + b;
}

const logged = new Proxy(add, {
  apply(target, thisArg, args) {
    console.log(`add(${args.join(", ")})`);
    return Reflect.apply(target, thisArg, args);
  },
});

console.log(logged(2, 3));
console.log(typeof logged, logged.name);

let made = 0;
const CountedDate = new Proxy(Date, {
  construct(target, args, newTarget) {
    made += 1;
    return Reflect.construct(target, args, newTarget);
  },
});

const start = new CountedDate(0);
console.log(made, start instanceof Date);
```

**Output**

```text
add(2, 3)
5
function add
1 true
```

**Rule:** An `apply` trap runs when the proxy is called, and a `construct` trap runs on `new`. Both need a function as the target. `construct` must return an object.

A proxy of a function looks like the function. `typeof logged` is `"function"`, and `logged.name` is read from `add`.

**Common mistake:** an `apply` trap on a plain object.

**Wrong**

```js
const greeter = new Proxy(«{}», {
  apply() {
    return "hello";
  },
});

console.log(greeter());
```

**Error**

```text
TypeError: greeter is not a function. (In 'greeter()', 'greeter' is an instance of ProxyObject)
```

**Fix**

```js
const greeter = new Proxy(«function () {}», {
  apply() {
    return "hello";
  },
});

console.log(greeter());
```

A proxy can be called only when its target can be called, so the trap was never asked. Chrome and Node say `greeter is not a function`.

<!-- task -->

## Rules a trap must keep

**Code**

```js
const fixed = Object.freeze({ vat: 20 });
const open = { vat: 20 };
const handler = {
  get() {
    return 0;
  },
};

console.log(new Proxy(open, handler).vat);

try {
  console.log(new Proxy(fixed, handler).vat);
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
0
TypeError
```

**Rule:** A trap may not lie about a property the target has locked. For a property with `writable: false` and `configurable: false`, `get` must return the real value. These rules are called **invariants**. A trap that breaks one makes the operation throw a `TypeError`.

`has` may not hide a key with `configurable: false`, and `ownKeys` must list every such key.

**Common mistake:** wrapping a `Map` in a proxy.

**Wrong**

```js
const prices = new Map([["tea", 3]]);
const view = new Proxy(prices, «{}»);

console.log(view.get("tea"));
```

**Error**

```text
TypeError: Map operation called on non-Map object
```

**Fix**

```js
const prices = new Map([["tea", 3]]);
const view = new Proxy(prices, «{
  get(target, key) {
    const value = Reflect.get(target, key, target);
    return typeof value === "function" ? value.bind(target) : value;
  },
}»);

console.log(view.get("tea"));
```

A `Map` keeps its entries in an **internal slot**: hidden storage that only the real map has. `view.get` ran with the proxy as `this`, and the proxy has no slot. The fix runs each method on the target. A class with `#private` fields breaks the same way.

<!-- task -->

## Remember

- `has` answers `in`, `deleteProperty` answers `delete`, and `ownKeys` answers every tool that lists keys.
- A key from `ownKeys` that the target lacks needs a `getOwnPropertyDescriptor` trap, or `Object.keys` drops it.
- `apply` answers a call and `construct` answers `new`. Both need a function as the target.
- A trap may not lie about a locked property. A `Map` or a `#private` field needs the real object as `this`.
