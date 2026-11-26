# Deep Copies

## Every level copied

**Code**

```js
const order = {
  id: 7,
  customer: { name: "Ada" },
  items: [{ sku: "pen", qty: 1 }],
};

const copy = structuredClone(order);

copy.customer.name = "Ben";
copy.items[0].qty = 5;

console.log(order.customer.name);
console.log(order.items[0].qty);
console.log(copy.items[0] === order.items[0]);
```

**Output**

```text
Ada
1
false
```

**Rule:** A deep copy shares nothing with the original. Every nested object and array is copied too. `structuredClone(value)` makes a deep copy.

`structuredClone(5)` gives `5`. A primitive needs no copying.

`structuredClone` copies every level, also the parts you never change. On large data that is slow.

<!-- task -->

## More than plain data

**Code**

```js
const ada = { name: "Ada" };
const team = { lead: ada, members: [ada], since: new Date(0) };
team.self = team;

const copy = structuredClone(team);

console.log(copy.since.getTime());
console.log(copy.self === copy);
console.log(copy.lead === copy.members[0]);
console.log(copy.lead === ada);
```

**Output**

```text
0
true
true
false
```

**Rule:** `structuredClone` keeps built-in types: a `Date` comes back as a `Date`. It also keeps how the objects point at each other. An object that is reached twice is copied once. A cycle, which is an object that leads back to itself, stays a cycle in the copy.

`structuredClone(new Map([["a", 1]])).get("a")` gives `1`. A `Map` and a `Set` are copied with their content.

`structuredClone({ note: undefined, score: NaN })` keeps both properties as they are.

<!-- task -->

## What it cannot copy

**Code**

```js
const values = [{ run() {} }, [() => 1], { id: Symbol("id") }, { when: new Date(0) }];

for (const value of values) {
  try {
    structuredClone(value);
    console.log("copied");
  } catch (error) {
    console.log(error.name);
  }
}
```

**Output**

```text
DataCloneError
DataCloneError
DataCloneError
copied
```

**Rule:** `structuredClone` copies data, not code. A function or a symbol anywhere in the value makes it throw a `DataCloneError`. Nothing is copied.

`structuredClone(new Cart())` gives a plain object. The data is copied, and the methods of the class are gone.

**Common mistake:** cloning an object that has a method.

**Wrong**

```js
const cart = {
  items: [{ sku: "pen" }],
  count() {
    return this.items.length;
  },
};

const copy = «structuredClone(cart)»;

console.log(copy.items[0] === cart.items[0]);
```

**Error**

```text
DataCloneError: The object can not be cloned.
```

**Fix**

```js
const cart = {
  items: [{ sku: "pen" }],
  count() {
    return this.items.length;
  },
};

const copy = «{ ...cart, items: structuredClone(cart.items) }»;

console.log(copy.items[0] === cart.items[0]);
```

The method `count` is a function, so the whole call threw. The fix deep copies the data only. Spread carries the method over.

<!-- task -->

## The JSON round trip

**Code**

```js
const event = {
  title: "Launch",
  when: new Date(0),
  room: undefined,
  score: NaN,
  remind() {},
};

const copy = JSON.parse(JSON.stringify(event));

console.log(typeof copy.when);
console.log(copy.when);
console.log("room" in copy, "remind" in copy);
console.log(copy.score);
```

**Output**

```text
string
1970-01-01T00:00:00.000Z
false false
null
```

**Rule:** `JSON.parse(JSON.stringify(value))` is the older way to deep copy: it turns the value into text and back. Text keeps less. A property that holds `undefined` or a function is dropped. A `Date` comes back as a string, and `NaN` as `null`. There is no error.

`JSON.stringify([undefined])` gives `"[null]"`. In an array the slot stays, as `null`.

`JSON.stringify(new Set([1]))` gives `"{}"`. A cycle makes `JSON.stringify` throw a `TypeError`.

**Common mistake:** using a date after a JSON round trip.

**Wrong**

```js
const booking = { guest: "Ada", checkIn: new Date(0) };
const copy = «JSON.parse(JSON.stringify(booking))»;

console.log(copy.checkIn.getTime());
```

**Error**

```text
TypeError: copy.checkIn.getTime is not a function. (In 'copy.checkIn.getTime()', 'copy.checkIn.getTime' is undefined)
```

**Fix**

```js
const booking = { guest: "Ada", checkIn: new Date(0) };
const copy = «structuredClone(booking)»;

console.log(copy.checkIn.getTime());
```

After the round trip, `checkIn` was a string, and a string has no `getTime`. `structuredClone` keeps the `Date`.

<!-- task -->

## Remember

- `structuredClone(value)` copies every level, and keeps dates, maps, sets and cycles.
- It throws a `DataCloneError` on a function or a symbol. A class instance loses its methods.
- A JSON round trip drops `undefined` and functions, and turns a date into a string and `NaN` into `null`.
- A JSON round trip throws on a cycle.
