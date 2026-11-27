# Freezing Objects

## Object.freeze locks everything

**Code**

```js
const point = { x: 10, y: 20 };
const locked = Object.freeze(point);

console.log(locked === point);
console.log(Object.isFrozen(point));

try {
  point.x = 99;
} catch (error) {
  console.log(error.name);
}

try {
  delete point.y;
} catch (error) {
  console.log(error.name);
}

console.log(point.x, point.y);
```

**Output**

```text
true
true
TypeError
TypeError
10 20
```

**Rule:** `Object.freeze(obj)` locks an object in place and returns that same object. You cannot add, remove or reassign any of its own data properties. Every own data property gets `writable: false` and `configurable: false`. In strict mode, any write or delete throws a `TypeError`.

`Object.freeze([1, 2])` freezes an array too. Calling `push` or assigning an index throws a `TypeError`.

`Object.freeze(42)` returns `42` without an error. `Object.isFrozen(42)` is `true` because primitives never change.

<!-- task -->

## seal and preventExtensions

**Code**

```js
const badge = { role: "editor" };
Object.seal(badge);

badge.role = "admin";
console.log(badge.role);
console.log(Object.isSealed(badge), Object.isFrozen(badge));

try {
  badge.level = 2;
} catch (error) {
  console.log(error.name);
}

const tag = { name: "news" };
Object.preventExtensions(tag);
delete tag.name;
console.log("name" in tag, Object.isExtensible(tag));
```

**Output**

```text
admin
true false
TypeError
false false
```

**Rule:** `Object.seal(obj)` stops adding and removing properties by setting `configurable: false` on every own property. Existing values can still change while `writable` is `true`. `Object.preventExtensions(obj)` only stops adding new properties, so existing ones can still be changed or deleted.

`Object.isFrozen(Object.preventExtensions({}))` gives `true`. An empty non-extensible object has no properties to change or delete, so it is already sealed and frozen.

`Object.isSealed(Object.freeze({ a: 1 }))` gives `true`. Every frozen object is also sealed and not extensible.

<!-- task -->

## Both are shallow

**Code**

```js
const settings = {
  theme: "dark",
  fonts: ["sans"],
};

Object.freeze(settings);

settings.fonts.push("mono");
console.log(settings.fonts.join(", "));
console.log(Object.isFrozen(settings.fonts));
```

**Output**

```text
sans, mono
false
```

**Rule:** `Object.freeze` and `Object.seal` are shallow. They lock only the object's own properties, not the objects or arrays stored inside them. A nested object stays open unless you freeze it too.

`Object.freeze` has no undo. To change a frozen object, make a copy instead.

**Common mistake:** expecting `Object.freeze` to lock nested objects.

**Wrong**

```js
const account = {
  owner: "Ada",
  limits: «{ daily: 100 }»,
};

Object.freeze(account);

account.limits.daily = 5000;
console.log(account.limits.daily);
```

**Output**

```text
5000
```

**Fix**

```js
const account = {
  owner: "Ada",
  limits: «Object.freeze({ daily: 100 })»,
};

Object.freeze(account);

try {
  account.limits.daily = 5000;
} catch (error) {
  console.log(error.name);
}
console.log(account.limits.daily);
```

Freezing `account` only prevented reassigning `account.limits`, not changing `account.limits.daily`. Freezing the nested object locks its properties too.

<!-- task -->

## Remember

- `Object.freeze(obj)` returns the same object and stops adding, deleting and changing its own data properties.
- `Object.seal(obj)` stops adding and deleting, but existing writable properties can still change.
- `Object.preventExtensions(obj)` only stops adding new properties.
- All three are shallow: freeze nested objects and arrays too when you want deep immutability.
