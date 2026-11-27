# Symbols

## Every symbol is unique

**Code**

```js
const a = Symbol("id");
const b = Symbol("id");

console.log(typeof a);
console.log(a === b);
console.log(a.description);
```

**Output**

```text
symbol
false
id
```

```steps
typeof Symbol("id") => "symbol"
Symbol("id") === Symbol("id") => false
Symbol("id").description => "id"
String(Symbol("id")) => "Symbol(id)"
```

**Rule:** `Symbol()` creates a unique primitive value every time. The string passed to it is only a label, so two symbols with the same label are never equal.

`new Symbol()` throws a `TypeError`. Call `Symbol()` without `new`.

**Common mistake:** joining a symbol with a string.

**Wrong**

```js
const tag = Symbol("tag");
console.log("Tag: " + tag);
```

**Error**

```text
TypeError: Cannot convert a symbol to a string
```

**Fix**

```js
const tag = Symbol("tag");
console.log("Tag: " + «String(tag)»);
```

JavaScript refuses to turn a symbol into a string automatically. Convert it explicitly with `String(tag)` or read `tag.description`.

<!-- task -->

## Hidden property keys

**Code**

```js
const secret = Symbol("pin");
const account = {
  owner: "Ada",
  [secret]: 4812,
};

console.log(account[secret]);
console.log(Object.keys(account));
console.log(Object.getOwnPropertySymbols(account).length);
```

**Output**

```text
4812
[ "owner" ]
1
```

**Rule:** A symbol can be an object key when written in brackets `[key]`. Symbol keys never clash with string keys or with other symbols, and `Object.keys`, `for...in` and `JSON.stringify` skip them.

`Object.getOwnPropertySymbols(account)` returns an array of all own symbol keys on the object, even non-enumerable ones.

`{ ...account }` and `Object.assign({}, account)` copy enumerable symbol keys along with string keys.

**Common mistake:** leaving out the square brackets in a literal.

**Wrong**

```js
const id = Symbol("id");
const ticket = { «id»: 901 };

console.log(ticket[id]);
```

**Output**

```text
undefined
```

**Fix**

```js
const id = Symbol("id");
const ticket = { «[id]»: 901 };

console.log(ticket[id]);
```

Without brackets, `{ id: 901 }` uses the string key `"id"`. Brackets evaluate the variable `id` and use the symbol itself.

<!-- task -->

## Shared global symbols

**Code**

```js
const first = Symbol.for("app.token");
const second = Symbol.for("app.token");
const local = Symbol("app.token");

console.log(first === second);
console.log(first === local);
console.log(Symbol.keyFor(first));
console.log(Symbol.keyFor(local));
```

**Output**

```text
true
false
app.token
undefined
```

**Rule:** `Symbol.for(key)` looks up `key` in a shared global registry and returns the same symbol every time. `Symbol.keyFor(sym)` returns that registry key, or `undefined` for a local symbol.

`Symbol("app.token")` always makes a fresh local symbol that is not in the registry.

**Common mistake:** expecting `Symbol.for` to match a local `Symbol`.

**Wrong**

```js
const key = Symbol("role");
const user = { [key]: "admin" };

console.log(user[«Symbol.for("role")»]);
```

**Output**

```text
undefined
```

**Fix**

```js
const key = «Symbol.for("role")»;
const user = { [key]: "admin" };

console.log(user[Symbol.for("role")]);
```

`Symbol("role")` is not stored in the global registry, so `Symbol.for("role")` creates a different symbol. Use `Symbol.for` on both sides to share a key.

<!-- task -->

## Remember

- Every `Symbol()` call returns a unique primitive. It never converts to a string automatically.
- Use `[sym]` to store or read a symbol key on an object.
- `Object.keys`, `for...in` and `JSON.stringify` skip symbol keys. `Object.getOwnPropertySymbols` lists them, and spread copies enumerable ones.
- `Symbol.for(name)` shares a symbol across the whole app. `Symbol.keyFor(sym)` reads back its registry name.
