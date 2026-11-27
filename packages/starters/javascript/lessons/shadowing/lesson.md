# Writing Does Not Climb the Chain

## A write stays here

**Code**

```js
const defaults = { theme: "dark", fontSize: 14 };
const settings = Object.create(defaults);
const other = Object.create(defaults);

settings.theme = "light";

console.log(settings.theme, other.theme, defaults.theme);
console.log(Object.hasOwn(settings, "theme"));

delete settings.theme;

console.log(settings.theme);
```

**Output**

```text
light dark dark
true
dark
```

**Rule:** A read walks up the chain, but an assignment writes on the object itself. `settings.theme = "light"` makes an own property on `settings` and leaves the prototype alone. The own property **shadows** the inherited one: it hides it from reads on `settings`.

`delete settings.theme` removes the own property, so the inherited `"dark"` shows again.

`delete settings.theme` a second time does nothing. `delete` never reaches the prototype.

**Common mistake:** changing a shared value through one object.

**Wrong**

```js
const prices = { currency: "EUR" };
const shop = Object.create(prices);
const stall = Object.create(prices);

«shop.currency» = "USD";

console.log(stall.currency);
```

**Output**

```text
EUR
```

**Fix**

```js
const prices = { currency: "EUR" };
const shop = Object.create(prices);
const stall = Object.create(prices);

«prices.currency» = "USD";

console.log(stall.currency);
```

The write made an own `currency` on `shop` only. To change the value for every object, write to the prototype itself.

<!-- task -->

## this in inherited methods

**Code**

```js
const counter = {
  count: 0,
  increment() {
    this.count += 1;
    return this.count;
  },
};

const clicks = Object.create(counter);

clicks.increment();
clicks.increment();

console.log(clicks.count, counter.count);
console.log(Object.hasOwn(clicks, "count"));
```

**Output**

```text
2 0
true
```

**Rule:** `clicks.increment()` finds the method on the prototype, but `this` is still `clicks`, the object before the dot. So `this.count = ...` writes an own property on `clicks`.

`this.count += 1` first reads `count`, which comes from the prototype the first time. Then it writes the sum on `clicks`.

`counter.increment()` sets `this` to `counter` and writes there. Every object without its own `count` sees that change.

<!-- task -->

## One shared array

**Code**

```js
const profile = { tags: [] };
const ada = Object.create(profile);
const kim = Object.create(profile);

ada.tags.push("admin");

console.log(kim.tags.length);
console.log(Object.hasOwn(ada, "tags"));
console.log(ada.tags === profile.tags);
```

**Output**

```text
1
false
true
```

**Rule:** `ada.tags.push("admin")` assigns nothing to `ada`. It reads `tags`, finds the one array on the prototype and changes it. Every object linked to `profile` sees the new item.

`ada.tags = []` would be an assignment to `ada`. That would make an own property.

**Common mistake:** keeping a list on the prototype.

**Wrong**

```js
const cartBase = {
  items: [],
  add(item) {
    this.items.push(item);
  },
};

const mine = Object.create(cartBase);
const yours = Object.create(cartBase);
mine.add("tea");

console.log(yours.items.length);
```

**Output**

```text
1
```

**Fix**

```js
const cartBase = {
  items: [],
  add(item) {
    this.items.push(item);
  },
};

const mine = Object.create(cartBase);
«mine.items = [];»
const yours = Object.create(cartBase);
«yours.items = [];»
mine.add("tea");

console.log(yours.items.length);
```

**Output**

```text
0
```

Both carts read `items` from the prototype, so they shared one array. Give each object its own array when you create it. Keep methods on the prototype, and data on the object.

<!-- task -->

## Setters and read-only keys

**Code**

```js
const base = {
  set name(value) {
    this.label = value.toUpperCase();
  },
};
Object.defineProperty(base, "id", { value: 1 });

const item = Object.create(base);
item.name = "tea";

console.log(item.label, Object.hasOwn(item, "name"));

try {
  item.id = 2;
} catch (error) {
  console.log(error.name);
}

console.log(item.id, Object.hasOwn(item, "id"));
```

**Output**

```text
TEA false
TypeError
1 false
```

**Rule:** Before it writes, an assignment checks the chain. If it finds an inherited setter, it runs that setter with `this` set to the object, and makes no own property. If it finds an inherited read-only property, it throws a `TypeError` in strict mode.

`Object.defineProperty(item, "id", { value: 2 })` still makes an own `id`. Only assignment is blocked.

**Common mistake:** shadowing a read-only key by assignment.

**Wrong**

```js
const base = { id: 1 };
Object.defineProperty(base, "id", { writable: false });

const item = Object.create(base);
«item.id = 2»;

console.log(item.id);
```

**Error**

```text
TypeError: Attempted to assign to readonly property.
```

**Fix**

```js
const base = { id: 1 };
Object.defineProperty(base, "id", { writable: false });

const item = Object.create(base);
«Object.defineProperty(item, "id", { value: 2 })»;

console.log(item.id);
```

A read-only key on the prototype blocks the same key on every object below it. `Object.defineProperty` does not assign, so it is not blocked. Chrome and Node word the error as `Cannot assign to read only property 'id' of object '#<Object>'`.

<!-- task -->

## Remember

- An assignment makes an own property and never changes the prototype. `delete` removes own properties only.
- In an inherited method, `this` is the object the call started on, so `this.x = ...` writes there.
- `obj.list.push(x)` changes the array it finds, even on the prototype. Give each object its own data.
- An inherited setter runs instead of a write. An inherited read-only key makes the write throw.
