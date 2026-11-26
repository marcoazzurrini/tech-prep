# Converting to a String

## String() makes text

**Code**

```js
const values = [7, true, null, undefined];

for (const value of values) {
  const text = String(value);
  console.log(text, text.length);
}
```

**Output**

```text
7 1
true 4
null 4
undefined 9
```

```steps
String(7) => "7"
String(true) => "true"
String(null) => "null"
String(undefined) => "undefined"
`${null}` => "null"
```

**Rule:** `String(value)` converts a value to a string, and a template literal converts each `${}` the same way. `null` becomes the text `"null"`, and `undefined` becomes `"undefined"`.

`String(-0)` gives `"0"`. The minus sign is lost.

`String(Symbol("id"))` gives `"Symbol(id)"`. In a template literal, a symbol throws a `TypeError`.

**Common mistake:** calling `.toString()` on a value that can be `null`.

**Wrong**

```js
const user = { name: "Ada", nickname: null };

console.log(user.nickname.toString());
```

**Error**

```text
TypeError: null is not an object (evaluating 'user.nickname.toString')
```

**Fix**

```js
const user = { name: "Ada", nickname: null };

console.log(«String(user.nickname)»);
```

`null` and `undefined` have no methods, so `.toString()` throws. `String()` works for every value.

<!-- task -->

## Arrays and objects

**Code**

```js
const tags = ["js", "ts", "css"];
const user = { name: "Ada" };

console.log(String(tags));
console.log(`Tags: ${tags}`);
console.log(String(user));
console.log(`User: ${user}`);
```

**Output**

```text
js,ts,css
Tags: js,ts,css
[object Object]
User: [object Object]
```

```steps
String([1, 2, 3]) => "1,2,3"
String([]) => ""
String([1, [2, 3]]) => "1,2,3"
String([null, 1, undefined]) => ",1,"
String({ a: 1 }) => "[object Object]"
```

**Rule:** An array becomes its items as text, joined by commas with no spaces. A plain object, one written with `{ }`, becomes `"[object Object]"`, whatever it holds.

`String([null, 1, undefined])` gives `",1,"`. Inside an array, `null` and `undefined` become empty text.

**Common mistake:** putting an object in a template literal.

**Wrong**

```js
const order = { id: 7, total: 30 };

console.log(`Saved ${order}`);
```

**Output**

```text
Saved [object Object]
```

**Fix**

```js
const order = { id: 7, total: 30 };

console.log(`Saved ${«JSON.stringify(order)»}`);
```

The template converted the object to `[object Object]`. `JSON.stringify` gives text that shows the content. You can also print one property, such as `order.id`.

<!-- task -->

## Numbers as text

**Code**

```js
console.log(String(1.50));
console.log(String(0.1 + 0.2));
console.log(String(123456789));
console.log(String(1e21));
console.log(String(0.0000005));
```

**Output**

```text
1.5
0.30000000000000004
123456789
1e+21
5e-7
```

```steps
String(1e20) => "100000000000000000000"
String(«1e21») => "1e+21"
String(0.000001) => "0.000001"
String(«0.0000001») => "1e-7"
```

**Rule:** A number becomes the shortest text that reads back as the same number. From `1e21` up, and for a fraction smaller than `0.000001`, the text uses the `e` form.

`1e21` is 1 with 21 zeros after it. `5e-7` is `0.0000005`: the 5 sits seven places after the point.

`String(10n)` gives `"10"`. The `n` of a BigInt is not part of the text.

<!-- task -->

## Remember

- `String(value)` works for every value. `${value}` converts the same way: `"null"`, `"undefined"`, `"true"`.
- An array becomes its items joined by commas. Its `null` and `undefined` items become empty text.
- A plain object becomes `"[object Object]"`.
- Very large and very small numbers use the `e` form: `"1e+21"`, `"5e-7"`.
