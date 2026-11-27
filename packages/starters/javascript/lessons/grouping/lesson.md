# Grouping and Counting

## Grouping with Object.groupBy

**Code**

```js
const tasks = [
  { title: "Pay rent", status: "todo" },
  { title: "Send mail", status: "done" },
  { title: "Buy milk", status: "todo" },
];

const byStatus = Object.groupBy(tasks, (t) => t.status);

console.log(byStatus.todo.map((t) => t.title).join(", "));
console.log(byStatus.done.length);
console.log(Object.getPrototypeOf(byStatus));
```

**Output**

```text
Pay rent, Buy milk
1
null
```

**Rule:** `Object.groupBy(items, fn)` groups items into arrays under the string key returned by `fn(item, index)`. The returned object has a `null` prototype, so keys like `"toString"` or `"constructor"` never clash with inherited properties.

The arrays hold references to the original items, not copies.

**Common mistake:** calling `hasOwnProperty` on the object returned by `Object.groupBy`.

**Wrong**

```js
const words = ["toString", "ok"];
const groups = Object.groupBy(words, (w) => w);

console.log(«groups.hasOwnProperty("ok")»);
```

**Error**

```text
TypeError: groups.hasOwnProperty is not a function. (In 'groups.hasOwnProperty("ok")', 'groups.hasOwnProperty' is undefined)
```

**Fix**

```js
const words = ["toString", "ok"];
const groups = Object.groupBy(words, (w) => w);

console.log(«Object.hasOwn(groups, "ok")»);
```

Because `groups` has a `null` prototype, it does not inherit `hasOwnProperty` from `Object.prototype`. Use `Object.hasOwn` instead.

<!-- task -->

## Counting with reduce

**Code**

```js
const votes = ["yes", "no", "yes", "yes"];
const counts = votes.reduce((acc, vote) => {
  acc[vote] = (acc[vote] ?? 0) + 1;
  return acc;
}, Object.create(null));

console.log(counts.yes, counts.no);
console.log(JSON.stringify(counts));
```

**Output**

```text
3 1
{"yes":3,"no":1}
```

**Rule:** To count items by key, fold the array with `reduce` and increment `(acc[key] ?? 0) + 1`. Start with `Object.create(null)` when keys come from arbitrary strings.

Starting with `Object.create(null)` avoids reading inherited methods such as `toString` or `constructor` as existing counts.

**Common mistake:** counting arbitrary strings into a plain `{}` object.

**Wrong**

```js
const keys = ["toString", "ok"];
const counts = keys.reduce((acc, key) => {
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, «{}»);

console.log(typeof counts.toString, counts.ok);
```

**Output**

```text
string 1
```

**Fix**

```js
const keys = ["toString", "ok"];
const counts = keys.reduce((acc, key) => {
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, «Object.create(null)»);

console.log(typeof counts.toString, counts.ok);
```

On `{}`, `acc["toString"]` reads the inherited `toString` function, so `acc["toString"] + 1` turns into a string. `Object.create(null)` has no inherited keys, so every unseen key is `undefined`.

<!-- task -->

## Grouping and aggregating

**Code**

```js
const sales = [
  { dept: "books", amount: 20 },
  { dept: "music", amount: 15 },
  { dept: "books", amount: 35 },
];

const totals = sales.reduce((acc, sale) => {
  acc[sale.dept] = (acc[sale.dept] ?? 0) + sale.amount;
  return acc;
}, {});

console.log(JSON.stringify(totals));
```

**Output**

```text
{"books":55,"music":15}
```

**Rule:** When you need a single summary per group, such as a sum or a maximum, fold directly with `reduce` or transform the entries of `Object.groupBy` with `Object.entries` and `Object.fromEntries`.

Use `?? 0` instead of `|| 0` whenever a real group value could be `0`, `false` or `""`.

**Common mistake:** forgetting to return the accumulator in `reduce`.

**Wrong**

```js
const sales = [
  { dept: "books", amount: 20 },
  { dept: "books", amount: 35 },
];

const totals = sales.reduce((acc, sale) => {
  acc[sale.dept] = (acc[sale.dept] ?? 0) + sale.amount;
}, {});

console.log(JSON.stringify(totals));
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'acc[sale.dept]')
```

**Fix**

```js
const sales = [
  { dept: "books", amount: 20 },
  { dept: "books", amount: 35 },
];

const totals = sales.reduce((acc, sale) => {
  acc[sale.dept] = (acc[sale.dept] ?? 0) + sale.amount;
  «return acc;»
}, {});

console.log(JSON.stringify(totals));
```

Without `return acc`, the callback returns `undefined`, which becomes `acc` on the next item. Returning `acc` passes the object forward to each step.

<!-- task -->

## Remember

- `Object.groupBy(items, fn)` groups items into arrays on a `null`-prototype object, keeping references to the original items.
- Use `Object.hasOwn(groups, key)` on the result of `Object.groupBy`, not `groups.hasOwnProperty(key)`.
- Count with `reduce` using `(acc[key] ?? 0) + 1`, and start with `Object.create(null)` for arbitrary string keys.
- Always return the accumulator object from the `reduce` callback.
