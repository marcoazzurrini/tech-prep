# Objects without a Prototype

## Creating a bare object

**Code**

```js
const dict = Object.create(null);
dict.en = "hello";

console.log(Object.getPrototypeOf(dict));
console.log("en" in dict);
console.log("toString" in dict);
```

**Output**

```text
null
true
false
```

**Rule:** `Object.create(null)` makes an object with no prototype. It has no inherited methods from `Object.prototype`, so it holds only the keys you add.

`{ __proto__: null }` makes the same kind of bare object.

`Object.keys(dict)` and `Object.hasOwn(dict, "en")` still work because they live on `Object`, not on `Object.prototype`.

**Common mistake:** calling an `Object.prototype` method on a bare object.

**Wrong**

```js
const dict = Object.create(null);
dict.en = "hello";

console.log(dict.«hasOwnProperty»("en"));
```

**Error**

```text
TypeError: dict.hasOwnProperty is not a function. (In 'dict.hasOwnProperty("en")', 'dict.hasOwnProperty' is undefined)
```

**Fix**

```js
const dict = Object.create(null);
dict.en = "hello";

console.log(«Object.hasOwn(dict, "en")»);
```

`dict` has no prototype, so `dict.hasOwnProperty` is `undefined`. Use `Object.hasOwn` instead.

<!-- task -->

## Safe keys for lookups

**Code**

```js
const plain = {};
const bare = Object.create(null);

plain["__proto__"] = "text";
bare["__proto__"] = "text";

console.log(typeof plain["__proto__"]);
console.log(bare["__proto__"]);
console.log("toString" in plain);
console.log("toString" in bare);
```

**Output**

```text
object
text
true
false
```

**Rule:** In a plain object, inherited names like `"toString"` already exist and `"__proto__"` triggers an inherited setter. In a bare object, every string is an ordinary key.

`plain["__proto__"] = "text"` does nothing because the `__proto__` setter on `Object.prototype` ignores non-objects.

`String(bare)` throws a `TypeError` because a bare object has no `toString` or `valueOf` method.

**Common mistake:** counting arbitrary keys in a plain `{}`.

**Wrong**

```js
const counts = «{}»;

for (const word of ["toString", "hi"]) {
  counts[word] = (counts[word] || 0) + 1;
}

console.log(counts.hi);
console.log(typeof counts.toString);
```

**Output**

```text
1
string
```

**Fix**

```js
const counts = «Object.create(null)»;

for (const word of ["toString", "hi"]) {
  counts[word] = (counts[word] || 0) + 1;
}

console.log(counts.hi);
console.log(typeof counts.toString);
```

In a plain object, `counts["toString"]` starts as a function, so adding `1` turns it into a string. Starting with `Object.create(null)` keeps every key clean.

<!-- task -->

## Changing a prototype

**Code**

```js
const base = { role: "guest" };
const user = { name: "Ada" };

Object.setPrototypeOf(user, base);
console.log(user.role);

Object.setPrototypeOf(user, null);
console.log(user.role);
console.log(Object.getPrototypeOf(user));
```

**Output**

```text
guest
undefined
null
```

**Rule:** `Object.setPrototypeOf(obj, proto)` changes the prototype of `obj` to `proto` and returns `obj`. Passing `null` removes its prototype.

`Object.setPrototypeOf` slows down property lookups on that object. Prefer `Object.create(proto)` when making a new object.

**Common mistake:** creating a prototype cycle.

**Wrong**

```js
const a = {};
const b = Object.create(a);

«Object.setPrototypeOf(a, b)»;
```

**Error**

```text
TypeError: cyclic __proto__ value
```

**Fix**

```js
const a = {};
const b = Object.create(a);

«Object.setPrototypeOf(b, null)»;
```

A prototype chain cannot loop back to itself. `Object.setPrototypeOf` also throws a `TypeError` if the new prototype is a primitive other than `null`, or if the object is non-extensible.

<!-- task -->

## Remember

- `Object.create(null)` and `{ __proto__: null }` create objects with no prototype.
- Bare objects have no `toString` or `hasOwnProperty`. Use static methods like `Object.hasOwn` and `Object.keys`.
- Use bare objects when storing arbitrary string keys like `"toString"` or `"__proto__"`.
- `Object.setPrototypeOf(obj, proto)` changes an object's prototype, but throws on cycles and hurts performance.
