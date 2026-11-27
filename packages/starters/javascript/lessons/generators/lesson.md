# Generators

## Paused until asked

**Code**

```js
function* checkout() {
  console.log("scan");
  yield "scanned";
  console.log("pay");
  yield "paid";
  console.log("bye");
}

const steps = checkout();
console.log("created");
console.log(steps.next().value);
console.log(steps.next().value);
console.log(steps.next().done);
```

**Output**

```text
created
scan
scanned
pay
paid
bye
true
```

**Rule:** `function*` declares a **generator function**. Calling it runs none of its body. It returns a **generator**, and each `next()` call runs the body up to the next `yield`, then pauses there. `yield x` hands out `x` as the `value`.

When the body ends, `next()` gives `done: true`.

`yield` works only directly inside a `function*`. In a normal function nested inside it, such as a `forEach` callback, it is a `SyntaxError`.

**Common mistake:** expecting the call to run the body.

**Wrong**

```js
function* greet(name) {
  console.log(`Hello, ${name}`);
  yield name;
}

«greet("Ada")»;
console.log("end");
```

**Output**

```text
end
```

**Fix**

```js
function* greet(name) {
  console.log(`Hello, ${name}`);
  yield name;
}

«greet("Ada").next()»;
console.log("end");
```

**Output**

```text
Hello, Ada
end
```

The call only made a generator. Nothing in the body runs until something calls `next()`.

<!-- task -->

## A generator is an iterator

**Code**

```js
function* podium() {
  yield "gold";
  yield "silver";
  return "bronze";
}

const medals = podium();
console.log(medals[Symbol.iterator]() === medals);
console.log([...medals].join(","));
console.log([...medals].length);
console.log([...podium()].length);
```

**Output**

```text
true
gold,silver
0
2
```

**Rule:** A generator is an iterator, and its `[Symbol.iterator]()` returns the generator itself. So `for...of` and spread accept it. Like any iterator, it works for one pass. Call the generator function again to get a fresh one.

The value of `return` comes with `done: true`. `for...of` and spread stop at `done: true`, so they never see it.

**Common mistake:** returning the last item.

**Wrong**

```js
function* grades() {
  yield "A";
  yield "B";
  «return "C";»
}

console.log([...grades()].join(""));
```

**Output**

```text
AB
```

**Fix**

```js
function* grades() {
  yield "A";
  yield "B";
  «yield "C";»
}

console.log([...grades()].join(""));
```

**Output**

```text
ABC
```

`return "C"` ended the generator with `done: true`, and spread drops the value that comes with it. Use `yield` for every value the loop should see.

<!-- task -->

## yield* hands over

**Code**

```js
function* weekdays() {
  yield "Mon";
  yield "Tue";
}

function* week() {
  yield* weekdays();
  yield* ["Sat", "Sun"];
  yield "end";
}

console.log([...week()].join(" "));
```

**Output**

```text
Mon Tue Sat Sun end
```

**Rule:** `yield* iterable` hands over to another iterable. It yields each of its values in turn, then the generator carries on. The iterable can be another generator, an array, a string or anything else iterable.

`yield* "ab"` yields `"a"`, then `"b"`. A string is iterable.

`yield* walk(child)` inside `function* walk` hands over to a new call of the same generator function. That is how a generator walks nested data, such as a tree.

**Common mistake:** writing `yield` where `yield*` is meant.

**Wrong**

```js
function* weekend() {
  «yield» ["Sat", "Sun"];
  yield "end";
}

console.log([...weekend()].length);
```

**Output**

```text
2
```

**Fix**

```js
function* weekend() {
  «yield*» ["Sat", "Sun"];
  yield "end";
}

console.log([...weekend()].length);
```

**Output**

```text
3
```

`yield` hands out the whole array as one value. `yield*` hands out its items, one by one.

<!-- task -->

## Generator methods

**Code**

```js
class Basket {
  constructor() {
    this.counts = new Map();
  }

  add(fruit, count) {
    this.counts.set(fruit, count);
    return this;
  }

  *[Symbol.iterator]() {
    for (const [fruit, count] of this.counts) {
      for (let i = 0; i < count; i++) yield fruit;
    }
  }
}

const basket = new Basket().add("fig", 2).add("kiwi", 1);
console.log([...basket].join(","));
console.log([...basket].length);
```

**Output**

```text
fig,fig,kiwi
3
```

**Rule:** `*[Symbol.iterator]() { ... }` is a generator method. Each loop calls it and gets a new generator, so the object can be looped over again and again. The generator writes `next()` and `{ value, done }` for you.

An object literal takes the same form: `{ *[Symbol.iterator]() { ... } }`.

Inside a generator method, `this` is the object, as in any method.

**Common mistake:** returning the data instead of yielding it.

**Wrong**

```js
class Shelf {
  constructor(books) {
    this.books = books;
  }

  *[Symbol.iterator]() {
    «return this.books;»
  }
}

console.log([...new Shelf(["Emma", "Dune"])].length);
```

**Output**

```text
0
```

**Fix**

```js
class Shelf {
  constructor(books) {
    this.books = books;
  }

  *[Symbol.iterator]() {
    «yield* this.books;»
  }
}

console.log([...new Shelf(["Emma", "Dune"])].length);
```

**Output**

```text
2
```

In a generator, `return` ends it at once with `done: true`, so spread saw no values. `yield*` hands out the books one by one.

<!-- task -->

## Remember

- Calling a `function*` runs nothing. Each `next()` runs the body to the next `yield` and pauses there.
- A generator is an iterator and is iterable, for one pass. `for...of` and spread skip the `return` value.
- `yield* iterable` yields each value of another iterable, then carries on.
- `*[Symbol.iterator]() { ... }` makes an object iterable, with a new generator for every loop.
