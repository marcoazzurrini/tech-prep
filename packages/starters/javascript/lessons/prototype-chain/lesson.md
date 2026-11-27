# The Prototype Chain

## A hidden link

**Code**

```js
const defaults = { theme: "dark", fontSize: 14 };
const settings = Object.create(defaults);
settings.language = "en";

console.log(settings.language);
console.log(settings.theme);
console.log(settings.margin);
console.log(Object.getPrototypeOf(settings) === defaults);
```

**Output**

```text
en
dark
undefined
true
```

**Rule:** Every object has a hidden link to another object, its **prototype**. When a key is missing on the object, the read looks in the prototype. `Object.create(defaults)` makes a new empty object whose prototype is `defaults`.

`Object.getPrototypeOf(settings)` gives the prototype of `settings`.

`settings.__proto__` gives it too. This is the old way, and you will see it in other people's code.

**Common mistake:** reading the link as `obj.prototype`.

**Wrong**

```js
const defaults = { theme: "dark" };
const settings = Object.create(defaults);

console.log(«settings.prototype» === defaults);
```

**Output**

```text
false
```

**Fix**

```js
const defaults = { theme: "dark" };
const settings = Object.create(defaults);

console.log(«Object.getPrototypeOf(settings)» === defaults);
```

The link is hidden. It is not a property named `prototype`. `settings.prototype` is a missing key like any other, so it reads as `undefined`.

<!-- task -->

## Up to null

**Code**

```js
const company = { currency: "EUR", city: "Milan" };
const shop = Object.create(company);
shop.city = "Rome";
const stall = Object.create(shop);
stall.owner = "Ada";

console.log(stall.owner, stall.city, stall.currency);
console.log(stall.phone);
console.log(typeof stall.toString);

const top = Object.getPrototypeOf(company);

console.log(top === Object.prototype);
console.log(Object.getPrototypeOf(top));
```

**Output**

```text
Ada Rome EUR
undefined
function
true
null
```

**Rule:** A prototype has a prototype too, so the links form a **prototype chain**. A read walks up the chain and stops at the first object that has the key. The chain ends at `null`, and a key found nowhere reads as `undefined`.

`stall.city` gives `"Rome"`. `shop` is nearer than `company`, so the walk stops there.

`Object.prototype` is the prototype of every object literal. `toString` lives there, and its own prototype is `null`.

<!-- task -->

## A link, not a copy

**Code**

```js
const plan = { seats: 5 };
const team = Object.create(plan);
const copy = { ...plan };

plan.seats = 10;
plan.storage = "50 GB";

console.log(team.seats, team.storage);
console.log(copy.seats, copy.storage);

Object.setPrototypeOf(team, { seats: 1 });

console.log(team.seats, team.storage);
```

**Output**

```text
10 50 GB
5 undefined
1 undefined
```

**Rule:** The prototype is not copied into the object. Each read walks the chain as it is at that moment, so a change to the prototype shows at once. `Object.setPrototypeOf(obj, proto)` points the link at another object.

`{ ...plan }` copies the keys once. The copy has no link to `plan`.

`Object.setPrototypeOf(plan, Object.create(plan))` throws a `TypeError`. A chain cannot go round in a circle.

<!-- task -->

## Remember

- Every object has a hidden link to its prototype. `Object.create(proto)` sets it, and `Object.getPrototypeOf(obj)` reads it.
- A read walks up the chain and takes the first match. At `null` it gives `undefined`.
- The prototype of an object literal is `Object.prototype`. The prototype of `Object.prototype` is `null`.
- The link is live. A change to a prototype shows in every object linked to it.
