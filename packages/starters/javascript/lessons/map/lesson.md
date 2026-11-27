# Map

## Any value as key

**Code**

```js
const ada = { name: "Ada" };
const bo = { name: "Bo" };

const visits = new Map();
visits.set(ada, 3);
visits.set(bo, 1);
visits.set(NaN, 0);

console.log(visits.get(ada));
console.log(visits.get({ name: "Ada" }));
console.log(visits.get(NaN));
console.log(visits.has(bo), visits.size);
```

**Output**

```text
3
undefined
0
true 3
```

**Rule:** A `Map` holds pairs of a key and a value. The key can be any value, even an object or `NaN`. `set` stores a pair, `get` reads it, `has` checks for it, `delete` removes it and `size` counts the pairs.

`visits.get({ name: "Ada" })` gives `undefined`. An object key is found only by the same object, not by one that looks equal.

`map.set("a", 1).set("b", 2)` works, because `set` returns the map. `delete` gives `true` when it removed a pair, and `false` when the key was not there.

**Common mistake:** using objects as keys of a plain object.

**Wrong**

```js
const ada = { name: "Ada" };
const bo = { name: "Bo" };

const visits = «{}»;
visits[ada] = 3;
visits[bo] = 1;

console.log(visits[ada]);
```

**Output**

```text
1
```

**Fix**

```js
const ada = { name: "Ada" };
const bo = { name: "Bo" };

const visits = «new Map()»;
visits.«set(ada, 3)»;
visits.«set(bo, 1)»;

console.log(visits.«get(ada)»);
```

A plain object turns every key into a string. Both users become the key `"[object Object]"`, so the second write replaces the first. A `Map` keeps the objects themselves as keys.

<!-- task -->

## Looping over a Map

**Code**

```js
const stock = new Map([
  ["pens", 12],
  ["ink", 0],
  ["paper", 40],
]);

for (const [item, count] of stock) {
  console.log(`${item}: ${count}`);
}

console.log([...stock.keys()].join(", "));
console.log([...stock.values()].join(", "));
```

**Output**

```text
pens: 12
ink: 0
paper: 40
pens, ink, paper
12, 0, 40
```

**Rule:** `new Map(pairs)` builds a map from an array of `[key, value]` pairs. `for...of` on a map gives one `[key, value]` pair per entry, in the order they were added.

`map.keys()`, `map.values()` and `map.entries()` give the keys, the values or the pairs. `map.entries()` is what `for...of` uses.

`map.forEach((value, key) => ...)` passes the value first and the key second.

**Common mistake:** treating `keys()` as an array.

**Wrong**

```js
const stock = new Map([["pens", 12], ["ink", 0]]);
const items = «stock.keys()»;

console.log(items[0]);
console.log(items.length);
```

**Output**

```text
undefined
undefined
```

**Fix**

```js
const stock = new Map([["pens", 12], ["ink", 0]]);
const items = «[...stock.keys()]»;

console.log(items[0]);
console.log(items.length);
```

`keys()` gives an iterator: a value that hands out the keys one by one. It has no indexes and no `length`. Spread it into an array first, or use `Array.from(stock.keys())`.

<!-- task -->

## Order and size

**Code**

```js
const lanes = new Map();
lanes.set(30, "Cy");
lanes.set(4, "Ada");
lanes.set(12, "Bo");

lanes.set(30, "Cyd");
console.log([...lanes.keys()].join(","));

lanes.delete(4);
lanes.set(4, "Ada");
console.log([...lanes.keys()].join(","));
console.log(lanes.size);
```

**Output**

```text
30,4,12
30,12,4
3
```

**Rule:** A `Map` keeps its keys in the order they were first added, number keys included. Setting a key that is already there changes its value and keeps its place. To move a key to the end, delete it and set it again.

A plain object with these keys lists them as `4,12,30`, because it puts keys that look like whole numbers first. A `Map` never reorders.

`map.clear()` removes every pair and leaves `size` at `0`.

**Common mistake:** writing to a map with square brackets.

**Wrong**

```js
const lanes = new Map();
lanes«["Ada"] = 4»;

console.log(lanes.size);
console.log(lanes.get("Ada"));
```

**Output**

```text
0
undefined
```

**Fix**

```js
const lanes = new Map();
lanes«.set("Ada", 4)»;

console.log(lanes.size);
console.log(lanes.get("Ada"));
```

`lanes["Ada"] = 4` adds an ordinary property to the map object. It is not an entry, so `size` and `get` do not see it. Always use `set` and `get`.

<!-- task -->

## Converting a Map

**Code**

```js
const prices = { tea: 3, cake: 5 };

const priceMap = new Map(Object.entries(prices));
priceMap.set("scone", 4);

console.log(JSON.stringify([...priceMap]));
console.log(JSON.stringify(Object.fromEntries(priceMap)));
```

**Output**

```text
[["tea",3],["cake",5],["scone",4]]
{"tea":3,"cake":5,"scone":4}
```

**Rule:** Maps, objects and arrays convert through pairs. `new Map(Object.entries(obj))` turns an object into a map. `Object.fromEntries(map)` turns a map back into an object, and `[...map]` turns it into an array of pairs.

`Object.fromEntries(map)` turns each key into a string, so an object key becomes `"[object Object]"`.

`new Map()` is the better choice when keys are not strings, come from users, or change often. A plain object suits a record with fixed, known fields.

**Common mistake:** passing a map straight to `JSON.stringify`.

**Wrong**

```js
const scores = new Map([["Ada", 9], ["Bo", 7]]);

console.log(JSON.stringify(«scores»));
```

**Output**

```text
{}
```

**Fix**

```js
const scores = new Map([["Ada", 9], ["Bo", 7]]);

console.log(JSON.stringify(«Object.fromEntries(scores)»));
```

`JSON.stringify` sees only properties, and the pairs of a map are not properties. Convert the map to an object or to pairs first.

<!-- task -->

## Remember

- A `Map` key can be any value. An object key is found only by the same object.
- Use `set`, `get`, `has`, `delete` and `size`. Square brackets do not make entries.
- A `Map` keeps insertion order. `for...of` gives `[key, value]` pairs, and `forEach` passes the value first.
- Convert through pairs: `new Map(Object.entries(obj))`, `Object.fromEntries(map)` and `[...map]`.
