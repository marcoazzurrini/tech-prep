# Does a Property Exist?

## Missing or undefined

**Code**

```js
const form = { name: "Ada", phone: undefined };

console.log(form.phone);
console.log(form.fax);
console.log("phone" in form);
console.log("fax" in form);
```

**Output**

```text
undefined
undefined
true
false
```

**Rule:** `"key" in obj` gives `true` when the object has that key, whatever its value. Reading the value cannot tell: a key that holds `undefined` and a key that is not there both read as `undefined`.

`3 in { 3: "c" }` gives `true`. The left side is a key, so it is converted to a string.

**Common mistake:** testing for a key with its value.

**Wrong**

```js
const stock = { tea: 0, milk: 6 };

function describe(item) {
  if («stock[item]») {
    return `${item}: ${stock[item]} left`;
  }

  return `${item}: not sold here`;
}

console.log(describe("tea"));
console.log(describe("rice"));
```

**Output**

```text
tea: not sold here
rice: not sold here
```

**Fix**

```js
const stock = { tea: 0, milk: 6 };

function describe(item) {
  if («item in stock») {
    return `${item}: ${stock[item]} left`;
  }

  return `${item}: not sold here`;
}

console.log(describe("tea"));
console.log(describe("rice"));
```

The shop sells tea, but the count `0` is falsy, so the test failed. `in` asks whether the key is there and ignores the value.

<!-- task -->

## Own or inherited

**Code**

```js
const prices = { tea: 3 };

console.log("tea" in prices);
console.log("toString" in prices);
console.log(Object.hasOwn(prices, "tea"));
console.log(Object.hasOwn(prices, "toString"));
```

**Output**

```text
true
true
true
false
```

**Rule:** `in` also finds **inherited** properties, the ones every object can use without holding them itself, such as `toString`. `Object.hasOwn(obj, key)` finds only **own** properties, the ones the object holds itself.

`prices.hasOwnProperty("tea")` is the older way to write `Object.hasOwn(prices, "tea")`.

`"a" in "abc"` throws a `TypeError`. The right side of `in` must be an object.

**Common mistake:** testing a key from outside with `in`.

**Wrong**

```js
const coupons = { SAVE10: 10 };

function isValid(code) {
  return «code in coupons»;
}

console.log(isValid("SAVE10"));
console.log(isValid("constructor"));
```

**Output**

```text
true
true
```

**Fix**

```js
const coupons = { SAVE10: 10 };

function isValid(code) {
  return «Object.hasOwn(coupons, code)»;
}

console.log(isValid("SAVE10"));
console.log(isValid("constructor"));
```

`constructor` is another inherited property, so `in` found it. A key typed by a user can be any word. Test it with `Object.hasOwn`.

<!-- task -->

## delete removes it

**Code**

```js
const session = { user: "ada", token: "abc" };

console.log(delete session.token);
console.log("token" in session);
console.log(session.token);
console.log(delete session.token);
```

**Output**

```text
true
false
undefined
true
```

**Rule:** `delete obj.key` removes the property from the object. After it, `"key" in obj` gives `false`.

`delete obj.key` gives `true`, even when the key was not there.

`delete obj[name]` removes the key that the variable `name` holds.

**Common mistake:** assigning `undefined` to remove a key.

**Wrong**

```js
const cart = { tea: 2, milk: 1 };

«cart.milk = undefined»;

console.log("milk" in cart);
```

**Output**

```text
true
```

**Fix**

```js
const cart = { tea: 2, milk: 1 };

«delete cart.milk»;

console.log("milk" in cart);
```

Assigning `undefined` changes the value and keeps the key. The key still shows up when the object is listed or counted. `delete` takes the key away.

<!-- task -->

## Remember

- `"key" in obj` and `Object.hasOwn(obj, "key")` test for the key, not for its value.
- `in` also finds inherited properties such as `toString`. `Object.hasOwn` does not.
- `delete obj.key` removes a property. Assigning `undefined` keeps it.
- Never test for a key with `if (obj[key])`: `0`, `""` and `undefined` are falsy.
