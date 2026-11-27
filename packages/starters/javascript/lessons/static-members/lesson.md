# Static Members

## On the class itself

**Code**

```js
class Temperature {
  static unit = "C";

  constructor(degrees) {
    this.degrees = degrees;
  }

  static fromFahrenheit(f) {
    return new Temperature((f - 32) * (5 / 9));
  }
}

const freezing = Temperature.fromFahrenheit(32);

console.log(freezing.degrees);
console.log(Temperature.unit);
console.log(freezing.unit);
console.log(Object.hasOwn(Temperature, "fromFahrenheit"));
console.log(Object.hasOwn(Temperature.prototype, "fromFahrenheit"));
console.log(Object.keys(Temperature));
```

**Output**

```text
0
C
undefined
true
false
[ "unit" ]
```

**Rule:** A `static` field or method belongs to the class itself, not to `prototype` and not to instances. Read and call it on the class, such as `Temperature.unit` and `Temperature.fromFahrenheit(32)`.

`Object.keys(Temperature)` gives `["unit"]`. Static fields are enumerable, while static methods are not.

`static prototype` is a syntax error. A static member cannot replace the class's `prototype` property.

**Common mistake:** calling a static method on an instance.

**Wrong**

```js
class Temperature {
  constructor(degrees) {
    this.degrees = degrees;
  }

  static fromFahrenheit(f) {
    return new Temperature((f - 32) * (5 / 9));
  }
}

const room = new Temperature(20);

console.log(«room».fromFahrenheit(68).degrees);
```

**Error**

```text
TypeError: room.fromFahrenheit is not a function. (In 'room.fromFahrenheit(68)', 'room.fromFahrenheit' is undefined)
```

**Fix**

```js
class Temperature {
  constructor(degrees) {
    this.degrees = degrees;
  }

  static fromFahrenheit(f) {
    return new Temperature((f - 32) * (5 / 9));
  }
}

const room = new Temperature(20);

console.log(«Temperature».fromFahrenheit(68).degrees);
```

`fromFahrenheit` lives on `Temperature`, not on `room` or `Temperature.prototype`. Call it on the class.

<!-- task -->

## this is the class

**Code**

```js
class Badge {
  static prefix = "ID";
  static nextNumber = 1;

  constructor(name) {
    this.code = `${Badge.prefix}-${Badge.nextNumber}`;
    Badge.nextNumber += 1;
    this.name = name;
  }

  static guest() {
    return new this("Guest");
  }

  describe() {
    return `${this.code}: ${this.name} (${this.constructor.prefix})`;
  }
}

const first = new Badge("Ada");
const second = Badge.guest();

console.log(first.describe());
console.log(second.describe());
```

**Output**

```text
ID-1: Ada (ID)
ID-2: Guest (ID)
```

**Rule:** Inside a static method, `this` is the class itself, so `new this("Guest")` makes a `Badge`. Inside an instance method or constructor, `this` is the instance. Reach static members there through the class name or `this.constructor`.

`Badge.guest()` uses the same `this` rule as any method call: `this` is the object before the dot.

**Common mistake:** passing a static method as a plain callback.

**Wrong**

```js
class Badge {
  static prefix = "ID";

  static format(name) {
    return `${this.prefix}-${name}`;
  }
}

const { format } = Badge;

console.log(«format("Ada")»);
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.prefix')
```

**Fix**

```js
class Badge {
  static prefix = "ID";

  static format(name) {
    return `${this.prefix}-${name}`;
  }
}

console.log(«Badge.format("Ada")»);
```

Taking `format` off `Badge` drops `this`. Because a class body is strict, `this` becomes `undefined`. Call it on `Badge`, or wrap it in an arrow function.

<!-- task -->

## Static setup runs once

**Code**

```js
const log = [];

class Pricing {
  static base = 100;
  static tax = 0;

  static {
    const rate = 0.2;
    this.tax = this.base * rate;
    log.push("static block");
  }

  constructor() {
    log.push("constructor");
  }
}

log.push("after class");
new Pricing();

console.log(Pricing.tax);
console.log(log.join(", "));
```

**Output**

```text
20
static block, after class, constructor
```

**Rule:** Static fields and `static { ... }` blocks run once, from top to bottom, when the class is defined. Inside a static field or block, `this` is the class. Variables declared in a `static` block stay inside that block.

A `static` block is called a **static initialisation block**. Use it when setup needs local variables, loops or `try`/`catch`.

**Common mistake:** reading a static field declared further down.

**Wrong**

```js
class Pricing {
  static total = this.base + «this.fee»;
  static base = 100;
  static fee = 15;
}

console.log(Pricing.total);
```

**Output**

```text
NaN
```

**Fix**

```js
class Pricing {
  static base = 100;
  static fee = 15;
  «static total = this.base + this.fee;»
}

console.log(Pricing.total);
```

**Output**

```text
115
```

Static fields run in source order. When `total` ran first, `base` and `fee` were still `undefined`, and `undefined + undefined` is `NaN`.

<!-- task -->

## Remember

- A `static` field or method lives on the class itself, not on `prototype` and not on instances.
- Inside a static method, static field or `static` block, `this` is the class.
- From an instance method, read static members through the class name or `this.constructor`.
- Static fields and `static { ... }` blocks run once, top to bottom, when the class is defined.
