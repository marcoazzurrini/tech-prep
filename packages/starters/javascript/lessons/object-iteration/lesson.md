# Looping over an Object

## Keys, values, entries

**Code**

```js
const stock = { tea: 4, milk: 0, rice: 9 };

console.log(Object.keys(stock).join(", "));
console.log(Object.values(stock).join(", "));

for (const [item, count] of Object.entries(stock)) {
  console.log(`${item}: ${count}`);
}
```

**Output**

```text
tea, milk, rice
4, 0, 9
tea: 4
milk: 0
rice: 9
```

**Rule:** `Object.keys(obj)`, `Object.values(obj)` and `Object.entries(obj)` give an object's own keys, its values and its `[key, value]` pairs. Each one gives a new array, in the object's key order.

`Object.keys(stock).length` gives `3`, the number of keys. An object has no `length` of its own.

`Object.keys({ 7: "a" })` gives `["7"]`. A key always comes back as a string.

**Common mistake:** looping over an object with `for...of`.

**Wrong**

```js
const stock = { tea: 4, milk: 0 };

for (const item of «stock») {
  console.log(item);
}
```

**Error**

```text
TypeError: {} is not iterable
```

**Fix**

```js
const stock = { tea: 4, milk: 0 };

for (const item of «Object.keys(stock)») {
  console.log(item);
}
```

`for...of` needs an iterable, such as an array or a string. A plain object is not one. `Object.keys` gives an array to loop over. Chrome and Node word this error as `stock is not iterable`.

<!-- task -->

## Build with fromEntries

**Code**

```js
const prices = { tea: 3, milk: 2 };

const pairs = Object.entries(prices).map(([item, price]) => [item, price * 2]);
const doubled = Object.fromEntries(pairs);

console.log(JSON.stringify(pairs));
console.log(JSON.stringify(doubled));
```

**Output**

```text
[["tea",6],["milk",4]]
{"tea":6,"milk":4}
```

**Rule:** `Object.fromEntries(pairs)` builds an object from `[key, value]` pairs: the opposite of `Object.entries`. Together they turn an object into an array, let you change it with array methods, and turn it back.

`Object.fromEntries([["a", 1], ["a", 2]])` gives `{ a: 2 }`. A repeated key keeps the last value.

**Common mistake:** calling an array method on an object.

**Wrong**

```js
const stock = { tea: 4, milk: 0 };

const available = «stock.filter((count) => count > 0)»;

console.log(JSON.stringify(available));
```

**Error**

```text
TypeError: stock.filter is not a function. (In 'stock.filter((count) => count > 0)', 'stock.filter' is undefined)
```

**Fix**

```js
const stock = { tea: 4, milk: 0 };

const available = «Object.fromEntries(Object.entries(stock).filter(([, count]) => count > 0))»;

console.log(JSON.stringify(available));
```

An object has no `filter`, `map` or `reduce`. Take the entries, use the array method on them, and build the object back.

<!-- task -->

## for...in

**Code**

```js
const stock = { tea: 4, milk: 0 };

for (const item in stock) {
  console.log(item, stock[item]);
}
```

**Output**

```text
tea 4
milk 0
```

**Rule:** `for (const key in obj)` runs once for each key of the object. The key is always a string.

`for...in` also visits properties that the object inherits, though not built-in ones such as `toString`. `Object.keys` gives own keys only, so it is the safer choice.

**Common mistake:** using `for...in` on an array.

**Wrong**

```js
const scores = [10, 20, 30];

for (const score «in» scores) {
  console.log(score + 1);
}
```

**Output**

```text
01
11
21
```

**Fix**

```js
const scores = [10, 20, 30];

for (const score «of» scores) {
  console.log(score + 1);
}
```

`for...in` gave the keys of the array: the strings `"0"`, `"1"` and `"2"`. Adding `1` to a string joins text. `for...of` gives the values.

<!-- task -->

## Remember

- `Object.keys`, `Object.values` and `Object.entries` give arrays of an object's own keys, values and pairs.
- `Object.fromEntries` builds an object from pairs. Entries, an array method, then `fromEntries` changes an object.
- A plain object is not iterable: `for...of` on it throws.
- `for...in` gives keys as strings, and inherited ones too. Do not use it on an array.
