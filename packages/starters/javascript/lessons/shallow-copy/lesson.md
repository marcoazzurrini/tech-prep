# Shallow Copies

## Object.assign

**Code**

```js
const user = { name: "Ada", address: { city: "Turin" } };
const badge = { role: "admin" };

const copy = Object.assign({}, user, badge);
copy.name = "Ben";

console.log(JSON.stringify(copy));
console.log(user.name);
console.log(copy.address === user.address);
```

**Output**

```text
{"name":"Ben","address":{"city":"Turin"},"role":"admin"}
Ada
true
```

**Rule:** `Object.assign(target, ...sources)` copies the properties of each source into `target`, then returns `target`. With `{}` as the target, the result is a shallow copy: a new object that holds the same values. A nested object is not copied. Both hold the same one.

`Object.assign({}, a, b)` gives the same as `{ ...a, ...b }`. A later source wins.

**Common mistake:** merging into the defaults.

**Wrong**

```js
const defaults = { theme: "light", size: 14 };
const settings = Object.assign(«defaults», { size: 18 });

console.log(defaults.size);
console.log(settings === defaults);
```

**Output**

```text
18
true
```

**Fix**

```js
const defaults = { theme: "light", size: 14 };
const settings = Object.assign(«{}, defaults», { size: 18 });

console.log(defaults.size);
console.log(settings === defaults);
```

`Object.assign` changes its first argument and returns it. So `settings` was `defaults` itself. Start from `{}` to get a new object.

<!-- task -->

## Copying an array

**Code**

```js
const ada = { name: "Ada", points: 3 };
const ben = { name: "Ben", points: 5 };
const team = [ada, ben];

const copy = team.slice();
copy.reverse();

console.log(team[0].name);
console.log(copy[0].name);
console.log(copy[0] === ben);
console.log(Array.from(team)[0] === ada);
```

**Output**

```text
Ada
Ben
true
true
```

**Rule:** `list.slice()`, `Array.from(list)` and `[...list]` each make a shallow copy of an array: a new array that holds the same items. The copy has its own order and its own length. An item that is an object is not copied.

`Array.from("abc")` gives `["a", "b", "c"]`. Like spread, it takes any iterable.

**Common mistake:** editing the items of a copied array.

**Wrong**

```js
const team = [{ name: "Ada", points: 3 }];
const nextSeason = «team.slice()»;

nextSeason[0].points = 0;

console.log(team[0].points);
```

**Output**

```text
0
```

**Fix**

```js
const team = [{ name: "Ada", points: 3 }];
const nextSeason = «team.map((player) => ({ ...player }))»;

nextSeason[0].points = 0;

console.log(team[0].points);
```

The new array held the same player object as `team`. The fix copies each player too, so the copy goes two levels deep.

<!-- task -->

## Replace or reach in

**Code**

```js
const order = { id: 7, customer: { name: "Ada" }, items: ["pen"] };
const copy = { ...order };

copy.id = 8;
copy.customer = { name: "Ben" };
copy.items.push("ink");

console.log(order.id);
console.log(order.customer.name);
console.log(order.items.length);
```

**Output**

```text
7
Ada
2
```

**Rule:** A shallow copy has its own properties. Assigning to one, as in `copy.customer = ...`, replaces what the copy holds and leaves the original alone. Reaching into a nested object, as in `copy.items.push(...)`, changes the one object that both hold.

A copied array works the same way. `copy[0] = item` changes the copy only. `copy[0].name = "Ben"` shows in the original.

<!-- task -->

## Remember

- `Object.assign({}, obj)`, `{ ...obj }`, `list.slice()`, `Array.from(list)` and `[...list]` copy one level.
- `Object.assign(target, source)` changes `target` and returns it.
- Assigning to a property of the copy is safe. A change inside a nested object shows in the original.
- To separate a nested level, copy that level too.
