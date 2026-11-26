# Spread

## Arrays and calls

**Code**

```js
const morning = [8, 9];
const evening = [18, 20];
const day = [...morning, 12, ...evening];
const copy = [...morning];

console.log(day);
console.log(copy === morning);
console.log(Math.max(...day));
console.log([..."tea"]);
```

**Output**

```text
[ 8, 9, 12, 18, 20 ]
false
20
[ "t", "e", "a" ]
```

**Rule:** In an array literal or a call, `...list` is spread: it expands an iterable into its items, one by one. So `[...list]` is a new array with the same items, and `f(...list)` passes each item as its own argument.

An iterable is a value that `for...of` can loop over, such as an array or a string.

**Common mistake:** passing an array where separate arguments are expected.

**Wrong**

```js
const prices = [30, 12, 45];

console.log(Math.min(prices));
```

**Output**

```text
NaN
```

**Fix**

```js
const prices = [30, 12, 45];

console.log(Math.min(«...»prices));
```

Without the dots, the whole array is one argument, and `Math.min` converts it to `NaN`. Spread passes three numbers.

<!-- task -->

## Later properties win

**Code**

```js
const defaults = { theme: "light", size: 14 };
const saved = { size: 18 };
const settings = { ...defaults, ...saved, sound: true };

console.log(JSON.stringify(settings));
console.log(JSON.stringify({ size: 10, ...saved }));
console.log(JSON.stringify({ ...saved, size: 10 }));
```

**Output**

```text
{"theme":"light","size":18,"sound":true}
{"size":18}
{"size":10}
```

**Rule:** In an object literal, `...obj` copies the properties of `obj` into the new object. When a key comes twice, the later one wins. So the order decides which value stays.

`{ ...null }` and `{ ...undefined }` give `{}`. In an array literal or a call, `...null` throws a `TypeError`.

`[...{ a: 1 }]` throws a `TypeError` too. A plain object is not iterable, so it spreads only into an object.

**Common mistake:** putting the defaults last.

**Wrong**

```js
function createUser(input) {
  return { ...input, role: "member" };
}

console.log(createUser({ name: "Ada", role: "admin" }).role);
```

**Output**

```text
member
```

**Fix**

```js
function createUser(input) {
  return { «role: "member", ...input» };
}

console.log(createUser({ name: "Ada", role: "admin" }).role);
```

The default came after the spread, so it replaced the role in `input`. Put defaults first and the values that must win last.

<!-- task -->

## One level deep

**Code**

```js
const user = { name: "Ada", address: { city: "Turin" } };
const copy = { ...user };

copy.name = "Ben";
copy.address.city = "Oslo";

console.log(user.name);
console.log(user.address.city);
console.log(copy.address === user.address);
```

**Output**

```text
Ada
Oslo
true
```

**Rule:** Spread copies one level only: the items of the array, or the properties of the object. A nested object is not copied. The copy and the original hold a reference to the same one.

**Common mistake:** changing a nested array through a copy.

**Wrong**

```js
const cart = { owner: "Ada", items: ["pen"] };
const next = { ...cart };

next.items.push("ink");
console.log(cart.items.length);
```

**Output**

```text
2
```

**Fix**

```js
const cart = { owner: "Ada", items: ["pen"] };
const next = { ...cart«, items: [...cart.items]» };

next.items.push("ink");
console.log(cart.items.length);
```

`next.items` and `cart.items` were the same array, so the push showed in both. The fix also copies the level that changes.

<!-- task -->

## Spread or rest

**Code**

```js
const scores = [70, 85, 92];
const [lowest, ...others] = scores;
const withBonus = [...others, 100];

const { id, ...fields } = { id: 1, name: "Ada" };
const renamed = { ...fields, name: "Ben" };

console.log(others);
console.log(withBonus);
console.log(JSON.stringify(fields));
console.log(JSON.stringify(renamed));
```

**Output**

```text
[ 85, 92 ]
[ 85, 92, 100 ]
{"name":"Ada"}
{"name":"Ben"}
```

**Rule:** The same three dots do two opposite jobs. In a pattern, on the left of `=`, they are rest: they collect many items into one new array or object. In a literal or a call, they are spread: they expand one array or object into many items.

Rest comes once, and last. Spread can come anywhere, any number of times: `[...a, 0, ...b]`.

`const copy = ...list` is a `SyntaxError`. Spread is not a value on its own: it needs `[ ]`, `{ }` or a call around it.

<!-- task -->

## Remember

- `[...list]` and `f(...list)` expand any iterable. `{ ...obj }` copies the properties of an object.
- A later property wins: `{ ...defaults, ...overrides }`.
- The copy is one level deep. Nested objects are shared with the original.
- `{ ...null }` is `{}`, but `[...null]` throws. In a pattern, the same dots are rest: they collect.
