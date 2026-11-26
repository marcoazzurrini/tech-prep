# call and apply

## call sets this

**Code**

```js
function greet(greeting, mark) {
  return `${greeting}, ${this.name}${mark}`;
}

const ada = { name: "Ada" };
const kim = { name: "Kim" };

console.log(greet.call(ada, "Hello", "!"));
console.log(greet.call(kim, "Bye", "."));
```

**Output**

```text
Hello, Ada!
Bye, Kim.
```

**Rule:** Every function has a method named `call`. `greet.call(ada, "Hello", "!")` runs `greet` with `this` set to `ada`, and passes the other arguments on.

`greet.call(ada, "Hello", "!")` gives what `ada.greet("Hello", "!")` would give. But `ada` needs no `greet` property.

**Common mistake:** forgetting that the first argument is `this`.

**Wrong**

```js
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}

const ada = { name: "Ada" };

console.log(greet.call(«"Hello"»));
```

**Output**

```text
undefined, undefined
```

**Fix**

```js
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}

const ada = { name: "Ada" };

console.log(greet.call(«ada, "Hello"»));
```

**Output**

```text
Hello, Ada
```

The first argument of `call` is always `this`. So `this` was the string `"Hello"`, and `greeting` got nothing.

<!-- task -->

## apply takes an array

**Code**

```js
function total(tax, tip) {
  return this.price + tax + tip;
}

const meal = { price: 20 };
const extras = [2, 3];

console.log(total.apply(meal, extras));
console.log(total.call(meal, ...extras));
console.log(Math.max.apply(null, [4, 9, 6]));
```

**Output**

```text
25
25
9
```

**Rule:** `fn.apply(obj, list)` works like `call`, with the arguments in one array. Each item of the array becomes one argument.

`total.call(meal, ...extras)` does the same with spread.

`Math.max` never reads `this`, so `null` stands in for it.

**Common mistake:** passing an array to `call`.

**Wrong**

```js
const scores = [4, 9, 6];

console.log(Math.max.«call»(null, scores));
```

**Output**

```text
NaN
```

**Fix**

```js
const scores = [4, 9, 6];

console.log(Math.max.«apply»(null, scores));
```

**Output**

```text
9
```

`call` passed the whole array as one argument, and `Math.max` cannot turn that array into a number. `apply` passes three arguments.

<!-- task -->

## Borrowing a method

**Code**

```js
const ada = {
  first: "Ada",
  last: "Lovelace",
  fullName() {
    return `${this.first} ${this.last}`;
  },
};

const kim = { first: "Kim", last: "Lee" };

console.log(ada.fullName.call(kim));
console.log(Object.keys(kim).join(","));
```

**Output**

```text
Kim Lee
first,last
```

**Rule:** `call` and `apply` work on a method too. `ada.fullName.call(kim)` runs Ada's method with `this` set to `kim`. This is **borrowing** a method: `kim` gets no new property.

In `ada.fullName.call(kim)`, `ada` only serves to find the function. It is not `this`.

`const fullName = ada.fullName` loses `this`. `fullName.call(ada)` gives it back.

<!-- task -->

## Any value as this

**Code**

```js
function kind() {
  return this === null ? "null" : typeof this;
}

console.log(kind.call({ id: 1 }));
console.log(kind.call(7));
console.log(kind.call("seven"));
console.log(kind.call(null));
console.log(kind.call());
```

**Output**

```text
object
number
string
null
undefined
```

**Rule:** In strict mode, `this` is exactly the value you pass, even a primitive or `null`. Pass nothing, and `this` is `undefined`.

Old non-strict code differs. There a primitive is wrapped in an object, and `null` or `undefined` becomes the global object.

`fn.apply(obj)` with no array calls `fn` with no arguments.

<!-- task -->

## Remember

- `fn.call(obj, a, b)` calls `fn` with `this` set to `obj`.
- `fn.apply(obj, [a, b])` does the same, with the arguments in an array.
- The first argument is always `this`. Pass `null` when the function does not read `this`.
- In strict mode, `this` is exactly the value you pass.
