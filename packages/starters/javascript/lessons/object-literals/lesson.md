# Object Literals

## Keys are strings

**Code**

```js
const seats = { 12: "Ada", 13: "Bo" };

console.log(seats[12]);
console.log(seats["12"]);
console.log(JSON.stringify(seats));
```

**Output**

```text
Ada
Ada
{"12":"Ada","13":"Bo"}
```

**Rule:** A key is always a string or a symbol. A key of any other type is converted to a string, so `seats[12]` and `seats["12"]` read the same property.

`{ "full name": "Ada" }` has a key with a space in it. A key that is not a plain name needs quotes.

`{ a: 1, a: 2 }` gives one key `a` with the value `2`. A repeated key is not an error: the last value wins.

**Common mistake:** using an object as a key.

**Wrong**

```js
const desks = {};

function assign(person, desk) {
  desks[«person»] = desk;
}

assign({ id: "u1", name: "Ada" }, "window");
assign({ id: "u2", name: "Bo" }, "door");

console.log(JSON.stringify(desks));
```

**Output**

```text
{"[object Object]":"door"}
```

**Fix**

```js
const desks = {};

function assign(person, desk) {
  desks[«person.id»] = desk;
}

assign({ id: "u1", name: "Ada" }, "window");
assign({ id: "u2", name: "Bo" }, "door");

console.log(JSON.stringify(desks));
```

Both objects became the same string, `"[object Object]"`. The second assignment replaced the first. Use a string that differs for each object, such as an id.

<!-- task -->

## Shorthand and methods

**Code**

```js
const name = "tea";
const price = 3;

const item = {
  name,
  price,
  label() {
    return `${this.name} costs ${this.price}`;
  },
};

console.log(item.name);
console.log(item.label());
```

**Output**

```text
tea
tea costs 3
```

**Rule:** `{ name }` is short for `{ name: name }`: the variable's name is the key, and its value is the value. `label() { ... }` is short for `label: function () { ... }`.

`{ price }` copies the value of `price` at that moment. Changing the variable later does not change the object.

`{ name, price: 5, label() {} }` mixes the three forms. Each property picks its own.

<!-- task -->

## Computed keys

**Code**

```js
const field = "email";

const update = {
  [field]: "ada@example.com",
  [`${field}Checked`]: true,
  ["is" + "New"]: false,
};

console.log(JSON.stringify(update));
```

**Output**

```text
{"email":"ada@example.com","emailChecked":true,"isNew":false}
```

**Rule:** `[expression]` in the place of a key is a **computed key**. The expression is evaluated, and its value becomes the key.

`{ [1 + 1]: "two" }` has the key `"2"`. The value of the expression is converted to a string, like every key.

**Common mistake:** leaving out the brackets.

**Wrong**

```js
function setting(name, value) {
  return { «name»: value };
}

console.log(JSON.stringify(setting("theme", "dark")));
```

**Output**

```text
{"name":"dark"}
```

**Fix**

```js
function setting(name, value) {
  return { «[name]»: value };
}

console.log(JSON.stringify(setting("theme", "dark")));
```

Without brackets, the key is the word `name` itself. The brackets say: use the value of `name` as the key.

<!-- task -->

## Remember

- A key is a string or a symbol. Any other key becomes a string: `obj[1]` is `obj["1"]`.
- Two objects used as keys both become `"[object Object]"`.
- `{ name }` means `{ name: name }`, and `label() {}` defines a method.
- `{ [expr]: value }` uses the value of `expr` as the key.
