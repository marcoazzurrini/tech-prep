# WeakRef and FinalizationRegistry

## A weak reference

**Code**

```js
const report = { title: "Q3 sales", rows: [120, 95, 140] };
const ref = new WeakRef(report);

const target = ref.deref();
console.log(target === report);
console.log(target.title);
console.log(typeof ref);
```

**Output**

```text
true
Q3 sales
object
```

**Rule:** `new WeakRef(obj)` makes a weak reference: it points at `obj` but does not keep it alive. `ref.deref()` gives the object, or `undefined` once the object has been collected.

`report` is a strong reference, like every normal variable. While it holds the object, the object cannot be collected.

`ref.deref()?.title` reads safely. Always check what `deref()` gave: once the object is gone, `ref.deref().title` throws a `TypeError`.

**Common mistake:** wrapping a primitive, such as an id.

**Wrong**

```js
const user = { id: "u7", name: "Ada" };
const ref = new WeakRef(«user.id»);

console.log(ref.deref());
```

**Error**

```text
TypeError: First argument to WeakRef should be an object or a non-registered symbol
```

**Fix**

```js
const user = { id: "u7", name: "Ada" };
const ref = new WeakRef(«user»);

console.log(ref.deref()?.name);
```

Only an object or a symbol made with `Symbol()` can be collected. So only they can be the target of a `WeakRef`. A string, or a symbol from `Symbol.for`, throws a `TypeError`.

<!-- task -->

## Alive until code ends

**Code**

```js
function makeRef() {
  return new WeakRef({ total: 30 });
}

const ref = makeRef();
console.log(ref.deref()?.total);
console.log(ref.deref() === ref.deref());
```

**Output**

```text
30
true
```

**Rule:** An object just wrapped in a `WeakRef`, or read with `deref()`, stays alive until the current run of code ends: the whole script, or the one callback that is running. So every `deref()` in one run gives the same answer.

`setTimeout(() => ref.deref(), 0)` calls `deref()` in a later run. By then the object may be gone, so check again there.

`ref.deref()` may never give `undefined`. The engine decides when to collect, and it may keep an object for the whole program.

**Common mistake:** keeping the target in a place that lives long.

**Wrong**

```js
const opened = [];

function openDoc(ref) {
  const doc = ref.deref();
  if (doc) {
    opened.push(«doc»);
  }
}

openDoc(new WeakRef({ title: "Plan" }));
console.log(opened.length);
```

**Output**

```text
1
```

**Fix**

```js
const opened = [];

function openDoc(ref) {
  const doc = ref.deref();
  if (doc) {
    opened.push(«doc.title»);
  }
}

openDoc(new WeakRef({ title: "Plan" }));
console.log(opened.join(","));
```

The array is a strong reference. Once the document is in it, it can never be collected, and the `WeakRef` does nothing. Keep only the small value you need.

<!-- task -->

## A cleanup callback

**Code**

```js
const closed = [];
const registry = new FinalizationRegistry((name) => {
  closed.push(name);
});

const sheet = { name: "budget.xlsx" };
registry.register(sheet, sheet.name, sheet);

console.log(closed.length);
console.log(registry.unregister(sheet));
console.log(registry.unregister(sheet));
```

**Output**

```text
0
true
false
```

**Rule:** `register(target, heldValue, token)` asks the registry to call its callback with `heldValue` some time after `target` is collected. `unregister(token)` cancels that, and returns whether it removed anything.

`heldValue` is any value you pick to say what was collected. The callback gets it, never the target, and never before the current run of code ends.

`register(sheet, sheet)` throws a `TypeError`. The registry keeps the held value alive, so it must not be the target, or hold it.

**Common mistake:** doing required work in the callback.

**Wrong**

```js
const openFiles = new Set();
const registry = new FinalizationRegistry((name) => {
  openFiles.delete(name);
});

function readConfig() {
  const file = { name: "config.json" };
  openFiles.add(file.name);
  «registry.register(file, file.name);»
  return "port=80";
}

console.log(readConfig());
console.log(openFiles.size);
```

**Output**

```text
port=80
1
```

**Fix**

```js
const openFiles = new Set();

function readConfig() {
  const file = { name: "config.json" };
  openFiles.add(file.name);
  «try {
    return "port=80";
  } finally {
    openFiles.delete(file.name);
  }»
}

console.log(readConfig());
console.log(openFiles.size);
```

The callback may run much later, or never, for example when the program ends first. So the file stays open. Close it yourself, in `finally` or with `using`.

<!-- task -->

## A cache that lets go

**Code**

```js
const cache = new Map();
const registry = new FinalizationRegistry((id) => {
  if (cache.get(id)?.deref() === undefined) {
    cache.delete(id);
  }
});
let loads = 0;

function getReport(id) {
  const cached = cache.get(id)?.deref();
  if (cached) {
    return cached;
  }
  loads++;
  const report = { id, rows: new Array(10000).fill(0) };
  cache.set(id, new WeakRef(report));
  registry.register(report, id);
  return report;
}

const first = getReport("q3");
const second = getReport("q3");
console.log(first === second);
console.log(loads);
console.log(cache.size);
```

**Output**

```text
true
1
1
```

**Rule:** A `Map` of weak references is a cache that gives a value back while some code still uses it, and lets it be collected after. The registry deletes each entry whose value was collected, so the map does not fill with dead references.

`new WeakMap()` is simpler when the keys are objects. Keep this cache for large values under keys such as strings. When something must be freed at a known time, free it yourself.

**Common mistake:** a late callback that deletes a new entry.

**Wrong**

```js
const cache = new Map();

function forget(id) {
  «cache.delete(id);»
}

const fresh = { id: "q3" };
cache.set("q3", new WeakRef(fresh));

forget("q3"); // a late callback for an old q3 report
console.log(cache.has("q3"));
```

**Output**

```text
false
```

**Fix**

```js
const cache = new Map();

function forget(id) {
  «if (cache.get(id)?.deref() === undefined) {
    cache.delete(id);
  }»
}

const fresh = { id: "q3" };
cache.set("q3", new WeakRef(fresh));

forget("q3"); // a late callback for an old q3 report
console.log(cache.has("q3"));
```

The old report was collected, and a new one was stored under the same key. The old report's callback ran only after that, and deleted the new entry. Delete an entry only when its own value is gone.

<!-- task -->

## Remember

- `new WeakRef(obj)` does not keep `obj` alive. `deref()` gives it, or `undefined` once it is collected. Always check.
- An object read with `deref()` stays alive until the current run of code ends. Collection is never promised.
- A `FinalizationRegistry` callback gets the held value, may run late or never, and must not do required work.
- Prefer a `WeakMap` or explicit cleanup. Use these for a cache of large values.
