# Making an Object Iterable

## Add Symbol.iterator

**Code**

```js
const launch = {
  from: 3,
  [Symbol.iterator]() {
    let count = this.from;

    return {
      next() {
        if (count === 0) return { value: undefined, done: true };
        return { value: count--, done: false };
      },
    };
  },
};

for (const n of launch) console.log(n);
console.log([...launch].join(","));
console.log(Math.max(...launch));
```

**Output**

```text
3
2
1
3,2,1
3
```

**Rule:** To make your own object iterable, give it a `[Symbol.iterator]()` method that returns an iterator. Then `for...of`, spread and every other consumer accept it.

Inside the method, `this` is the object, so `this.from` reads its data. Write it as a method, not an arrow function. An arrow function does not get the object as `this`.

**Common mistake:** returning the bare value from `next()`.

**Wrong**

```js
const launch = {
  from: 3,
  [Symbol.iterator]() {
    let count = this.from;

    return {
      next() {
        «return count > 0 ? count-- : undefined;»
      },
    };
  },
};

console.log([...launch].join(","));
```

**Error**

```text
TypeError: Iterator result interface is not an object
```

**Fix**

```js
const launch = {
  from: 3,
  [Symbol.iterator]() {
    let count = this.from;

    return {
      next() {
        «if (count === 0) return { value: undefined, done: true };»
        «return { value: count--, done: false };»
      },
    };
  },
};

console.log([...launch].join(","));
```

Spread expects every `next()` call to return an object with `value` and `done`. A bare number breaks the protocol, so it throws. Chrome and Node say `Iterator result 3 is not an object`.

<!-- task -->

## A new iterator each time

**Code**

```js
const teams = {
  names: ["red", "blue"],
  [Symbol.iterator]() {
    const names = this.names;
    let index = 0;

    return {
      next() {
        if (index === names.length) return { value: undefined, done: true };
        return { value: names[index++], done: false };
      },
    };
  },
};

const games = [];

for (const home of teams) {
  for (const away of teams) {
    if (home !== away) games.push(`${home}-${away}`);
  }
}

console.log(games.join(" "));
```

**Output**

```text
red-blue blue-red
```

**Rule:** Each call to `[Symbol.iterator]()` should return a new iterator with its own position. Then two loops over the object, even nested ones, do not disturb each other.

`let index = 0` lives inside the method. Each call makes a fresh `index`, and the closure keeps it for that one iterator.

Resetting a position stored on the object, in `[Symbol.iterator]()`, is not enough. Two loops in a row then work, but a nested loop resets the outer one.

**Common mistake:** making the object its own iterator.

**Wrong**

```js
const shelf = {
  books: ["Emma", "Dune"],
  index: 0,
  [Symbol.iterator]() {
    «return this;»
  },
  next() {
    if (this.index === this.books.length) return { value: undefined, done: true };
    return { value: this.books[this.index++], done: false };
  },
};

console.log([...shelf].length);
console.log([...shelf].length);
```

**Output**

```text
2
0
```

**Fix**

```js
const shelf = {
  books: ["Emma", "Dune"],
  [Symbol.iterator]() {
    const books = this.books;
    «let index = 0;»

    «return {»
      next() {
        if (index === books.length) return { value: undefined, done: true };
        return { value: books[index++], done: false };
      },
    };
  },
};

console.log([...shelf].length);
console.log([...shelf].length);
```

The position lived on the shelf, so the first spread moved it to the end for good. The fix returns a new iterator, with its own `index`, on every call.

<!-- task -->

## Classes and linked lists

**Code**

```js
class Playlist {
  constructor() {
    this.first = null;
    this.last = null;
  }

  add(song) {
    const node = { song, after: null };
    if (this.last) this.last.after = node;
    else this.first = node;
    this.last = node;
    return this;
  }

  [Symbol.iterator]() {
    let node = this.first;

    return {
      next() {
        if (node === null) return { value: undefined, done: true };
        const song = node.song;
        node = node.after;
        return { value: song, done: false };
      },
    };
  }
}

const mix = new Playlist().add("Intro").add("Waves").add("Outro");
console.log([...mix].join(" > "));

const [opener] = mix;
console.log(opener);
```

**Output**

```text
Intro > Waves > Outro
Intro
```

**Rule:** In a class, `[Symbol.iterator]()` is a method like any other, and every instance becomes iterable. The iterator can walk any shape of data. Here it follows each node's `after` link until it reaches `null`.

A **linked list** is a chain of nodes. Each node holds a value and a link to the node after it.

The class hides how it stores its data. Code that uses it only sees the values, in order.

<!-- task -->

## Iterators that are iterable

**Code**

```js
function idCounter(limit) {
  let id = 0;

  return {
    next() {
      id++;
      if (id > limit) return { value: undefined, done: true };
      return { value: id, done: false };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

const ids = idCounter(4);
ids.next();

for (const id of ids) console.log(id);
console.log(ids[Symbol.iterator]() === ids);
```

**Output**

```text
2
3
4
true
```

**Rule:** An iterable makes iterators. An iterator hands out values. An iterator whose `[Symbol.iterator]()` returns `this` is both, so you can pass it straight to `for...of` or spread.

Every built-in iterator works this way, such as the one from `list.values()`.

It is still one pass. A second loop over `ids` gets nothing.

**Common mistake:** spreading a bare iterator.

**Wrong**

```js
function idCounter(limit) {
  let id = 0;

  return {
    next() {
      id++;
      if (id > limit) return { value: undefined, done: true };
      return { value: id, done: false };
    },
  };
}

console.log([...idCounter(2)].join(","));
```

**Error**

```text
TypeError: Spread syntax requires ...iterable[Symbol.iterator] to be a function
```

**Fix**

```js
function idCounter(limit) {
  let id = 0;

  return {
    next() {
      id++;
      if (id > limit) return { value: undefined, done: true };
      return { value: id, done: false };
    },
    «[Symbol.iterator]() {»
      «return this;»
    «},»
  };
}

console.log([...idCounter(2)].join(","));
```

Spread calls `[Symbol.iterator]()` first, and the bare iterator had none. Returning `this` makes the iterator its own iterable.

<!-- task -->

## Remember

- A `[Symbol.iterator]()` method makes an object or a class iterable. Write it as a method, so `this` is the object.
- `next()` must return an object `{ value, done }`.
- Return a new iterator on every call, with its own position, so loops do not clash.
- An iterator whose `[Symbol.iterator]()` returns `this` is iterable too, but only for one pass.
