# Curry and Partial Application

## One argument at a time

**Code**

```js
function shippingLabel(country) {
  return (city) => (name) => `${name}, ${city}, ${country}`;
}

const toItaly = shippingLabel("Italy");
const toRome = toItaly("Rome");

console.log(toRome("Ada"));
console.log(toRome("Bo"));
console.log(shippingLabel("Spain")("Madrid")("Cy"));
```

**Output**

```text
Ada, Rome, Italy
Bo, Rome, Italy
Cy, Madrid, Spain
```

**Rule:** A **curried** function takes its arguments one at a time. Each call fixes one argument and returns a function that waits for the next. The last call runs the body and returns the result.

`toRome` is a function you can use again and again. The fixed arguments, `"Italy"` and `"Rome"`, live on in its closure.

**Common mistake:** passing every argument to the first call.

**Wrong**

```js
function shippingLabel(country) {
  return (city) => (name) => `${name}, ${city}, ${country}`;
}

const label = shippingLabel(«"Spain", "Madrid", "Cy"»);

console.log(typeof label);
```

**Output**

```text
function
```

**Fix**

```js
function shippingLabel(country) {
  return (city) => (name) => `${name}, ${city}, ${country}`;
}

const label = shippingLabel«("Spain")("Madrid")("Cy")»;

console.log(typeof label);
```

**Output**

```text
string
```

Each function here reads one parameter, so the extra arguments were dropped. The call fixed `"Spain"` and returned the function for the city.

<!-- task -->

## curry reads fn.length

**Code**

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }

    return (...more) => curried(...args, ...more);
  };
}

const volume = curry((length, width, height) => length * width * height);

console.log(volume(2)(3)(4));
console.log(volume(2, 3)(4));
console.log(volume(2)(3, 4));
console.log(volume(2, 3, 4));
```

**Output**

```text
24
24
24
24
```

**Rule:** `curry(fn)` turns any function into a curried one. It collects arguments across calls, and a call may pass several at once. When it has `fn.length` arguments, it calls `fn` with them. Until then, it returns a function that waits for more.

`fn.length` counts the parameters before the first default value, and never a rest parameter. So `curry((a, b = 1) => a + b)` runs after one argument, and `curry((...xs) => xs)` runs at once.

**Common mistake:** one list of arguments shared by every call.

**Wrong**

```js
function curry(fn) {
  «const args = [];»

  return function curried(...more) {
    «args.push(...more);»

    if (args.length >= fn.length) {
      return fn(...args);
    }

    return curried;
  };
}

const volume = curry((length, width, height) => length * width * height);
const base = volume(2, 3);

console.log(base(4));
console.log(base(5));
```

**Output**

```text
24
24
```

**Fix**

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }

    return (...more) => «curried(...args, ...more)»;
  };
}

const volume = curry((length, width, height) => length * width * height);
const base = volume(2, 3);

console.log(base(4));
console.log(base(5));
```

**Output**

```text
24
30
```

The one `args` array kept growing, so `base(5)` called `fn(2, 3, 4, 5)`. `[...args, ...more]` builds a new list at every call, so each use of `base` starts from `2, 3`.

<!-- task -->

## Partial application

**Code**

```js
function partial(fn, ...fixed) {
  return (...rest) => fn(...fixed, ...rest);
}

const volume = (length, width, height) => length * width * height;

const twoWide = partial(volume, 2);
const twoByThree = volume.bind(null, 2, 3);

console.log(twoWide(3, 4));
console.log(twoWide(3));
console.log(twoByThree(5));
```

**Output**

```text
24
NaN
30
```

**Rule:** **Partial application** fixes some arguments now and returns a function for the rest. That function runs `fn` at its first call, with whatever arguments it gets. A curried function is different: it waits until it has all of them.

`twoWide(3)` called `volume(2, 3)`, so `height` was `undefined`, and the product was `NaN`. A curried `volume` would have returned a function instead.

`fn.bind(null, 2, 3)` is partial application built into the language.

<!-- task -->

## A sum with no end

**Code**

```js
function sum(a) {
  return (b) => (b === undefined ? a : sum(a + b));
}

const ten = sum(10);

console.log(sum(1)(2)(3)());
console.log(sum(5)());
console.log(ten(1)());
console.log(ten(2)(3)());
```

**Output**

```text
6
5
11
15
```

**Rule:** When the number of arguments is open, `fn.length` cannot say when to stop. Then a call with no argument ends the chain. Each call before it returns a new function that holds the total so far.

`ten(1)` and `ten(2)` both start from `10`. Each call makes a new function, so no chain changes another.

To end without the empty call, give each function a `valueOf` that returns its total. Then `sum(1)(2) + 0` gives `3`.

**Common mistake:** ending the chain on any falsy argument.

**Wrong**

```js
function sum(a) {
  return (b) => («!b» ? a : sum(a + b));
}

console.log(sum(4)(0)(6)());
```

**Error**

```text
TypeError: sum(4)(0) is not a function. (In 'sum(4)(0)(6)', 'sum(4)(0)' is 4)
```

**Fix**

```js
function sum(a) {
  return (b) => («b === undefined» ? a : sum(a + b));
}

console.log(sum(4)(0)(6)());
```

`!b` is true for `0` too, so `sum(4)(0)` ended the chain and returned the number `4`. Calling `4(6)` threw. Test for a missing argument, not for a falsy one.

<!-- task -->

## Remember

- A curried function takes its arguments one at a time, and runs when it has them all.
- `curry(fn)` collects arguments until it has `fn.length` of them. Build a new list at each call.
- Partial application fixes some arguments, and runs at the next call. `bind` does it too.
- With no fixed count, an empty call `()` ends the chain.
