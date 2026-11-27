# Lazy Sequences

## Endless sequences

**Code**

```js
function* fibonacci() {
  let [a, b] = [0, 1];

  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const firstSeven = [];

for (const n of fibonacci()) {
  firstSeven.push(n);
  if (firstSeven.length === 7) break;
}

console.log(firstSeven.join(","));

const [zero, one, two] = fibonacci();
console.log(zero, one, two);
```

**Output**

```text
0,1,1,2,3,5,8
0 1 1
```

**Rule:** A generator makes each value only when `next()` asks for it. So a `while (true)` loop inside it is safe: the generator can describe an endless sequence. The code that reads it decides when to stop.

`const [zero, one, two] = fibonacci()` reads three values and stops. Destructuring takes only what it needs.

`[...fibonacci()]` never ends. Spread, `Array.from` and a `for...of` with no `break` read until `done` is `true`, and here it never is.

<!-- task -->

## A lazy chain by hand

**Code**

```js
function* map(source, fn) {
  for (const item of source) yield fn(item);
}

function* filter(source, test) {
  for (const item of source) {
    if (test(item)) yield item;
  }
}

function* naturals() {
  let n = 1;

  while (true) {
    console.log("make " + n);
    yield n++;
  }
}

const odd = filter(naturals(), (n) => n % 2 === 1);
const squares = map(odd, (n) => n * n);
console.log("built");
console.log(squares.next().value);
console.log(squares.next().value);
```

**Output**

```text
built
make 1
1
make 2
make 3
9
```

**Rule:** Each lazy step is a generator that reads from the step before it. Building the chain runs nothing. Each `next()` at the end pulls one value through the whole chain, and makes only as many source values as that needs.

Array `map` and `filter` work the other way round. Each one runs over the whole array before the next step starts. On an endless source, the first step would never finish.

<!-- task -->

## Iterator helpers

**Code**

```js
function* naturals() {
  let n = 1;
  while (true) yield n++;
}

const picked = naturals()
  .filter((n) => n % 2 === 0)
  .map((n) => n * 10)
  .drop(1)
  .take(3);

console.log(picked.toArray().join(","));
console.log(picked.next().done);
```

**Output**

```text
40,60,80
true
```

**Rule:** Every built-in iterator, generators included, has lazy **iterator helpers**: `map`, `filter`, `drop`, `take` and more. Each one returns a new iterator, so they chain. Nothing runs until something reads the end of the chain. `toArray()` reads it all into an array.

`take(n)` stops after `n` values, so it is safe on an endless sequence. Asked for more after that, it calls `return()` on its source. `drop(n)` skips the first `n` values.

`forEach`, `reduce`, `some`, `every` and `find` are helpers too. They are not lazy: they read values straight away and give a plain result.

**Common mistake:** using `map` for its side effects.

**Wrong**

```js
const saved = [];
const ids = new Set([4, 8]);

ids.values().«map»((id) => saved.push(id));
console.log(saved.length);
```

**Output**

```text
0
```

**Fix**

```js
const saved = [];
const ids = new Set([4, 8]);

ids.values().«forEach»((id) => saved.push(id));
console.log(saved.length);
```

**Output**

```text
2
```

`map` on an iterator is lazy. It returned a new iterator that nobody read, so the callback never ran. `forEach` reads every value at once.

<!-- task -->

## Iterator.from

**Code**

```js
function* letters() {
  yield* "abc";
}

const gen = letters();
console.log(Iterator.from(gen) === gen);

const sizes = Iterator.from(["tea", "milk"]).map((word) => word.length);
console.log(sizes.toArray().join(","));

const sevens = { next: () => ({ value: 7, done: false }) };
console.log(Iterator.from(sevens).take(2).toArray().join(","));
```

**Output**

```text
true
3,4
7,7
```

**Rule:** The helpers live on `Iterator.prototype`, so only real iterators have them. `Iterator.from(x)` takes any iterable or hand-made iterator and returns an iterator that has them. A generator already is one, so it comes back unchanged.

An array is iterable, but it is not an iterator. `Iterator.from(list)` or `list.values()` gives an iterator over it.

**Common mistake:** calling a helper on a hand-made iterator.

**Wrong**

```js
let ticket = 100;
const tickets = {
  next() {
    ticket++;
    return { value: ticket, done: false };
  },
};

console.log(«tickets».take(2).toArray().join(","));
```

**Error**

```text
TypeError: tickets.take is not a function. (In 'tickets.take(2)', 'tickets.take' is undefined)
```

**Fix**

```js
let ticket = 100;
const tickets = {
  next() {
    ticket++;
    return { value: ticket, done: false };
  },
};

console.log(«Iterator.from(tickets)».take(2).toArray().join(","));
```

A plain object with `next()` follows the protocol, but it does not inherit from `Iterator.prototype`. `Iterator.from` wraps it in an iterator that does. Chrome and Node say `tickets.take is not a function`.

<!-- task -->

## Remember

- A generator makes values only when asked, so it can describe an endless sequence. The reader decides when to stop.
- A chain of lazy steps pulls one value at a time through every step.
- `map`, `filter`, `drop` and `take` on an iterator are lazy. `toArray`, `forEach` and `reduce` read straight away.
- `Iterator.from(x)` gives the helpers to any iterable or hand-made iterator.
