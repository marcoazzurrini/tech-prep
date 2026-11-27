# Which Keys Does It See?

## Three questions per key

**Code**

```js
const tag = Symbol("tag");
const plan = { tier: "free" };
const user = Object.create(plan);
user.name = "Ada";
user[tag] = "vip";
Object.defineProperty(user, "id", { value: 7, enumerable: false });

const looped = [];
for (const key in user) looped.push(key);

console.log(looped.join(","));
console.log(Object.keys(user).join(","));
console.log(Object.getOwnPropertyNames(user).join(","));
console.log(Object.getOwnPropertySymbols(user).length);
console.log(Reflect.ownKeys(user).map(String).join(","));
```

**Output**

```text
name,tier
name
name,id
1
name,id,Symbol(tag)
```

**Rule:** Each tool asks three questions about a key: own or inherited, enumerable or not, string or symbol. `for...in` lists enumerable string keys, inherited ones too. `Object.keys` lists own enumerable string keys. `Object.getOwnPropertyNames` lists own string keys, hidden ones too. `Object.getOwnPropertySymbols` lists own symbol keys. `Reflect.ownKeys` lists every own key.

Every tool keeps one order: whole-number keys, then the other strings in the order they were added, then symbols. `for...in` then goes on to the keys of the prototype.

**Common mistake:** testing for an empty object with `Object.keys`.

**Wrong**

```js
const session = { [Symbol("token")]: "abc" };
const isEmpty = (obj) => «Object.keys(obj)».length === 0;

console.log(isEmpty(session));
```

**Output**

```text
true
```

**Fix**

```js
const session = { [Symbol("token")]: "abc" };
const isEmpty = (obj) => «Reflect.ownKeys(obj)».length === 0;

console.log(isEmpty(session));
```

**Output**

```text
false
```

`Object.keys` skips symbol keys and hidden keys, so the object looked empty. `Reflect.ownKeys` sees every own key.

<!-- task -->

## Copies and JSON

**Code**

```js
const id = Symbol("id");
const order = { item: "tea", [id]: 41 };
Object.defineProperty(order, "paid", { value: true, enumerable: false });

const spread = { ...order };
const assigned = Object.assign({}, order);

console.log(Reflect.ownKeys(spread).map(String).join(","));
console.log(Reflect.ownKeys(assigned).map(String).join(","));
console.log(JSON.stringify(order));
```

**Output**

```text
item,Symbol(id)
item,Symbol(id)
{"item":"tea"}
```

**Rule:** Spread and `Object.assign` copy own enumerable keys, symbol keys included. `JSON.stringify` writes own enumerable string keys only. None of them takes a hidden key or an inherited one.

`Object.assign(target, source)` assigns each key with `=`, so a setter on `target` runs. Spread always makes a new object.

Both read a getter on the source and copy the value it gives, not the getter.

**Common mistake:** hiding data under a symbol key.

**Wrong**

```js
const secret = Symbol("password");
const user = { name: "Ada", «[secret]: "s3cret"» };

const copy = { ...user };
console.log(copy[secret]);
```

**Output**

```text
s3cret
```

**Fix**

```js
const secret = Symbol("password");
const user = { name: "Ada" };
«Object.defineProperty(user, secret, { value: "s3cret" });»

const copy = { ...user };
console.log(copy[secret]);
```

**Output**

```text
undefined
```

A symbol key is not private. Spread and `Object.assign` copy it, and `Reflect.ownKeys` lists it. A key with `enumerable: false` stays behind. For real privacy, use a `#` field in a class.

<!-- task -->

## Arrays and for...in

**Code**

```js
const scores = [80, 95];
scores.best = 95;

for (const i in scores) {
  console.log(i, typeof i);
}

console.log(Object.keys(scores).join(","));
console.log(Object.getOwnPropertyNames(scores).join(","));
```

**Output**

```text
0 string
1 string
best string
0,1,best
0,1,length,best
```

**Rule:** An array's indexes are string keys like any other. `for...in` and `Object.keys` give them as strings, with any other enumerable key the array has. `length` is an own key with `enumerable: false`, so only `Object.getOwnPropertyNames` and `Reflect.ownKeys` show it.

`for...in` also visits enumerable keys that code added to `Array.prototype`. `for...of` gives the values and nothing else.

**Common mistake:** doing maths with the key from `for...in`.

**Wrong**

```js
const laps = [62, 58, 60];

for (const i «in laps») {
  console.log(`Lap ${i + 1}: ${laps[i]}`);
}
```

**Output**

```text
Lap 01: 62
Lap 11: 58
Lap 21: 60
```

**Fix**

```js
const laps = [62, 58, 60];

for (const i «of laps.keys()») {
  console.log(`Lap ${i + 1}: ${laps[i]}`);
}
```

**Output**

```text
Lap 1: 62
Lap 2: 58
Lap 3: 60
```

The key from `for...in` is a string, so `+ 1` joined text. `laps.keys()` gives the indexes as numbers.

<!-- task -->

## Remember

- `for...in` lists enumerable string keys, own and inherited. `Object.keys` and `JSON.stringify` take own enumerable string keys.
- `Object.getOwnPropertyNames` adds hidden string keys. `Object.getOwnPropertySymbols` lists symbols. `Reflect.ownKeys` lists every own key.
- Spread and `Object.assign` copy own enumerable keys, symbols included.
- Every tool lists whole-number keys first, then strings in the order added, then symbols.
