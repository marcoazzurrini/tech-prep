# Map.groupBy and getOrInsert

## Grouping into a Map

**Code**

```js
const ada = { name: "Ada" };
const bo = { name: "Bo" };

const tasks = [
  { title: "Pay rent", owner: ada },
  { title: "Send mail", owner: bo },
  { title: "Buy milk", owner: ada },
];

const byOwner = Map.groupBy(tasks, (t) => t.owner);

console.log(byOwner.size);
console.log(byOwner.get(ada).map((t) => t.title).join(", "));
console.log(byOwner.get({ name: "Ada" }));

const byOwnerObject = Object.groupBy(tasks, (t) => t.owner);
console.log(Object.keys(byOwnerObject).join(", "));
```

**Output**

```text
2
Pay rent, Buy milk
undefined
[object Object]
```

**Rule:** `Map.groupBy(items, fn)` works like `Object.groupBy`, but it returns a `Map`. Each key is the value that `fn` returned, with its type kept. An object key is found only by the same object.

`Object.groupBy` turns each key into a string, so both owners became one group, `"[object Object]"`. For the same reason, `Map.groupBy([1, "1"], (x) => x)` keeps two groups, and `Object.groupBy` makes one.

`Map.groupBy` suits keys that are objects, or numbers that must stay numbers. `Object.groupBy` suits string keys, when you want dot access or `JSON.stringify`.

**Common mistake:** looking up a group with a key of the wrong type.

**Wrong**

```js
const orders = [
  { id: 1, table: 4 },
  { id: 2, table: 7 },
  { id: 3, table: 4 },
];
const form = { table: "4" };

const byTable = Map.groupBy(orders, (o) => o.table);

console.log(byTable.get(«form.table»));
```

**Output**

```text
undefined
```

**Fix**

```js
const orders = [
  { id: 1, table: 4 },
  { id: 2, table: 7 },
  { id: 3, table: 4 },
];
const form = { table: "4" };

const byTable = Map.groupBy(orders, (o) => o.table);

console.log(byTable.get(«Number(form.table)»).length);
```

The keys are the numbers `4` and `7`. The form gives the string `"4"`, and a `Map` never converts keys, so nothing matches. Convert the key to the type the map holds.

<!-- task -->

## getOrInsert

**Code**

```js
const sessions = [
  { user: "ada", page: "home" },
  { user: "bo", page: "shop" },
  { user: "ada", page: "cart" },
];

const pagesByUser = new Map();

for (const s of sessions) {
  pagesByUser.getOrInsert(s.user, []).push(s.page);
}

console.log(JSON.stringify([...pagesByUser]));
console.log(pagesByUser.getOrInsert("cy", []).length);
console.log(pagesByUser.size);
```

**Output**

```text
[["ada",["home","cart"]],["bo",["shop"]]]
0
3
```

**Rule:** `map.getOrInsert(key, value)` returns the value stored under `key`. When the key is missing, it stores `value` first, so even asking for `"cy"` adds a key.

`map.getOrInsert(key, value)` does the work of `if (!map.has(key)) map.set(key, value)` followed by `map.get(key)`.

`getOrInsert` and `getOrInsertComputed` are new. Bun has them, but Node 24 does not.

**Common mistake:** pushing into a default that was never stored.

**Wrong**

```js
const words = ["tea", "jam", "toast"];
const byLetter = new Map();

for (const word of words) {
  «(byLetter.get(word[0]) ?? [])».push(word);
}

console.log(byLetter.size);
```

**Output**

```text
0
```

**Fix**

```js
const words = ["tea", "jam", "toast"];
const byLetter = new Map();

for (const word of words) {
  «byLetter.getOrInsert(word[0], [])».push(word);
}

console.log(byLetter.size);
```

`?? []` makes a new array, but nothing puts it in the map, so each word is lost. `getOrInsert` stores the array and returns that same array, so `push` adds to the group.

<!-- task -->

## Computing only when missing

**Code**

```js
let built = 0;

function buildReport(month) {
  built += 1;
  return `Report for ${month}`;
}

const reports = new Map();

console.log(reports.getOrInsertComputed("May", buildReport));
console.log(reports.getOrInsertComputed("May", buildReport));
console.log(reports.getOrInsertComputed("June", buildReport));
console.log(built, reports.size);
```

**Output**

```text
Report for May
Report for May
Report for June
2 2
```

**Rule:** `map.getOrInsertComputed(key, fn)` returns the value under `key`. Only when the key is missing does it call `fn(key)`, then store and return the result.

`getOrInsert(key, [])` makes a new array on every call, even when the key is there. That is cheap. A costly value belongs in `getOrInsertComputed`.

`WeakMap` has `getOrInsert` and `getOrInsertComputed` too.

**Common mistake:** passing a costly value to `getOrInsert`.

**Wrong**

```js
let built = 0;

function buildReport(month) {
  built += 1;
  return `Report for ${month}`;
}

const reports = new Map();

for (const month of ["May", "May", "May"]) {
  reports.«getOrInsert(month, buildReport(month))»;
}

console.log(built, reports.size);
```

**Output**

```text
3 1
```

**Fix**

```js
let built = 0;

function buildReport(month) {
  built += 1;
  return `Report for ${month}`;
}

const reports = new Map();

for (const month of ["May", "May", "May"]) {
  reports.«getOrInsertComputed(month, buildReport)»;
}

console.log(built, reports.size);
```

Arguments run before the call, so `buildReport(month)` ran three times for one stored report. Pass the function itself to `getOrInsertComputed`, and it runs only for a missing key.

<!-- task -->

## Remember

- `Map.groupBy(items, fn)` groups into a `Map`. Keys keep their type, and an object key is found only by the same object.
- `getOrInsert(key, value)` returns the stored value, and stores `value` first when the key is missing.
- `getOrInsertComputed(key, fn)` calls `fn(key)` only when the key is missing. Use it when the value is costly.
- `map.getOrInsert(key, []).push(item)` groups. `getOrInsertComputed` makes a cache.
