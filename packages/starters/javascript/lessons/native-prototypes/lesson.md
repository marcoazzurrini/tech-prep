# Built-in Prototypes

## Where methods live

**Code**

```js
const scores = [7, 9];

console.log(Object.keys(scores).join(","));
console.log(Object.hasOwn(scores, "push"));
console.log(Object.hasOwn(Array.prototype, "push"));
console.log(scores.push === Array.prototype.push);
console.log(Object.getPrototypeOf(scores) === Array.prototype);
```

**Output**

```text
0,1
false
true
true
true
```

**Rule:** An array holds its items and its `length`, and nothing else. Its methods live on one shared object, `Array.prototype`, which is the prototype of every array.

`Function.prototype` holds `call`, `apply` and `bind`. It is the prototype of every function.

`String.prototype` holds `trim` and `slice`. `Object.prototype` holds `toString` and `hasOwnProperty`.

**Common mistake:** looking on an object for a method that lives on the constructor.

**Wrong**

```js
const cart = { tea: 3, jam: 5 };

console.log(«cart.keys()».join(","));
```

**Error**

```text
TypeError: cart.keys is not a function. (In 'cart.keys()', 'cart.keys' is undefined)
```

**Fix**

```js
const cart = { tea: 3, jam: 5 };

console.log(«Object.keys(cart)».join(","));
```

`keys` is a property of the function `Object` itself. It is not on `Object.prototype`, so no object inherits it. `Array.isArray` and `Array.from` work the same way.

<!-- task -->

## Every chain ends

**Code**

```js
const scores = [7, 9];
const first = Object.getPrototypeOf(scores);
const second = Object.getPrototypeOf(first);
const third = Object.getPrototypeOf(second);

console.log(first === Array.prototype);
console.log(second === Object.prototype);
console.log(third);
console.log(scores.hasOwnProperty === Object.prototype.hasOwnProperty);
```

**Output**

```text
true
true
null
true
```

**Rule:** The chain of an array is `Array.prototype`, then `Object.prototype`, then `null`. Every built-in prototype links to `Object.prototype`, so arrays, functions and dates can use its methods too.

`scores.toString()` gives `"7,9"`. `Array.prototype` has a `toString` of its own, and the nearest one on the chain wins.

`Object.getPrototypeOf(Function.prototype) === Object.prototype` gives `true`. A function is two steps from the end, like an array.

<!-- task -->

## Methods on primitives

**Code**

```js
const word = "tea";
const price = 4.5;

console.log(word.toUpperCase());
console.log(word.toUpperCase === String.prototype.toUpperCase);
console.log(price.toFixed(2));
console.log(price.toFixed === Number.prototype.toFixed);
console.log(typeof word, typeof price);
```

**Output**

```text
TEA
true
4.50
true
string number
```

**Rule:** A primitive holds no properties. When you read one, JavaScript wraps the value in a temporary **wrapper object**: a `String`, `Number` or `Boolean` object. The method is found on its prototype, and the wrapper object is thrown away.

`null.toString()` throws a `TypeError`. `null` and `undefined` have no wrapper object.

`word.size = 3` throws a `TypeError` in strict mode. The property would vanish with the wrapper object.

**Common mistake:** making a wrapper object yourself with `new`.

**Wrong**

```js
function label(flag) {
  const on = «new Boolean(flag)»;

  return on ? "on" : "off";
}

console.log(label(false));
```

**Output**

```text
on
```

**Fix**

```js
function label(flag) {
  const on = «Boolean(flag)»;

  return on ? "on" : "off";
}

console.log(label(false));
```

**Output**

```text
off
```

`new Boolean(false)` makes a real object, and every object is truthy. Without `new`, `Boolean(flag)` converts the value and returns a primitive.

<!-- task -->

## One object for everyone

**Code**

```js
const early = ["Ada", "Kim"];

Array.prototype.last = function () {
  return this[this.length - 1];
};

console.log(early.last());
console.log([7, 9].last());

for (const key in early) {
  console.log(key);
}
```

**Output**

```text
Kim
9
0
1
last
```

**Rule:** Every array in the program shares one `Array.prototype`. A method added there reaches all of them at once, in your code and in every library. So do not add your own.

`for (const key in early)` now gives `"last"` too, because `for...in` also sees inherited keys.

`if (!Array.prototype.at) { ... }` guards a **polyfill**: code that adds a standard method when an old engine lacks it. A polyfill is the one good reason to change a built-in prototype.

**Common mistake:** putting a helper of your own on a built-in prototype.

**Wrong**

```js
«String.prototype.first» = function () {
  return this[0];
};

«String.prototype.first» = function () {
  return this.split(" ")[0];
};

console.log("tea time".first());
```

**Output**

```text
tea
```

**Fix**

```js
«function firstLetter(text)» {
  return text[0];
}

«function firstWord(text)» {
  return text.split(" ")[0];
}

console.log(firstLetter("tea time"));
```

**Output**

```text
t
```

Two pieces of code chose the same name, and the second replaced the first without an error. A plain function stays in its own file, so it cannot clash.

<!-- task -->

## Remember

- Methods live on `Array.prototype`, `String.prototype`, `Function.prototype` and so on, not on each value.
- Every chain ends with `Object.prototype`, then `null`.
- A primitive gets a temporary wrapper object for each property read. Never make one with `new`.
- Do not change a built-in prototype, except for a polyfill.
