# Inheritance before class

## Linking prototypes

**Code**

```js
function Vehicle(wheels) {
  this.wheels = wheels;
}
Vehicle.prototype.describe = function () {
  return this.wheels + " wheels";
};

function Bike() {}
Bike.prototype = Object.create(Vehicle.prototype);
Bike.prototype.constructor = Bike;
Bike.prototype.ring = function () {
  return "ding";
};

const bike = new Bike();
bike.wheels = 2;
console.log(bike.describe());
console.log(bike.ring());
console.log(bike instanceof Bike, bike instanceof Vehicle);
console.log(bike.constructor === Bike);
```

**Output**

```text
2 wheels
ding
true true
true
```

**Rule:** Set `Child.prototype = Object.create(Parent.prototype)` so instances of `Child` inherit from `Parent.prototype`, then restore `Child.prototype.constructor = Child`.

`Object.create(Parent.prototype)` makes a new empty object linked to `Parent.prototype`. Without restoring `constructor`, `bike.constructor` would point to `Vehicle`.

**Common mistake:** assigning `Parent.prototype` directly instead of calling `Object.create`.

**Wrong**

```js
function Vehicle() {}
function Bike() {}

Bike.prototype = «Vehicle.prototype»;
Bike.prototype.ring = function () {
  return "ding";
};

console.log("ring" in new Vehicle());
```

**Output**

```text
true
```

**Fix**

```js
function Vehicle() {}
function Bike() {}

Bike.prototype = «Object.create(Vehicle.prototype)»;
Bike.prototype.ring = function () {
  return "ding";
};

console.log("ring" in new Vehicle());
```

Assigning `Vehicle.prototype` directly makes both constructors share one prototype object, so child methods leak onto parent instances. `Object.create` gives the child its own prototype object.

<!-- task -->

## Calling the parent constructor

**Code**

```js
function Account(owner) {
  this.owner = owner;
}
Account.prototype.label = function () {
  return "Account: " + this.owner;
};

function Savings(owner, rate) {
  Account.call(this, owner);
  this.rate = rate;
}
Savings.prototype = Object.create(Account.prototype);
Savings.prototype.constructor = Savings;

const acc = new Savings("Ada", 0.05);
console.log(acc.label());
console.log(Object.hasOwn(acc, "owner"), acc.rate);
```

**Output**

```text
Account: Ada
true 0.05
```

**Rule:** Inside the child constructor, call `Parent.call(this, ...args)` so the parent sets its own properties on the new instance.

`Object.create(Parent.prototype)` shares methods only. It does not run `Parent` for each new instance.

**Common mistake:** calling `Parent(owner)` without `.call(this)`.

**Wrong**

```js
function Account(owner) {
  this.owner = owner;
}

function Savings(owner, rate) {
  «Account(owner)»;
  this.rate = rate;
}

new Savings("Ada", 0.05);
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.owner = owner')
```

**Fix**

```js
function Account(owner) {
  this.owner = owner;
}

function Savings(owner, rate) {
  «Account.call(this, owner)»;
  this.rate = rate;
}

const acc = new Savings("Ada", 0.05);
console.log(acc.owner, acc.rate);
```

Calling `Account(owner)` plainly gives `undefined` as `this` in strict mode. `Account.call(this, owner)` runs `Account` with `this` set to the new `Savings` instance.

<!-- task -->

## Overriding parent methods

**Code**

```js
function Item(name) {
  this.name = name;
}
Item.prototype.tag = function () {
  return this.name;
};

function DiscountItem(name, off) {
  Item.call(this, name);
  this.off = off;
}
DiscountItem.prototype = Object.create(Item.prototype);
DiscountItem.prototype.constructor = DiscountItem;
DiscountItem.prototype.tag = function () {
  return Item.prototype.tag.call(this) + " (-" + this.off + "%)";
};

const item = new DiscountItem("Pen", 20);
console.log(item.tag());
```

**Output**

```text
Pen (-20%)
```

**Rule:** Define a method on `Child.prototype` with the same name to override the parent's version. Call `Parent.prototype.method.call(this)` when you want to reuse the parent's behaviour.

**Common mistake:** adding child methods before replacing `Child.prototype`.

**Wrong**

```js
function Item() {}
function DiscountItem() {}

«DiscountItem.prototype.badge = function () {
  return "SALE";
};»
DiscountItem.prototype = Object.create(Item.prototype);

console.log(typeof new DiscountItem().badge);
```

**Output**

```text
undefined
```

**Fix**

```js
function Item() {}
function DiscountItem() {}

DiscountItem.prototype = Object.create(Item.prototype);
«DiscountItem.prototype.badge = function () {
  return "SALE";
};»

console.log(typeof new DiscountItem().badge);
```

Reassigning `DiscountItem.prototype` throws away the old prototype object and any methods already on it. Link the prototype first, then attach child methods.

<!-- task -->

## Remember

- Link prototypes with `Child.prototype = Object.create(Parent.prototype)` and restore `Child.prototype.constructor = Child`.
- Call `Parent.call(this, ...args)` inside `Child` to initialise parent own properties.
- Always link `Child.prototype` before adding methods to it.
- Reuse an overridden parent method with `Parent.prototype.method.call(this, ...args)`.
