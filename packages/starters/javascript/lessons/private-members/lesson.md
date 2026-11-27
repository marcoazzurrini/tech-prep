# Private Members

## A name with #

**Code**

```js
class Cart {
  #items = [];

  add(item) {
    this.#items.push(item);
  }

  count() {
    return this.#items.length;
  }
}

const cart = new Cart();

cart.add("tea");
cart.add("milk");

console.log(cart.count());
console.log(cart.items);
console.log(cart["#items"]);
console.log(Object.keys(cart));
console.log(JSON.stringify(cart));
```

**Output**

```text
2
undefined
undefined
[]
{}
```

**Rule:** A name that starts with `#` is a **private member**. You declare it in the class body, as you declare a field. Only code inside that body can use it, as `this.#items`.

`cart.#items` outside the class is a `SyntaxError`. The file does not run at all.

`#items` is not a property. Brackets, `Object.keys` and `JSON.stringify` never see it.

**Common mistake:** using a private name without declaring it.

**Wrong**

```js
class Cart {
  add(item) {
    «this.#items».push(item);
  }
}

console.log(typeof Cart);
```

**Error**

```text
SyntaxError: Private name "#items" must be declared in an enclosing class
```

**Fix**

```js
class Cart {
  «#items = [];»

  add(item) {
    this.#items.push(item);
  }
}

console.log(typeof Cart);
```

An assignment such as `this.items = []` creates a property. A `#` name is never created by use: the class body must declare it. The check happens before any code runs, so not even the last line prints.

<!-- task -->

## Private methods and statics

**Code**

```js
class Coupon {
  static #issued = 0;

  #code;

  constructor(percent) {
    Coupon.#issued += 1;
    this.#code = `SAVE${percent}-${Coupon.#issued}`;
  }

  #fits(total) {
    return total >= 20;
  }

  apply(total) {
    return this.#fits(total) ? `${this.#code} applied` : "too small";
  }

  static issued() {
    return Coupon.#issued;
  }
}

const first = new Coupon(10);
const second = new Coupon(15);

console.log(first.apply(25));
console.log(second.apply(5));
console.log(Coupon.issued());
console.log(Object.getOwnPropertyNames(Coupon.prototype));
```

**Output**

```text
SAVE10-1 applied
too small
2
[ "constructor", "apply" ]
```

**Rule:** Methods and static members can be private too. Only the class body can call `#fits()`. `static #issued` belongs to the class itself, so read it as `Coupon.#issued`.

A private method is not on `Coupon.prototype`. Nothing outside the class can find it or replace it.

**Common mistake:** reading a private static through `this` in an instance method.

**Wrong**

```js
class Coupon {
  static #issued = 0;

  constructor() {
    Coupon.#issued += 1;
  }

  report() {
    return `${«this».#issued} issued`;
  }
}

console.log(new Coupon().report());
```

**Error**

```text
TypeError: Cannot access invalid private field (evaluating 'this.#issued')
```

**Fix**

```js
class Coupon {
  static #issued = 0;

  constructor() {
    Coupon.#issued += 1;
  }

  report() {
    return `${«Coupon».#issued} issued`;
  }
}

console.log(new Coupon().report());
```

In `report`, `this` is the coupon, and only the class has `#issued`. Reading a private name of an object that lacks it throws a `TypeError`. Chrome and Node say `Cannot read private member #issued from an object whose class did not declare it`.

<!-- task -->

## Checking with in

**Code**

```js
class Ticket {
  #seat;

  constructor(seat) {
    this.#seat = seat;
  }

  sameSeat(other) {
    return #seat in other && this.#seat === other.#seat;
  }

  static isTicket(value) {
    return #seat in value;
  }
}

const front = new Ticket("B4");
const back = new Ticket("B4");
const fake = { seat: "B4" };

console.log(front.sameSeat(back));
console.log(front.sameSeat(fake));
console.log(Ticket.isTicket(front));
console.log(Ticket.isTicket(fake));
```

**Output**

```text
true
false
true
false
```

**Rule:** `#seat in value` is `true` when `value` has the `#seat` of this class. It is a **brand check**: a test that an object was made by this class. Code in the class can read `#seat` of any `Ticket`, not only of `this`.

`#seat in "B4"` throws a `TypeError`. The right side of `in` must be an object.

Two classes that both declare `#seat` have two different names. Neither can read the other's.

**Common mistake:** reading the private name before testing for it.

**Wrong**

```js
class Ticket {
  #seat;

  constructor(seat) {
    this.#seat = seat;
  }

  sameSeat(other) {
    return this.#seat === «other.#seat»;
  }
}

const ticket = new Ticket("B4");

console.log(ticket.sameSeat({ seat: "B4" }));
```

**Error**

```text
TypeError: Cannot access invalid private field (evaluating 'other.#seat')
```

**Fix**

```js
class Ticket {
  #seat;

  constructor(seat) {
    this.#seat = seat;
  }

  sameSeat(other) {
    return «#seat in other &&» this.#seat === other.#seat;
  }
}

const ticket = new Ticket("B4");

console.log(ticket.sameSeat({ seat: "B4" }));
```

A missing property gives `undefined`. A missing private name throws instead. Test with `in` first, and `&&` stops before the read.

<!-- task -->

## Three ways to hide

**Code**

```js
class OldUser {
  constructor(pin) {
    this._pin = pin;
  }

  check(pin) {
    return pin === this._pin;
  }
}

function createUser(pin) {
  return { check: (guess) => guess === pin };
}

class User {
  #pin;

  constructor(pin) {
    this.#pin = pin;
  }

  check(pin) {
    return pin === this.#pin;
  }
}

const old = new OldUser(1234);

old._pin = 0;

console.log(old.check(1234));
console.log(JSON.stringify(old));
console.log(createUser(1).check === createUser(2).check);
console.log(new User(1).check === new User(2).check);
console.log(JSON.stringify(new User(1234)));
```

**Output**

```text
false
{"_pin":0}
false
true
{}
```

**Rule:** An underscore such as `_pin` is only a convention: any code can read and change the property. A closure truly hides `pin`, but each object gets new functions. A `#` name truly hides `#pin`, and the methods stay shared on the prototype.

Only the class body that declares `#pin` can use it. A subclass, which is a class built on top of `User`, cannot use it either.

<!-- task -->

## Remember

- Declare a `#` name in the class body. Only code inside that body can use it.
- Fields, methods and static members can be private. Read a private static through the class name.
- Reading a `#` name of an object that lacks it throws a `TypeError`. `#name in obj` tests first.
- A `#` name is not a property: brackets, `Object.keys` and JSON never see it.
