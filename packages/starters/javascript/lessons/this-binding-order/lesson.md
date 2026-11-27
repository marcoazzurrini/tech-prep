# The Four Rules of this

## The four rules

**Code**

```js
function describe() {
  return this ? this.label : "none";
}

const a = { label: "method", describe };
const b = { label: "explicit" };

console.log(describe());
console.log(a.describe());
console.log(a.describe.call(b));
console.log(new a.describe() instanceof describe);
```

**Output**

```text
none
method
explicit
true
```

**Rule:** For a regular function, `this` depends on how it is called. From highest priority to lowest: `new`, explicit (`call`, `apply` or `bind`), method call, and plain call.

In a plain call, `this` is `undefined` in strict mode. In `outer.inner.fn()`, `this` is `outer.inner`, the object right before the dot.

Explicit binding beats a method call. A bound function keeps its `this` even when attached to another object.

**Common mistake:** trying to rebind an already bound function.

**Wrong**

```js
function read() {
  return this.name;
}

const first = { name: "First" };
const second = { name: "Second" };
const bound = read.bind(first).«bind(second)»;

console.log(bound());
```

**Output**

```text
First
```

**Fix**

```js
function read() {
  return this.name;
}

const first = { name: "First" };
const second = { name: "Second" };
const bound = read.«bind(second)»;

console.log(bound());
```

The first `bind` locks `this` permanently against later `bind`, `call` and `apply` calls. Bind the original function directly to `second`.

<!-- task -->

## new beats bind

**Code**

```js
function User(name) {
  this.name = name;
}

const locked = { name: "Locked" };
const BoundUser = User.bind(locked);

const u = new BoundUser("Ada");
console.log(u.name);
console.log(locked.name);
console.log(u instanceof User);
```

**Output**

```text
Ada
Locked
true
```

**Rule:** `new` has the highest priority. Calling a bound function with `new` ignores the bound object and sets `this` to a fresh instance.

`new obj.User("Ada")` also ignores `obj` and creates a new instance.

Preset arguments from `bind` are still kept when calling with `new`.

**Common mistake:** calling a bound function with `new` when you meant to update the bound object.

**Wrong**

```js
function setName(name) {
  this.name = name;
}

const saved = { name: "Old" };
const update = setName.bind(saved);

«new update("Ada")»;
console.log(saved.name);
```

**Output**

```text
Old
```

**Fix**

```js
function setName(name) {
  this.name = name;
}

const saved = { name: "Old" };
const update = setName.bind(saved);

«update("Ada")»;
console.log(saved.name);
```

`new update("Ada")` wrote `name` onto a brand-new object and left `saved` unchanged. Call `update("Ada")` without `new` so `bind` applies.

<!-- task -->

## Arrows ignore the rules

**Code**

```js
const box = {
  name: "Box",
  makeReader() {
    return () => this.name;
  },
};

const read = box.makeReader();
const other = { name: "Other", read };

console.log(read());
console.log(other.read());
console.log(read.call(other));
```

**Output**

```text
Box
Box
Box
```

**Rule:** An arrow function sits outside the four rules. It has no `this` of its own and keeps the `this` of the scope where it was created.

Neither a method call nor `call`, `apply` or `bind` can change an arrow function's `this`.

**Common mistake:** calling an arrow function with `new`.

**Wrong**

```js
const Item = «(name) => {
  this.name = name;
}»;

console.log(new Item("Pen").name);
```

**Error**

```text
TypeError: function is not a constructor (evaluating 'new Item("Pen")')
```

**Fix**

```js
const Item = «function (name) {
  this.name = name;
}»;

console.log(new Item("Pen").name);
```

Arrow functions have no `this` and cannot be used as constructors. Use a regular `function` when you need `new`.

<!-- task -->

## Remember

- Priority for regular functions: `new` > `call`/`apply`/`bind` > method call > plain call.
- A bound function ignores later `bind`, `call`, `apply` and method calls, but `new` overrides `bind`.
- In `a.b.fn()`, `this` is `a.b`, the object directly before the dot.
- Arrow functions ignore all four rules, keep their enclosing `this`, and throw if called with `new`.
