# WeakMap and WeakSet

## Objects as keys only

**Code**

```js
const notes = new WeakMap();
const ada = { name: "Ada" };

notes.set(ada, "likes tea");

console.log(notes.get(ada));
console.log(notes.has({ name: "Ada" }));
console.log(notes.size);
console.log(typeof notes.forEach);
```

**Output**

```text
likes tea
false
undefined
undefined
```

**Rule:** A `WeakMap` is a map whose keys must be objects. It has `set`, `get`, `has` and `delete`. It has no `size`, no `clear` and no way to loop over its entries.

`notes.set(Symbol("id"), 1)` works too: a symbol made with `Symbol()` can be a key. A symbol from `Symbol.for` cannot, and neither can any other primitive.

`[...notes]` throws a `TypeError`, because a weak map cannot be spread or looped over.

**Common mistake:** using a string as a key.

**Wrong**

```js
const lastSeen = new WeakMap();

lastSeen.set(«"ada"», "Monday");
console.log(lastSeen.get("ada"));
```

**Error**

```text
TypeError: WeakMap keys must be objects or non-registered symbols
```

**Fix**

```js
const lastSeen = new WeakMap();
const ada = { name: "Ada" };

lastSeen.set(«ada», "Monday");
console.log(lastSeen.get(ada));
```

A weak map only takes keys that can be collected as garbage. A string is a primitive, so `set` throws. Key the entry by the object itself, or use a `Map` for string keys.

<!-- task -->

## Data per object

**Code**

```js
const totals = new WeakMap();
let runs = 0;

function cartTotal(cart) {
  if (!totals.has(cart)) {
    runs++;
    totals.set(cart, cart.items.reduce((sum, item) => sum + item.price, 0));
  }
  return totals.get(cart);
}

const cart = { items: [{ price: 4 }, { price: 6 }] };
console.log(cartTotal(cart));
console.log(cartTotal(cart));
console.log(runs);
```

**Output**

```text
10
10
1
```

**Rule:** A `WeakMap` does not keep its keys alive. Once nothing else reaches a key object, the object and its entry can both be collected. This makes a weak map the place for extra data about objects: a cache per object, or private data.

`totals.get(cart)` works for as long as the program holds `cart`. You can never watch an entry go. With no `size` and no loop, no code can tell when the collector ran.

**Common mistake:** caching by object in a `Map`.

**Wrong**

```js
const totals = «new Map()»;

function cartTotal(cart) {
  if (!totals.has(cart)) {
    totals.set(cart, cart.items.reduce((sum, item) => sum + item.price, 0));
  }
  return totals.get(cart);
}

for (let i = 1; i <= 3; i++) {
  console.log(cartTotal({ items: [{ price: i }] }));
}
console.log(totals.size);
```

**Output**

```text
1
2
3
3
```

**Fix**

```js
const totals = «new WeakMap()»;

function cartTotal(cart) {
  if (!totals.has(cart)) {
    totals.set(cart, cart.items.reduce((sum, item) => sum + item.price, 0));
  }
  return totals.get(cart);
}

for (let i = 1; i <= 3; i++) {
  console.log(cartTotal({ items: [{ price: i }] }));
}
console.log(totals.size);
```

The `Map` holds every cart as a key. No cart can be collected, even when the loop is done with it. The `WeakMap` lets each cart go. Its `size` is `undefined`, because the number of entries can change at any moment.

<!-- task -->

## Marking visited objects

**Code**

```js
const sent = new WeakSet();

function sendInvoice(order) {
  if (sent.has(order)) {
    return "already sent";
  }
  sent.add(order);
  return `sent #${order.id}`;
}

const order = { id: 42 };
console.log(sendInvoice(order));
console.log(sendInvoice(order));
console.log(sendInvoice({ id: 42 }));
```

**Output**

```text
sent #42
already sent
sent #42
```

**Rule:** A `WeakSet` holds objects weakly, with `add`, `has` and `delete`. It marks objects, for example as already handled, without changing them and without keeping them alive.

`order.sent = true` would mark the object too, but it changes the object. The mark shows up in `Object.keys` and `JSON.stringify`, and the write throws on a frozen object.

`new WeakSet().add(42)` throws a `TypeError`. Like a weak map, a weak set takes only objects and symbols made with `Symbol()`.

**Common mistake:** walking objects that point back to each other, without marking them.

**Wrong**

```js
const ada = { name: "Ada", friends: [] };
const bo = { name: "Bo", friends: [ada] };
ada.friends.push(bo);

function countPeople(person) {
  let count = 1;
  for (const friend of person.friends) {
    count += countPeople(friend);
  }
  return count;
}

console.log(countPeople(ada));
```

**Error**

```text
RangeError: Maximum call stack size exceeded.
```

**Fix**

```js
const ada = { name: "Ada", friends: [] };
const bo = { name: "Bo", friends: [ada] };
ada.friends.push(bo);

function countPeople(person, seen = new WeakSet()) {
  «if (seen.has(person)) {
    return 0;
  }
  seen.add(person);»
  let count = 1;
  for (const friend of person.friends) {
    count += countPeople(friend, seen);
  }
  return count;
}

console.log(countPeople(ada));
```

Ada lists Bo and Bo lists Ada, so the walk went round forever. The weak set marks each person on the first visit, and a second visit counts nothing.

<!-- task -->

## Remember

- `WeakMap` keys and `WeakSet` values must be objects, or symbols made with `Symbol()`. Anything else throws a `TypeError`.
- They do not keep their objects alive. An entry can go once nothing else reaches its object.
- They have no `size`, no `clear` and cannot be looped over.
- Use them for data about objects: a cache per object, private data, or a mark such as "visited".
