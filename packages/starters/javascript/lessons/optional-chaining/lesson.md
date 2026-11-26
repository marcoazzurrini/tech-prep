# Optional Chaining

## ?. stops at a missing value

**Code**

```js
const paid = { id: 1, customer: { name: "Ada" } };
const anonymous = { id: 2, customer: null };

console.log(paid.customer?.name);
console.log(anonymous.customer?.name);
console.log(anonymous.customer?.name ?? "guest");
```

**Output**

```text
Ada
undefined
guest
```

**Rule:** `a?.b` gives `undefined` when `a` is `null` or `undefined`. Otherwise it is the same as `a.b`. This is called **optional chaining**.

`a?.b ?? "guest"` gives `"guest"` when the chain stopped. `??` turns the `undefined` into a default.

`""?.length` gives `0`. Only `null` and `undefined` stop the chain, not the other falsy values.

**Common mistake:** assigning through `?.`.

**Wrong**

```js
const settings = { theme: null };

settings.theme?.colour = "red";
console.log(settings.theme);
```

**Error**

```text
SyntaxError: Invalid assignment target
```

**Fix**

```js
const settings = { theme: null };

«if (settings.theme) {
  settings.theme.colour = "red";
}»
console.log(settings.theme);
```

`?.` can read a value, but it cannot stand on the left of `=`. This is a `SyntaxError`, so the program does not start. Test the object first, then assign.

<!-- task -->

## Indexes and calls

**Code**

```js
const plugin = {
  tags: null,
  onSave: null,
  onOpen: (file) => `opened ${file}`,
};

console.log(plugin.tags?.[0]);
console.log(plugin.onSave?.("notes.txt"));
console.log(plugin.onOpen?.("notes.txt"));
```

**Output**

```text
undefined
undefined
opened notes.txt
```

**Rule:** `a?.[key]` reads an index or a key only when `a` is not `null` or `undefined`. `fn?.()` calls `fn` only when `fn` is not `null` or `undefined`. Both forms keep the dot: `?.[` and `?.(`.

**Common mistake:** expecting `?.()` to skip a value that is not a function.

**Wrong**

```js
const plugin = { onSave: "yes" };

console.log(plugin.onSave?.());
```

**Error**

```text
TypeError: plugin.onSave is not a function. (In 'plugin.onSave?.()', 'plugin.onSave' is "yes")
```

**Fix**

```js
const plugin = { onSave: "yes" };

console.log(«typeof plugin.onSave === "function" ? plugin.onSave() : undefined»);
```

`?.()` tests only for `null` and `undefined`. The text `"yes"` is neither, so the call went ahead and failed. Test with `typeof` when the value can be anything.

<!-- task -->

## The rest is skipped

**Code**

```js
function nextSeat() {
  console.log("picking a seat");
  return 1;
}

function seatOn(trip) {
  return trip?.seats[nextSeat()].toUpperCase();
}

console.log(seatOn({ seats: ["4a", "4b"] }));
console.log(seatOn(null));
```

**Output**

```text
picking a seat
4B
undefined
```

**Rule:** When the value before `?.` is `null` or `undefined`, the whole rest of the chain is skipped: every later property, index and call. But `?.` guards only the value on its left. A later step can still throw.

`(trip?.seats).length` throws when `trip` is `null`. Parentheses end the chain, so `.length` is not skipped.

**Common mistake:** guarding the wrong step.

**Wrong**

```js
function cityOf(user) {
  return user?.address.city;
}

console.log(cityOf({ name: "Bo" }));
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'user?.address.city')
```

**Fix**

```js
function cityOf(user) {
  return user?.address«?.»city;
}

console.log(cityOf({ name: "Bo" }));
```

`user` was there, so the chain went on. The missing value was `address`, and nothing guarded it. Put `?.` after each value that may be missing. Chrome and Node word this error as `Cannot read properties of undefined (reading 'city')`.

<!-- task -->

## Remember

- `a?.b`, `a?.[key]` and `fn?.()` give `undefined` when the value on the left is `null` or `undefined`.
- A stop skips the whole rest of the chain.
- `?.` guards only the value on its left. Later steps can still throw.
- You cannot assign to `a?.b`. Add `?? fallback` for a default.
