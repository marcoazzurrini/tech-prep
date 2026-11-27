# Garbage Collection

## Reachability from roots

**Code**

```js
let user = { name: "Ada" };
let backup = user;

user = null;
console.log(user);
console.log(backup.name);

backup = null;
console.log(backup);
```

**Output**

```text
null
Ada
null
```

**Rule:** An object stays in memory while it can be reached from a root. Roots are global variables, local variables of running functions and live closures. Dropping `user` does not free the object while `backup` still points to it.

Garbage collection runs automatically in the background. Standard JavaScript has no way to force it or know the exact moment it runs.

**Common mistake:** assuming `session = null` frees an object stored in a list.

**Wrong**

```js
const cache = [];
let session = { user: "Ada" };
cache.push(session);

session = null;
console.log(cache.length);
```

**Output**

```text
1
```

**Fix**

```js
const cache = [];
let session = { user: "Ada" };
cache.push(session);

«cache.pop();»
session = null;
console.log(cache.length);
```

`cache` is still reachable, so every object inside it stays alive. Remove the reference from `cache` as well before dropping `session`.

<!-- task -->

## Cycles are still collected

**Code**

```js
function createPair() {
  const left = { name: "L" };
  const right = { name: "R" };
  left.peer = right;
  right.peer = left;
  return { left, right };
}

let pair = createPair();
console.log(pair.left.peer.name);
pair = null;
console.log(pair);
```

**Output**

```text
R
null
```

**Rule:** Engines use mark-and-sweep, not reference counting. The collector starts at the roots, marks every reachable object and sweeps away the rest. When `pair` becomes `null`, `left` and `right` still point to each other, but nothing reaches them from a root, so both are collected.

Outgoing references never keep an object alive. Only an incoming path from a root does.

<!-- task -->

## Closures and leaks

**Code**

```js
function makeReader(record) {
  return () => record.title;
}

let doc = { title: "Draft", body: "long text" };
const getTitle = makeReader(doc);
doc = null;

console.log(getTitle());
```

**Output**

```text
Draft
```

**Rule:** A closure keeps every variable it reads reachable for as long as the closure itself is reachable. Setting `doc = null` does not free the object while `getTitle` still holds `record`.

Extract only the small value you need (`const title = record.title`) before creating the closure, so the rest of the object can be collected.

Unbounded caches, forgotten timers and closures over large objects are the most common sources of memory leaks.

<!-- task -->

## Remember

- An object stays in memory only while a path from a root can reach it.
- Dropping one variable does not free an object if another variable, array or object still points to it.
- Mark-and-sweep collects unreachable islands of cyclic objects as a whole.
- A live closure keeps every object it captures in memory until the closure itself becomes unreachable.
