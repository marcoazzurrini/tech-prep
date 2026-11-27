# Property Descriptors

## Three flags

**Code**

```js
const book = { title: "Dune" };

const descriptor = Object.getOwnPropertyDescriptor(book, "title");

console.log(descriptor.value);
console.log(descriptor.writable);
console.log(descriptor.enumerable);
console.log(descriptor.configurable);
```

**Output**

```text
Dune
true
true
true
```

**Rule:** Each property has a value and three flags: `writable`, `enumerable` and `configurable`. `Object.getOwnPropertyDescriptor(obj, key)` gives them in one object, called a **descriptor**. A property made in a literal or by assignment has all three flags `true`.

`Object.getOwnPropertyDescriptor(book, "pages")` gives `undefined`. The object has no such key.

`Object.getOwnPropertyDescriptor(cart, "total")` of a getter has `get` and `set` in place of `value` and `writable`.

<!-- task -->

## defineProperty sets flags

**Code**

```js
const product = { name: "Lamp" };

Object.defineProperty(product, "price", { value: 40 });

const flags = Object.getOwnPropertyDescriptor(product, "price");
console.log(flags.writable, flags.enumerable, flags.configurable);

try {
  product.price = 1;
} catch (error) {
  console.log(error.name);
}

console.log(product.price);
```

**Output**

```text
false false false
TypeError
40
```

**Rule:** `Object.defineProperty(obj, key, descriptor)` creates a property, or changes one that exists. On a new property, a flag you leave out is `false`. With `writable: false` the value cannot be assigned: the assignment throws a `TypeError` in strict mode.

`Object.defineProperty(product, "name", { writable: false })` changes one flag of a property that exists. The flags you leave out keep their values.

`writable: false` guards the property, not the object it holds. With a read-only `tags` array, `product.tags.push("new")` still works.

<!-- task -->

## Hidden with enumerable

**Code**

```js
const user = { name: "Ada", password: "s3cret" };

Object.defineProperty(user, "password", { enumerable: false });

console.log(Object.keys(user).join(", "));
console.log(JSON.stringify(user));
console.log(JSON.stringify({ ...user }));
console.log(user.password);
console.log("password" in user);
```

**Output**

```text
name
{"name":"Ada"}
{"name":"Ada"}
s3cret
true
```

**Rule:** A property with `enumerable: false` is skipped by `Object.keys`, `for...in`, `JSON.stringify` and spread. It is still there: reading it works, and so does `in`.

`Object.getOwnPropertyNames(user)` gives `["name", "password"]`. It lists the hidden keys too.

`Object.keys([5, 6])` gives `["0", "1"]`. The `length` of an array is a property with `enumerable: false`.

**Common mistake:** adding a property with `defineProperty` and only a value.

**Wrong**

```js
const order = { id: 7 };

Object.defineProperty(order, "total", «{ value: 25 }»);

console.log(JSON.stringify(order));
```

**Output**

```text
{"id":7}
```

**Fix**

```js
const order = { id: 7 };

Object.defineProperty(order, "total", «{ value: 25, writable: true, enumerable: true, configurable: true }»);

console.log(JSON.stringify(order));
```

`total` was new, so the flags left out became `false` and the property was hidden. Name each flag you want `true`.

<!-- task -->

## Locked with configurable

**Code**

```js
const config = { mode: "dark" };

Object.defineProperty(config, "mode", { configurable: false });

config.mode = "light";
console.log(config.mode);

try {
  delete config.mode;
} catch (error) {
  console.log(error.name);
}

try {
  Object.defineProperty(config, "mode", { enumerable: false });
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
light
TypeError
TypeError
```

**Rule:** A property with `configurable: false` cannot be deleted, and its flags cannot be changed. Its value can still change while `writable` is `true`. There is no way back: `configurable` cannot be set to `true` again.

`Object.defineProperty(config, "mode", { writable: false })` is the one change still allowed. A locked property can become read-only.

`Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj))` copies an object with its flags and its getters. Spread copies values only.

<!-- task -->

## Remember

- Each property has a value and three flags: `writable`, `enumerable` and `configurable`. A plain property has all three `true`.
- `Object.defineProperty` on a new property: a flag you leave out is `false`. On a property that exists, it keeps its value.
- `writable: false` makes assignment throw. `enumerable: false` hides the key from `Object.keys`, `for...in`, JSON and spread.
- `configurable: false` stops `delete` and any later change of flags, for good.
