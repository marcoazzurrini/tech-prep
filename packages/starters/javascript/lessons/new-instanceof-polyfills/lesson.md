# Writing new and instanceof

## new in three steps

**Code**

```js
function Kettle(brand) {
  this.brand = brand;
}

Kettle.prototype.boil = function () {
  return this.brand + " is boiling";
};

function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  Ctor.apply(obj, args);
  return obj;
}

const kettle = myNew(Kettle, "Ember");

console.log(kettle.brand);
console.log(kettle.boil());
console.log(kettle instanceof Kettle);
```

**Output**

```text
Ember
Ember is boiling
true
```

**Rule:** `myNew(Ctor, ...args)` does the work of `new` by hand, in three steps. `Object.create(Ctor.prototype)` makes an object linked to the prototype. `Ctor.apply(obj, args)` runs the constructor with `this` set to that object. Then `myNew` returns the object.

`new` uses `Object.prototype` when `Ctor.prototype` is not an object. `Object.create(5)` throws a `TypeError`, so a complete `myNew` checks the prototype first.

`myNew` cannot build a `class`. A class called without `new` throws a `TypeError`, even through `apply`.

**Common mistake:** starting from an empty object.

**Wrong**

```js
function Kettle(brand) {
  this.brand = brand;
}

Kettle.prototype.boil = function () {
  return this.brand + " is boiling";
};

function myNew(Ctor, ...args) {
  const obj = «{}»;
  Ctor.apply(obj, args);
  return obj;
}

const kettle = myNew(Kettle, "Ember");
console.log(kettle.boil());
```

**Error**

```text
TypeError: kettle.boil is not a function. (In 'kettle.boil()', 'kettle.boil' is undefined)
```

**Fix**

```js
function Kettle(brand) {
  this.brand = brand;
}

Kettle.prototype.boil = function () {
  return this.brand + " is boiling";
};

function myNew(Ctor, ...args) {
  const obj = «Object.create(Ctor.prototype)»;
  Ctor.apply(obj, args);
  return obj;
}

const kettle = myNew(Kettle, "Ember");
console.log(kettle.boil());
```

`{}` links to `Object.prototype`, not to `Kettle.prototype`. The constructor ran, so `brand` was set, but the shared methods were out of reach.

<!-- task -->

## The returned object wins

**Code**

```js
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  const result = Ctor.apply(obj, args);
  const isObject = result !== null && (typeof result === "object" || typeof result === "function");
  return isObject ? result : obj;
}

const mainShop = { name: "Main Street" };

function Shop(name) {
  this.name = name;
  return mainShop;
}

function Stall(name) {
  this.name = name;
  return "ignored";
}

console.log(myNew(Shop, "Corner").name);
console.log(myNew(Shop, "Kiosk") === mainShop);
console.log(myNew(Stall, "Fruit").name);
```

**Output**

```text
Main Street
true
Fruit
```

**Rule:** When the constructor returns an object, `new` gives back that object. When it returns a primitive, or nothing, `new` gives back the object it made. `myNew` keeps the result only when it is not `null` and its type is `"object"` or `"function"`.

An array and a function are objects, so they win too.

**Common mistake:** forgetting that `typeof null` is `"object"`.

**Wrong**

```js
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  const result = Ctor.apply(obj, args);
  const isObject = «typeof result === "object"» || typeof result === "function";
  return isObject ? result : obj;
}

function Stall(name) {
  this.name = name;
  return null;
}

const stall = myNew(Stall, "Fruit");
console.log(stall.name);
```

**Error**

```text
TypeError: null is not an object (evaluating 'stall.name')
```

**Fix**

```js
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  const result = Ctor.apply(obj, args);
  const isObject = «result !== null &&» (typeof result === "object" || typeof result === "function");
  return isObject ? result : obj;
}

function Stall(name) {
  this.name = name;
  return null;
}

const stall = myNew(Stall, "Fruit");
console.log(stall.name);
```

`return null` passed the `typeof` test, so `myNew` gave back `null`. The real `new` ignores `null`, because it is a primitive.

<!-- task -->

## Walking the chain

**Code**

```js
function myInstanceof(obj, Ctor) {
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return false;
  }

  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Ctor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

class Vehicle {}
class Bus extends Vehicle {}
const bus = new Bus();

console.log(myInstanceof(bus, Bus), myInstanceof(bus, Vehicle));
console.log(myInstanceof(bus, Array));
console.log(myInstanceof(Object.create(null), Object));
```

**Output**

```text
true true
false
false
```

**Rule:** `myInstanceof(obj, Ctor)` starts at the prototype of `obj` and steps up with `Object.getPrototypeOf`. It returns `true` when it meets `Ctor.prototype`, and `false` when it reaches `null`, the end of every chain.

The real `instanceof` throws a `TypeError` when the right side is not a function. It also calls `Ctor[Symbol.hasInstance]` first, so a class can give its own answer.

**Common mistake:** skipping the check for primitives.

**Wrong**

```js
function myInstanceof(obj, Ctor) {
  «let proto = Object.getPrototypeOf(obj);»
  while (proto !== null) {
    if (proto === Ctor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

console.log(myInstanceof(7, Number), 7 instanceof Number);
```

**Output**

```text
true false
```

**Fix**

```js
function myInstanceof(obj, Ctor) {
  «if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return false;
  }»

  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Ctor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

console.log(myInstanceof(7, Number), 7 instanceof Number);
```

**Output**

```text
false false
```

`Object.getPrototypeOf(7)` wraps the number in an object first, so it gives `Number.prototype`. `instanceof` never wraps: a primitive gives `false`. With `null` or `undefined`, `Object.getPrototypeOf` throws.

<!-- task -->

## Remember

- `myNew` makes the object with `Object.create(Ctor.prototype)`, then calls `Ctor.apply(obj, args)`.
- If the constructor returns an object, an array or a function, that wins. A primitive or `null` is ignored.
- `myInstanceof` steps up the chain with `Object.getPrototypeOf` until it meets `Ctor.prototype` or `null`.
- A primitive gives `false`. Check for it before you walk.
