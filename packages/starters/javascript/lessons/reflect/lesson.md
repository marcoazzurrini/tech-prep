# Reflect

## Operators as functions

**Code**

```js
const lamp = { name: "Lamp", price: 40 };

console.log(Reflect.get(lamp, "name"));
console.log(Reflect.set(lamp, "price", 35), lamp.price);
console.log(Reflect.has(lamp, "price"), Reflect.has(lamp, "toString"));
console.log(Reflect.deleteProperty(lamp, "price"), "price" in lamp);
console.log(Reflect.defineProperty(lamp, "sku", { value: "L1" }), lamp.sku);
console.log(Reflect.ownKeys(lamp).join(","));
```

**Output**

```text
Lamp
true 35
true true
true false
true L1
name,sku
```

**Rule:** `Reflect` is a plain object that holds the basic operations on objects as functions. `Reflect.get` reads like `obj[key]`, `Reflect.set` assigns like `=`, `Reflect.has` asks like `in`, and `Reflect.deleteProperty` removes like `delete`. Each one takes the object first.

`Reflect.defineProperty` works like `Object.defineProperty`, but it returns a boolean, not the object.

`Reflect.get(5, "toFixed")` throws a `TypeError`. A `Reflect` function takes objects only, where `(5).toFixed` works.

<!-- task -->

## false, not an error

**Code**

```js
const order = Object.freeze({ total: 20 });

console.log(Reflect.set(order, "total", 0));
console.log(Reflect.deleteProperty(order, "total"));
console.log(Reflect.defineProperty(order, "paid", { value: true }));

try {
  order.total = 0;
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
false
false
false
TypeError
```

**Rule:** When an operation fails, its `Reflect` function returns `false`. The operator throws a `TypeError` in strict mode, and `Object.defineProperty` throws in every mode.

In sloppy mode, where strict mode is off, `order.total = 0` fails without a word. `Reflect.set` reports the failure in both modes.

**Common mistake:** waiting for an error that never comes.

**Wrong**

```js
const order = Object.freeze({ total: 20 });

try {
  «Reflect.set(order, "total", 0);»
  console.log("saved");
} catch {
  console.log("refused");
}
```

**Output**

```text
saved
```

**Fix**

```js
const order = Object.freeze({ total: 20 });

«if (Reflect.set(order, "total", 0)) {»
  console.log("saved");
} else {
  console.log("refused");
}
```

**Output**

```text
refused
```

`Reflect.set` did not throw, so the `catch` never ran. It returned `false`. Check what it returns.

<!-- task -->

## The receiver

**Code**

```js
const product = {
  name: "pen",
  get label() {
    return this.name.toUpperCase();
  },
};

const cup = { name: "cup" };

console.log(Reflect.get(product, "label"));
console.log(Reflect.get(product, "label", cup));

const meter = {
  set reading(value) {
    this.last = value;
  },
};

const log = {};
Reflect.set(meter, "reading", 12, log);
console.log(log.last, meter.last);
```

**Output**

```text
PEN
CUP
12 undefined
```

**Rule:** `Reflect.get(obj, key, receiver)` finds the property on `obj`. If it is a getter, the getter runs with `this` set to `receiver`. `Reflect.set(obj, key, value, receiver)` does the same for a setter. Leave `receiver` out, and it is `obj`.

`Reflect.set(shelf, "count", 9, other)` with a plain property writes `count` on `other`. The receiver is where an assignment lands.

`product.label` always passes `product` as the receiver. A `Proxy`, in the next lesson, passes on a receiver of its own, and `Reflect` is how you forward it.

<!-- task -->

## Calls and new

**Code**

```js
function describe(unit) {
  return `${this.amount} ${unit}`;
}

console.log(Reflect.apply(describe, { amount: 3 }, ["kg"]));
console.log(Reflect.apply(Math.max, null, [4, 9, 2]));

class Box {
  constructor(width, height) {
    this.area = width * height;
  }
}

const box = Reflect.construct(Box, [3, 4]);
console.log(box.area, box instanceof Box);
```

**Output**

```text
3 kg
9
12 true
```

**Rule:** `Reflect.apply(fn, thisArg, args)` calls `fn` with `this` set to `thisArg`, and the items of the array `args` as its arguments. `Reflect.construct(F, args)` works like `new F(...args)`.

`Reflect.construct(F, args, Other)` runs `F`, but `new.target` is `Other`, and the new object gets `Other.prototype`.

Each `Reflect` function has the name and the parameters of one operation that a `Proxy` can catch.

**Common mistake:** calling `fn.apply` on a function you do not control.

**Wrong**

```js
function total(...prices) {
  return prices.reduce((sum, price) => sum + price, 0);
}

total.apply = "10% off";

console.log(«total.apply(null, [5, 7])»);
```

**Error**

```text
TypeError: total.apply is not a function. (In 'total.apply(null, [5, 7])', 'total.apply' is "10% off")
```

**Fix**

```js
function total(...prices) {
  return prices.reduce((sum, price) => sum + price, 0);
}

total.apply = "10% off";

console.log(«Reflect.apply(total, null, [5, 7])»);
```

`total.apply` is a property read, and an own property hid `Function.prototype.apply`. `Reflect.apply` reads nothing from the function. Chrome and Node say `total.apply is not a function`.

<!-- task -->

## Remember

- `Reflect` holds the object operations as functions: `get`, `set`, `has`, `deleteProperty`, `defineProperty`, `ownKeys`, `apply` and `construct`.
- A failed `set`, `deleteProperty` or `defineProperty` returns `false`. It does not throw.
- The `receiver` is the `this` that a getter or a setter runs with, and where an assignment lands.
- `Reflect.apply` and `Reflect.construct` call a function or a class with an array of arguments.
