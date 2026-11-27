# super

## super() in a constructor

**Code**

```js
class Account {
  constructor(owner, balance) {
    this.owner = owner;
    this.balance = balance;
  }
}

class SavingsAccount extends Account {
  constructor(owner, balance, rate) {
    super(owner, balance);
    this.rate = rate;
  }
}

const acct = new SavingsAccount("Maya", 200, 0.05);
console.log(acct.owner);
console.log(acct.balance);
console.log(acct.rate);
```

**Output**

```text
Maya
200
0.05
```

**Rule:** A child class constructor must call `super()` before it uses `this` or returns. `super()` runs the parent constructor and creates the `this` object.

Code that does not touch `this` can run before `super()`.

Calling `super()` twice throws a `ReferenceError`.

**Common mistake:** setting a property on `this` before calling `super()`.

**Wrong**

```js
class Account {
  constructor(owner) {
    this.owner = owner;
  }
}

class SavingsAccount extends Account {
  constructor(owner, rate) {
    «this.rate = rate;»
    super(owner);
  }
}

new SavingsAccount("Maya", 0.05);
```

**Error**

```text
ReferenceError: 'super()' must be called in derived constructor before accessing |this| or returning non-object.
```

**Fix**

```js
class Account {
  constructor(owner) {
    this.owner = owner;
  }
}

class SavingsAccount extends Account {
  constructor(owner, rate) {
    «super(owner);»
    this.rate = rate;
  }
}

new SavingsAccount("Maya", 0.05);
```

In a derived class, `this` does not exist until `super()` runs. Call `super()` first, then set child properties on `this`.

<!-- task -->

## super.method() keeps this

**Code**

```js
class Notifier {
  static channel() {
    return this.name;
  }

  constructor(tag) {
    this.tag = tag;
  }

  format(text) {
    return `[${this.tag}] ${text}`;
  }
}

class UrgentNotifier extends Notifier {
  static channel() {
    return `${super.channel()}!`;
  }

  format(text) {
    return `${super.format(text)} (urgent)`;
  }
}

const alert = new UrgentNotifier("ops");
console.log(alert.format("disk full"));
console.log(UrgentNotifier.channel());
```

**Output**

```text
[ops] disk full (urgent)
UrgentNotifier!
```

**Rule:** `super.method()` finds `method` on the parent prototype and runs it with the current `this`. Inside a static method, `super` looks on the parent class instead.

`super.prop = value` writes to `this`, not to the parent prototype.

**Common mistake:** reading an own instance property through `super`.

**Wrong**

```js
class BasePrice {
  constructor(amount) {
    this.amount = amount;
  }
}

class TaxedPrice extends BasePrice {
  total() {
    return «super.amount» * 1.2;
  }
}

console.log(new TaxedPrice(50).total());
```

**Output**

```text
NaN
```

**Fix**

```js
class BasePrice {
  constructor(amount) {
    this.amount = amount;
  }
}

class TaxedPrice extends BasePrice {
  total() {
    return «this.amount» * 1.2;
  }
}

console.log(new TaxedPrice(50).total());
```

`amount` lives on the instance, not on `BasePrice.prototype`, so `super.amount` is `undefined`. Read instance data from `this`.

<!-- task -->

## super is fixed

**Code**

```js
class Vehicle {
  kind() {
    return `vehicle:${this.id}`;
  }
}

class Bike extends Vehicle {
  constructor(id) {
    super();
    this.id = id;
  }

  label() {
    return super.kind();
  }
}

const bike = new Bike(7);
const boat = { id: 99, kind() { return "boat"; } };

console.log(bike.label());
console.log(bike.label.call(boat));
```

**Output**

```text
vehicle:7
vehicle:99
```

**Rule:** `super` always looks up from the class or object literal where the method was written. Borrowing the method changes `this`, not `super`.

An arrow function inside a method shares the enclosing method's `super`.

**Common mistake:** copying a method that uses `super` onto another object.

**Wrong**

```js
const parentA = {
  greet() {
    return `A:${this.name}`;
  },
};

const parentB = {
  greet() {
    return `B:${this.name}`;
  },
};

const childA = Object.setPrototypeOf({
  name: "Ada",
  say() {
    return super.greet();
  },
}, parentA);

const childB = Object.setPrototypeOf({
  name: "Ben",
  «say: childA.say»,
}, parentB);

console.log(childB.say());
```

**Output**

```text
A:Ben
```

**Fix**

```js
const parentA = {
  greet() {
    return `A:${this.name}`;
  },
};

const parentB = {
  greet() {
    return `B:${this.name}`;
  },
};

const childA = Object.setPrototypeOf({
  name: "Ada",
  say() {
    return super.greet();
  },
}, parentA);

const childB = Object.setPrototypeOf({
  name: "Ben",
  «say() { return super.greet(); }»,
}, parentB);

console.log(childB.say());
```

`childA.say` remembers `childA` as its home object, so `super.greet()` still calls `parentA.greet`. Write the method on `childB` so its `super` points to `parentB`.

<!-- task -->

## Remember

- A derived constructor must call `super()` before reading or writing `this`.
- `super.method()` looks up the method on the parent prototype (or parent class in statics) and keeps the current `this`.
- `super.prop` does not read own instance properties; use `this.prop` for those.
- `super` is bound to where the method was written, even if the method is borrowed or copied.
