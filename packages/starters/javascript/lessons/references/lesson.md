# Values and References

## Copied or shared

**Code**

```js
let price = 10;
let sale = price;
sale = 8;

const cart = { items: 2 };
const basket = cart;
basket.items = 5;

console.log(price, sale);
console.log(cart.items, basket.items);
```

**Output**

```text
10 8
5 5
```

**Rule:** Assigning a primitive copies the value. Assigning an object copies a reference, which is a pointer to the object. Both names then lead to one object, so a change made through one name shows through the other.

`sale = price` made a second `10`. `basket = cart` did not make a second cart.

**Common mistake:** making a backup with `=`.

**Wrong**

```js
const settings = { theme: "dark" };
const backup = «settings»;

settings.theme = "light";

console.log(backup.theme);
```

**Output**

```text
light
```

**Fix**

```js
const settings = { theme: "dark" };
const backup = «structuredClone(settings)»;

settings.theme = "light";

console.log(backup.theme);
```

`backup` was a second name for the same object, not a copy. `structuredClone` builds a new object with the same content.

<!-- task -->

## === compares identity

**Code**

```js
const first = { x: 1 };
const second = { x: 1 };
const again = first;

console.log(first === second);
console.log(first === again);
console.log([1, 2] === [1, 2]);
```

**Output**

```text
false
true
false
```

```steps
{} === {} => false
[] === [] => false
"ab" === "ab" => true
```

**Rule:** For two objects, `===` asks one thing: are they the same object? It never looks at the content. Each `{ }` and each `[ ]` makes a new object, so two of them are never equal.

`first === again` gives `true`. Both names hold a reference to one object.

**Common mistake:** looking for an object with `includes`.

**Wrong**

```js
const done = [{ id: 1 }, { id: 2 }];

console.log(done.«includes({ id: 2 })»);
```

**Output**

```text
false
```

**Fix**

```js
const done = [{ id: 1 }, { id: 2 }];

console.log(done.«some((task) => task.id === 2)»);
```

`{ id: 2 }` made a new object, and `includes` looks for that very object. Compare a primitive inside the objects, such as the `id`.

<!-- task -->

## Arrays and functions too

**Code**

```js
const scores = [3, 1, 2];
const sorted = scores;
sorted.sort();

function greet() {
  return "hi";
}

const hello = greet;
hello.uses = 1;

console.log(scores.join(","));
console.log(greet.uses);
console.log(hello === greet);
```

**Output**

```text
1,2,3
1
true
```

**Rule:** Arrays and functions are objects, so assigning one shares it. `sorted` and `scores` are one array. `hello` and `greet` are one function.

`const team = [ada]` puts a reference to the object `ada` in the array, not a copy. A change to `ada.role` shows in `team[0].role`.

<!-- task -->

## Reassigning a name

**Code**

```js
let draft = { title: "Notes" };
const saved = draft;

draft = { title: "Ideas" };

console.log(saved.title);
console.log(draft.title);
```

**Output**

```text
Notes
Ideas
```

**Rule:** `draft = ...` points the name `draft` at another value. It does not change the object, and it does not change any other name. Only a change inside the object, such as `draft.title = "Ideas"`, shows through every name.

`draft = null` empties the name `draft` only. `saved` still holds the object.

**Common mistake:** emptying a shared array with `= []`.

**Wrong**

```js
let queue = ["a", "b", "c"];
const waiting = queue;

queue« = []»;

console.log(waiting.length);
```

**Output**

```text
3
```

**Fix**

```js
let queue = ["a", "b", "c"];
const waiting = queue;

queue«.length = 0»;

console.log(waiting.length);
```

`queue = []` gave the name `queue` a new, empty array. `waiting` still held the old one. `queue.length = 0` empties the array itself, so both names see it.

<!-- task -->

## Remember

- A primitive is copied when it is assigned. An object is shared: the variable holds a reference.
- A change inside an object shows through every name that holds it.
- `===` on objects is `true` only for the same object. `{} === {}` is `false`.
- Reassigning a name changes that name only.
