# Functions Are Objects

## The name property

**Code**

```js
function sendEmail() {}
const save = function () {};
const load = () => {};
const again = sendEmail;
const tools = { close: () => {} };

console.log(sendEmail.name);
console.log(save.name);
console.log(load.name);
console.log(again.name);
console.log(tools.close.name);
```

**Output**

```text
sendEmail
save
load
sendEmail
close
```

**Rule:** A function is an object, so it has properties. `name` is set once, when the function is created. A function with no name of its own takes the name of the variable or property it is created in.

`again.name` gives `"sendEmail"`. A second variable does not rename the function.

`(() => {}).name` gives `""`. This function is created in no variable, so nothing names it.

<!-- task -->

## length counts parameters

**Code**

```js
function add(a, b) {}
function greet(name, greeting = "Hi") {}
function sum(...numbers) {}
function log(level = "info", message) {}

console.log(add.length);
console.log(greet.length);
console.log(sum.length);
console.log(log.length);
```

**Output**

```text
2
1
0
0
```

**Rule:** `length` is the number of parameters before the first one with a default value. A rest parameter is never counted.

`log.length` gives `0`. `message` comes after a default, so it is not counted.

**Common mistake:** reading `length` to learn how many arguments a call passed.

**Wrong**

```js
function describe(...prices) {
  return `${«describe.length»} prices`;
}

console.log(describe(4, 6, 9));
```

**Output**

```text
0 prices
```

**Fix**

```js
function describe(...prices) {
  return `${«prices.length»} prices`;
}

console.log(describe(4, 6, 9));
```

`describe.length` describes the function, not a call. It is the same number whatever a call passes. The arguments of this call are in `prices`.

<!-- task -->

## Your own properties

**Code**

```js
function track(page) {
  track.count += 1;
  return `viewed ${page}`;
}

track.count = 0;

track("home");
track("cart");

console.log(track.count);
console.log(typeof track);
```

**Output**

```text
2
function
```

**Rule:** You can add your own properties to a function, as on any object. `typeof` still gives `"function"`.

`track.count` is a property, not a variable. Inside the function, write `track.count`, not `count`.

`track.name = "x"` throws a `TypeError` in a module. `name` and `length` are read-only.

**Common mistake:** adding to a property that was never set.

**Wrong**

```js
function track(page) {
  track.count += 1;
  return `viewed ${page}`;
}

track("home");

console.log(track.count);
```

**Output**

```text
NaN
```

**Fix**

```js
function track(page) {
  track.count += 1;
  return `viewed ${page}`;
}

«track.count = 0;»

track("home");

console.log(track.count);
```

A property that was never set is `undefined`, and `undefined + 1` is `NaN`. Give the property its first value before the first call.

<!-- task -->

## Remember

- A function is an object. `typeof` gives `"function"`.
- `name` is the function's own name, or the variable or property it is created in.
- `length` counts the parameters before the first default. Rest is not counted.
- A function can carry your own properties, such as `track.count`.
