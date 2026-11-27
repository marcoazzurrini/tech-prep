# Memoize

## A cache by argument

**Code**

```js
function memoize(fn) {
  const cache = new Map();

  return (arg) => {
    if (!cache.has(arg)) {
      cache.set(arg, fn(arg));
    }

    return cache.get(arg);
  };
}

let runs = 0;

const countVowels = memoize((word) => {
  runs += 1;
  return word.match(/[aeiou]/g)?.length ?? 0;
});

console.log(countVowels("banana"));
console.log(countVowels("banana"));
console.log(countVowels("kiwi"));
console.log(runs);
```

**Output**

```text
3
3
2
2
```

**Rule:** A **memoized** function keeps each result in a **cache**: here, a `Map` from argument to result. The first call with an argument runs `fn` and stores the result. A later call with the same argument returns the stored result, and `fn` does not run.

Memoizing trades memory for time. It pays off when `fn` is slow and the same arguments come back.

**Common mistake:** testing the stored value instead of the key.

**Wrong**

```js
function memoize(fn) {
  const cache = new Map();

  return (arg) => {
    if («!cache.get(arg)») {
      cache.set(arg, fn(arg));
    }

    return cache.get(arg);
  };
}

let runs = 0;

const countVowels = memoize((word) => {
  runs += 1;
  return word.match(/[aeiou]/g)?.length ?? 0;
});

countVowels("rhythm");
countVowels("rhythm");

console.log(runs);
```

**Output**

```text
2
```

**Fix**

```js
function memoize(fn) {
  const cache = new Map();

  return (arg) => {
    if («!cache.has(arg)») {
      cache.set(arg, fn(arg));
    }

    return cache.get(arg);
  };
}

let runs = 0;

const countVowels = memoize((word) => {
  runs += 1;
  return word.match(/[aeiou]/g)?.length ?? 0;
});

countVowels("rhythm");
countVowels("rhythm");

console.log(runs);
```

**Output**

```text
1
```

"rhythm" has no vowels, so the stored result is `0`. `0` is falsy, so the cache looked empty and `fn` ran again. `has` asks whether the key is there, whatever its value.

<!-- task -->

## Several arguments

**Code**

```js
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (!cache.has(key)) {
      cache.set(key, fn.apply(this, args));
    }

    return cache.get(key);
  };
}

let runs = 0;

const shipping = memoize((kg, zone) => {
  runs += 1;
  return kg * (zone === "EU" ? 4 : 9);
});

console.log(shipping(2, "EU"));
console.log(shipping(2, "US"));
console.log(shipping(2, "EU"));
console.log(runs);
```

**Output**

```text
8
18
8
2
```

```steps
String([1, 2]) => "1,2"
String(«["1,2"]») => "1,2"
JSON.stringify([1, 2]) => "[1,2]"
JSON.stringify(«["1,2"]») => "[\"1,2\"]"
```

**Rule:** A `Map` key is one value, so several arguments need one key made from all of them. `JSON.stringify(args)` gives a string that changes with every argument and with their order. `String(args)` does not: a comma inside a string makes two calls look the same.

`fn.apply(this, args)` passes `this` on, so a memoized method still works. But `this` is not in the key, so two objects share one cache.

`JSON.stringify` gives two different objects with the same content the same key. To key objects by identity, use nested maps: one `Map` per argument, each leading to the next.

**Common mistake:** keying the cache by the first argument only.

**Wrong**

```js
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    if (!cache.has(«args[0]»)) {
      cache.set(«args[0]», fn.apply(this, args));
    }

    return cache.get(«args[0]»);
  };
}

const shipping = memoize((kg, zone) => kg * (zone === "EU" ? 4 : 9));

console.log(shipping(2, "EU"));
console.log(shipping(2, "US"));
```

**Output**

```text
8
8
```

**Fix**

```js
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    «const key = JSON.stringify(args);»

    if (!cache.has(«key»)) {
      cache.set(«key», fn.apply(this, args));
    }

    return cache.get(«key»);
  };
}

const shipping = memoize((kg, zone) => kg * (zone === "EU" ? 4 : 9));

console.log(shipping(2, "EU"));
console.log(shipping(2, "US"));
```

**Output**

```text
8
18
```

Both calls had the key `2`, so the US call got the EU price. The key must hold every argument.

<!-- task -->

## Recursive calls

**Code**

```js
function memoize(fn) {
  const cache = new Map();

  return (n) => {
    if (!cache.has(n)) {
      cache.set(n, fn(n));
    }

    return cache.get(n);
  };
}

let calls = 0;

const fib = memoize((n) => {
  calls += 1;
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
});

console.log(fib(30));
console.log(calls);
```

**Output**

```text
832040
31
```

**Rule:** In a recursive function, the inner calls must go through the memoized version too. Write the function inside `memoize(...)`, and call it by the memoized name. Then each `n` is computed once.

`fib(30)` runs the body 31 times, once for each `n` from 0 to 30. Without the cache it runs more than two million times.

**Common mistake:** memoizing a recursive function from outside.

**Wrong**

```js
function memoize(fn) {
  const cache = new Map();

  return (n) => {
    if (!cache.has(n)) {
      cache.set(n, fn(n));
    }

    return cache.get(n);
  };
}

let calls = 0;

function fib(n) {
  calls += 1;
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

«const fastFib = memoize(fib);»

console.log(fastFib(20));
console.log(calls);
```

**Output**

```text
6765
21891
```

**Fix**

```js
function memoize(fn) {
  const cache = new Map();

  return (n) => {
    if (!cache.has(n)) {
      cache.set(n, fn(n));
    }

    return cache.get(n);
  };
}

let calls = 0;

«const fib = memoize((n) => {»
  calls += 1;
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
«});»

console.log(fib(20));
console.log(calls);
```

**Output**

```text
6765
21
```

`fastFib` used the cache once, for the outer call. Inside, `fib` called itself, not `fastFib`, so no inner call used the cache.

<!-- task -->

## When not to memoize

**Code**

```js
function memoize(fn) {
  const cache = new Map();

  return (arg) => {
    if (!cache.has(arg)) {
      cache.set(arg, fn(arg));
    }

    return cache.get(arg);
  };
}

let taxRate = 0.2;

const withTax = memoize((price) => price + price * taxRate);

console.log(withTax(50));

taxRate = 0.5;

console.log(withTax(50));
console.log(withTax(10));
```

**Output**

```text
60
60
15
```

**Rule:** Memoize only a **pure** function: one whose result depends on its arguments alone, and that changes nothing outside. This result also depends on `taxRate`, so the cache gives an old answer for `50`.

A side effect is skipped too. A memoized `sendEmail(address)` sends one email per address, ever.

The cache never forgets. Every new key stays as long as the function lives, so endless new keys make a memory leak. Give the cache a size limit, or key objects with a `WeakMap`.

<!-- task -->

## Remember

- A memoized function stores each result in a `Map`, keyed by the argument. Test with `has`, not with the stored value.
- For several arguments, make one key from all of them, such as `JSON.stringify(args)`.
- A recursive function must call the memoized version, or the inner calls skip the cache.
- Memoize only pure functions. The cache grows with every new key.
