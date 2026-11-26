# Updating without Mutating

## Copy the path

**Code**

```js
const state = {
  user: { name: "Ada", address: { city: "Turin", zip: "10100" } },
  settings: { theme: "dark" },
};

const next = {
  ...state,
  user: {
    ...state.user,
    address: { ...state.user.address, city: "Oslo" },
  },
};

console.log(state.user.address.city);
console.log(next.user.address.city, next.user.address.zip);
console.log(next.user === state.user);
console.log(next.settings === state.settings);
```

**Output**

```text
Turin
Oslo 10100
false
true
```

**Rule:** To mutate an object is to change it in place. An immutable update does not mutate: it returns a new value and leaves the old one as it was. Copy every object on the path from the top down to the change. Reuse everything else as it is.

`next.settings === state.settings` gives `true`. One `===` tells that the settings did not change.

**Common mistake:** leaving out the spread at a nested level.

**Wrong**

```js
const profile = { name: "Ada", contact: { email: "ada@old.io", phone: "555" } };

const next = { ...profile, contact: { «email: "ada@new.io"» } };

console.log(next.contact.phone);
```

**Output**

```text
undefined
```

**Fix**

```js
const profile = { name: "Ada", contact: { email: "ada@old.io", phone: "555" } };

const next = { ...profile, contact: { «...profile.contact, email: "ada@new.io"» } };

console.log(next.contact.phone);
```

The new `contact` object replaced the old one, so `phone` was lost. Spread the old level first, then write the change.

<!-- task -->

## Add and remove items

**Code**

```js
const cart = ["pen", "ink", "cap"];

const added = [...cart, "pad"];
const removed = cart.filter((item) => item !== "ink");
const inserted = [...cart.slice(0, 1), "pad", ...cart.slice(1)];

console.log(added.join(" "));
console.log(removed.join(" "));
console.log(inserted.join(" "));
console.log(cart.join(" "));
```

**Output**

```text
pen ink cap pad
pen cap
pen pad ink cap
pen ink cap
```

**Rule:** `push`, `pop`, `splice` and `sort` mutate the array: they change it in place. To leave it as it was, build a new array instead. Spread adds an item, `filter` removes one, and `slice` with spread inserts one.

`[...list].sort()` sorts a copy and leaves `list` in its order.

`list.toSpliced(1, 1)` returns a new array without the item at index 1.

**Common mistake:** using the result of `push`.

**Wrong**

```js
const cart = { owner: "Ada", items: ["pen"] };
const next = { ...cart, items: «cart.items.push("ink")» };

console.log(next.items);
console.log(cart.items.length);
```

**Output**

```text
2
2
```

**Fix**

```js
const cart = { owner: "Ada", items: ["pen"] };
const next = { ...cart, items: «[...cart.items, "ink"]» };

console.log(next.items);
console.log(cart.items.length);
```

`push` changes the old array and returns its new length, not the array. So `next.items` was the number `2`.

<!-- task -->

## Update one item

**Code**

```js
const tasks = [
  { id: 1, title: "Write", done: false },
  { id: 2, title: "Test", done: false },
];

const next = tasks.map((task) => (task.id === 2 ? { ...task, done: true } : task));

console.log(tasks[1].done);
console.log(next[1].done);
console.log(next[0] === tasks[0]);
console.log(next[1] === tasks[1]);
```

**Output**

```text
false
true
true
false
```

**Rule:** To update one item of an array, use `map`. Return a new object for the item that changes. Return the same object for every other item.

`list.with(1, item)` returns a new array with `item` at index 1.

**Common mistake:** changing the item inside `map`.

**Wrong**

```js
const tasks = [{ id: 1, done: false }];

const next = tasks.map((task) => {
  «task.done = true;»
  return task;
});

console.log(tasks[0].done);
console.log(next[0] === tasks[0]);
```

**Output**

```text
true
true
```

**Fix**

```js
const tasks = [{ id: 1, done: false }];

const next = tasks.map((task) => {
  return «{ ...task, done: true }»;
});

console.log(tasks[0].done);
console.log(next[0] === tasks[0]);
```

`map` made a new array, but the callback changed the old task and returned it. The fix returns a new task.

<!-- task -->

## Add and remove keys

**Code**

```js
const prices = { pen: 2, ink: 5 };
const item = "pad";

const added = { ...prices, [item]: 3 };
const { ink, ...removed } = prices;

console.log(JSON.stringify(added));
console.log(JSON.stringify(removed));
console.log(JSON.stringify(prices));
```

**Output**

```text
{"pen":2,"ink":5,"pad":3}
{"pen":2}
{"pen":2,"ink":5}
```

**Rule:** `{ ...obj, [key]: value }` adds or replaces a key in a new object. A rest pattern removes one: it takes the key out and collects every other property in a new object. Neither changes `obj`.

`const { [item]: gone, ...rest } = prices` removes the key whose name is held in `item`.

**Common mistake:** using `delete` on the object that was passed in.

**Wrong**

```js
function publicProfile(user) {
  const profile = «user»;
  delete profile.password;
  return profile;
}

const user = { name: "Ada", password: "s3cret" };
publicProfile(user);

console.log(user.password);
```

**Output**

```text
undefined
```

**Fix**

```js
function publicProfile(user) {
  const profile = «{ ...user }»;
  delete profile.password;
  return profile;
}

const user = { name: "Ada", password: "s3cret" };
publicProfile(user);

console.log(user.password);
```

`profile` was the caller's object, so `delete` changed it. On a new copy, `delete` is safe.

<!-- task -->

## Remember

- An immutable update returns a new value. Copy each level on the path to the change, and reuse the rest.
- Arrays: `[...list, item]` adds, `filter` removes, `map` updates one item.
- Objects: `{ ...obj, [key]: value }` adds or replaces, and `const { key, ...rest } = obj` removes.
- `push`, `splice`, `sort` and `delete` mutate. Use them only on a copy you just made.
