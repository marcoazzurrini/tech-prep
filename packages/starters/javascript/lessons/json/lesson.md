# JSON

## What stringify drops

**Code**

```js
const data = {
  title: "Book",
  pages: NaN,
  note: undefined,
  print() {},
  [Symbol("id")]: 7,
  tags: ["js", undefined, () => {}],
};

console.log(JSON.stringify(data));
console.log(JSON.stringify(undefined));
```

**Output**

```text
{"title":"Book","pages":null,"tags":["js",null,null]}
undefined
```

**Rule:** `JSON.stringify` converts objects, arrays, strings, numbers, booleans and `null` to JSON text. In an object it drops `undefined`, functions and symbols. In an array it turns them into `null`, and `NaN` or `Infinity` becomes `null` everywhere.

`JSON.stringify(undefined)` and `JSON.stringify(() => {})` return `undefined`, not a string.

`JSON.stringify(10n)` throws a `TypeError`. `BigInt` values cannot be turned into JSON directly.

**Common mistake:** passing an object with a circular reference.

**Wrong**

```js
const node = { name: "root" };
node.self = node;
console.log(JSON.stringify(node));
```

**Error**

```text
TypeError: JSON.stringify cannot serialize cyclic structures.
```

**Fix**

```js
const node = { name: "root" };
node.self = node;
console.log(JSON.stringify(node, «["name"]»));
```

`JSON.stringify` throws a `TypeError` when an object points back to itself. Pass an array of keys as the second argument to leave out the cyclic property.

<!-- task -->

## Filtering with a replacer

**Code**

```js
const order = { item: "Tea", price: 4, secret: "x9" };

console.log(JSON.stringify(order, ["item", "price"]));
console.log(
  JSON.stringify(order, (key, value) => (key === "secret" ? undefined : value))
);
```

**Output**

```text
{"item":"Tea","price":4}
{"item":"Tea","price":4}
```

**Rule:** The second argument to `JSON.stringify` is a replacer. An array replacer keeps only the listed keys. A function replacer runs for every `(key, value)` pair, and returning `undefined` drops that property.

`JSON.stringify` calls a replacer function on the root value first with `key` set to `""`.

**Common mistake:** forgetting that an array replacer filters nested objects too.

**Wrong**

```js
const post = { title: "News", author: { name: "Ada" } };
console.log(JSON.stringify(post, «["title", "author"]»));
```

**Output**

```text
{"title":"News","author":{}}
```

**Fix**

```js
const post = { title: "News", author: { name: "Ada" } };
console.log(JSON.stringify(post, «["title", "author", "name"]»));
```

The allow list applies at every nesting level. `"name"` was missing from the array, so `author` became `{}`.

<!-- task -->

## Custom output with toJSON

**Code**

```js
const price = {
  amount: 25,
  currency: "EUR",
  toJSON() {
    return `${this.amount} ${this.currency}`;
  },
};

console.log(JSON.stringify({ total: price }));
```

**Output**

```text
{"total":"25 EUR"}
```

**Rule:** If an object has a `toJSON()` method, `JSON.stringify` calls it and encodes its return value instead of the object itself.

`new Date().toJSON()` is why dates turn into ISO date strings in JSON.

**Common mistake:** returning a JSON string from `toJSON()`.

**Wrong**

```js
const box = {
  size: 10,
  toJSON() {
    return «JSON.stringify({ size: this.size })»;
  },
};

console.log(JSON.stringify(box));
```

**Output**

```text
"{\"size\":10}"
```

**Fix**

```js
const box = {
  size: 10,
  toJSON() {
    return «{ size: this.size }»;
  },
};

console.log(JSON.stringify(box));
```

`JSON.stringify` already encodes whatever `toJSON()` returns. Calling `JSON.stringify` inside `toJSON()` encodes it twice.

<!-- task -->

## Parsing with a reviver

**Code**

```js
const raw = '{"item":"Lamp","price":"12.5","internal":true}';

const parsed = JSON.parse(raw, (key, value) => {
  if (key === "price") return Number(value);
  if (key === "internal") return undefined;
  return value;
});

console.log(parsed.price, typeof parsed.price);
console.log("internal" in parsed);
```

**Output**

```text
12.5 number
false
```

**Rule:** `JSON.parse(text, reviver)` turns JSON text back into a value and runs `reviver(key, value)` from the deepest keys up to the root. Returning `undefined` deletes that property.

`JSON.parse("{a: 1}")` throws a `SyntaxError`. JSON requires double quotes on keys and strings, and no trailing commas.

**Common mistake:** forgetting to return unchanged values in a reviver.

**Wrong**

```js
const raw = '{"name":"Ada","score":"10"}';
const result = JSON.parse(raw, (key, value) => {
  if (key === "score") return Number(value);
});
console.log(result);
```

**Output**

```text
undefined
```

**Fix**

```js
const raw = '{"name":"Ada","score":"10"}';
const result = JSON.parse(raw, (key, value) => {
  if (key === "score") return Number(value);
  «return value;»
});
console.log(result);
```

When a reviver does not return anything, it returns `undefined`. That deletes every unmatched key and the root object itself.

<!-- task -->

## Remember

- `JSON.stringify` drops `undefined`, functions and symbols in objects, and turns them into `null` in arrays. `NaN` and `Infinity` become `null`.
- Circular references and `BigInt` values throw a `TypeError` in `JSON.stringify`.
- A replacer filters or transforms values during `JSON.stringify`. A `toJSON()` method returns the plain value to encode.
- `JSON.parse(text, reviver)` transforms parsed values bottom-up. Always return `value` for keys you want to keep.
