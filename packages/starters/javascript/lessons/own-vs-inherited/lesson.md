# Own and Inherited Properties

## Two kinds of tools

**Code**

```js
const base = { currency: "EUR", country: "IT" };
const order = Object.create(base);
order.id = 7;
order.total = 20;

console.log(Object.keys(order).join(","));
console.log("currency" in order, Object.hasOwn(order, "currency"));

const seen = [];
for (const key in order) {
  seen.push(key);
}

console.log(seen.join(","));
```

**Output**

```text
id,total
true false
id,total,currency,country
```

**Rule:** An **own** property sits on the object itself. An **inherited** one is read from the prototype chain. `Object.keys`, `Object.values`, `Object.entries` and `Object.hasOwn` see own properties only. `in` and `for...in` see inherited ones too.

`for...in` skips `toString` and the other built-in methods. They are not enumerable: they have `enumerable: false`.

**Common mistake:** counting keys with `for...in`.

**Wrong**

```js
const blank = { status: "draft" };
const form = Object.create(blank);
form.name = "Ada";
form.city = "Rome";

let filled = 0;
for (const key «in form») {
  filled += 1;
}

console.log(filled);
```

**Output**

```text
3
```

**Fix**

```js
const blank = { status: "draft" };
const form = Object.create(blank);
form.name = "Ada";
form.city = "Rome";

let filled = 0;
for (const key «of Object.keys(form)») {
  filled += 1;
}

console.log(filled);
```

**Output**

```text
2
```

`for...in` also counted `status`, which comes from the prototype. `Object.keys` gives the two keys the form holds itself.

<!-- task -->

## Own keys first

**Code**

```js
const base = { size: "M", colour: "blue" };
const shirt = Object.create(base);
shirt.colour = "red";
shirt.price = 20;

for (const key in shirt) {
  const where = Object.hasOwn(shirt, key) ? "own" : "inherited";
  console.log(key, shirt[key], where);
}
```

**Output**

```text
colour red own
price 20 own
size M inherited
```

**Rule:** `for...in` visits the object's own keys first, then the keys of each prototype up the chain. A key that is shadowed is visited once, and reads the own value. `Object.hasOwn(obj, key)` inside the loop tells the two kinds apart.

**Common mistake:** calling `hasOwnProperty` on data you do not control.

**Wrong**

```js
const answers = { hasOwnProperty: "yes", city: "Rome" };

console.log(«answers.hasOwnProperty("city")»);
```

**Error**

```text
TypeError: answers.hasOwnProperty is not a function. (In 'answers.hasOwnProperty("city")', 'answers.hasOwnProperty' is "yes")
```

**Fix**

```js
const answers = { hasOwnProperty: "yes", city: "Rome" };

console.log(«Object.hasOwn(answers, "city")»);
```

`hasOwnProperty` is an inherited method, so an own key with that name shadows it. `Object.hasOwn` lives on `Object` itself, so no key can hide it. Chrome and Node word the error as `answers.hasOwnProperty is not a function`.

<!-- task -->

## Copies keep own keys

**Code**

```js
const defaults = { theme: "dark", fontSize: 14 };
const settings = Object.create(defaults);
settings.language = "en";

const copy = { ...settings };

console.log(JSON.stringify(settings));
console.log(copy.theme, settings.theme);
console.log(Object.getPrototypeOf(copy) === Object.prototype);
```

**Output**

```text
{"language":"en"}
undefined dark
true
```

**Rule:** Spread, `Object.assign` and `JSON.stringify` take own properties only. The copy is a plain object whose prototype is `Object.prototype`, so the values it inherited are gone.

`structuredClone(settings)` gives `{ language: "en" }` too. It also copies own properties only.

**Common mistake:** saving an object that gets its values from a prototype.

**Wrong**

```js
const defaults = { theme: "dark", fontSize: 14 };
const settings = Object.create(defaults);
settings.language = "en";

console.log(JSON.stringify(«settings»));
```

**Output**

```text
{"language":"en"}
```

**Fix**

```js
const defaults = { theme: "dark", fontSize: 14 };
const settings = Object.create(defaults);
settings.language = "en";

«const flat = {};
for (const key in settings) {
  flat[key] = settings[key];
}»

console.log(JSON.stringify(«flat»));
```

**Output**

```text
{"language":"en","theme":"dark","fontSize":14}
```

The saved text lost the theme and the font size. `for...in` reaches the inherited keys, so it can build a flat object that holds every value.

<!-- task -->

## Remember

- An own property sits on the object. An inherited one is read from the chain.
- `Object.keys`, `Object.values`, `Object.entries` and `Object.hasOwn` see own properties only.
- `in` and `for...in` see inherited ones too. `for...in` visits own keys first.
- Spread, `Object.assign` and JSON copy own properties only. Prefer `Object.hasOwn` to `obj.hasOwnProperty`.
