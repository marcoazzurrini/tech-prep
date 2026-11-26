# null and undefined

## Missing gives undefined

**Code**

```js
let winner;
const player = { name: "Kai" };
const scores = [7, 9];

console.log(winner);
console.log(player.age);
console.log(scores[2]);
console.log(typeof winner);
```

**Output**

```text
undefined
undefined
undefined
undefined
```

**Rule:** `undefined` is what JavaScript gives when there is no value to give. A variable with no value yet, a property the object does not have and an index past the end of an array all give `undefined`.

`player.age` does not throw. Reading a property that is not there is allowed.

**Common mistake:** reading a property of `undefined`.

**Wrong**

```js
const order = { id: 7 };

console.log(order.customer«.name»);
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'order.customer.name')
```

**Fix**

```js
const order = { id: 7 };

if («order.customer !== undefined») {
  console.log(order.customer.name);
} else {
  console.log("no customer");
}
```

`order.customer` gives `undefined`, and that is fine. Reading `.name` of `undefined` throws. Chrome and Node say `Cannot read properties of undefined (reading 'name')`.

<!-- task -->

## Functions give undefined

**Code**

```js
function label(name, title) {
  return title;
}

function save(note) {
  note.saved = true;
}

function stop() {
  return;
}

console.log(label("Ada"));
console.log(save({ text: "hi" }));
console.log(stop());
```

**Output**

```text
undefined
undefined
undefined
```

**Rule:** A parameter that gets no argument is `undefined`. A call gives `undefined` when the function ends without `return`, or with a bare `return;`.

`label("Ada")` passes one argument for two parameters. That is not an error: `title` is `undefined`.

**Common mistake:** an arrow function with braces and no `return`.

**Wrong**

```js
const prices = [5, 8];
const doubled = prices.map((price) => {
  price * 2;
});

console.log(doubled);
```

**Output**

```text
[ undefined, undefined ]
```

**Fix**

```js
const prices = [5, 8];
const doubled = prices.map((price) => {
  «return »price * 2;
});

console.log(doubled);
```

With braces, an arrow function returns only what `return` gives. Without braces, `(price) => price * 2` returns the value by itself.

<!-- task -->

## null is set on purpose

**Code**

```js
const ada = { name: "Ada", manager: null };

console.log(ada.manager);
console.log(ada.salary);
console.log(ada.manager === null);
console.log(ada.salary === null);
```

**Output**

```text
null
undefined
true
false
```

**Rule:** `null` is a value that code sets on purpose, to say "nothing here". `undefined` is what JavaScript gives by itself, when nothing was ever set.

`ada.manager` is `null`: someone wrote down that Ada has no manager. `ada.salary` is `undefined`: nobody wrote down a salary.

`"abc".match(/x/)` gives `null`. A few built-in methods return `null` on purpose, to say "no result".

<!-- task -->

## Two different values

**Code**

```js
console.log(typeof undefined);
console.log(typeof null);
console.log(null === undefined);
console.log(JSON.stringify({ phone: null, fax: undefined }));
```

**Output**

```text
undefined
object
false
{"phone":null}
```

**Rule:** `null` and `undefined` are two values, each of its own type. With `===`, each one is equal only to itself.

`JSON.stringify` keeps a property that is `null`, and drops a property that is `undefined`.

**Common mistake:** testing for only one of the two.

**Wrong**

```js
const profile = { name: "Ada", phone: null };

if (profile.phone !== undefined) {
  console.log(`Call ${profile.phone}`);
} else {
  console.log("No phone");
}
```

**Output**

```text
Call null
```

**Fix**

```js
const profile = { name: "Ada", phone: null };

if (profile.phone !== undefined« && profile.phone !== null») {
  console.log(`Call ${profile.phone}`);
} else {
  console.log("No phone");
}
```

`null` is not `undefined`, so the test let it through. When a value can be empty in both ways, test for both.

<!-- task -->

## Remember

- `undefined` comes from JavaScript: an unset variable, a missing property, an index out of range.
- A missing argument is `undefined`. So is the result of a function that returns nothing.
- `null` is set by code on purpose. Reading a property of `null` or `undefined` throws.
- `null === undefined` is `false`. `typeof` gives `"object"` for `null` and `"undefined"` for `undefined`.
