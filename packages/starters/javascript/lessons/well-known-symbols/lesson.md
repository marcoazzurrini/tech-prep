# Well-known Symbols

## Hooks into the language

**Code**

```js
class Playlist {
  constructor(...songs) {
    this.songs = songs;
  }

  [Symbol.iterator]() {
    return this.songs.values();
  }

  [Symbol.toPrimitive](hint) {
    return hint === "number" ? this.songs.length : `${this.songs.length} songs`;
  }

  get [Symbol.toStringTag]() {
    return "Playlist";
  }
}

const mix = new Playlist("Intro", "Rain", "Home");

console.log([...mix].join(", "));
console.log(`${mix}`);
console.log(+mix);
console.log(Object.prototype.toString.call(mix));
```

**Output**

```text
Intro, Rain, Home
3 songs
3
[object Playlist]
```

**Rule:** A **well-known symbol** is a built-in symbol kept as a property of `Symbol`, such as `Symbol.iterator`. When the language runs an operation, it looks on the object for that operation's symbol key. If the key is there, the object decides how the operation goes.

`Symbol.keyFor(Symbol.iterator)` gives `undefined`. A well-known symbol is not in the `Symbol.for` registry, but it is the same symbol in every file.

**Common mistake:** writing the tag as a method.

**Wrong**

```js
class Invoice {
  «[Symbol.toStringTag]()» {
    return "Invoice";
  }
}

console.log(Object.prototype.toString.call(new Invoice()));
```

**Output**

```text
[object Object]
```

**Fix**

```js
class Invoice {
  «get [Symbol.toStringTag]()» {
    return "Invoice";
  }
}

console.log(Object.prototype.toString.call(new Invoice()));
```

**Output**

```text
[object Invoice]
```

`Object.prototype.toString` reads the value under `Symbol.toStringTag` and uses it only if it is a string. A method is a function, so it was ignored. A getter makes the value a string.

<!-- task -->

## Answering instanceof

**Code**

```js
class Priced {
  static [Symbol.hasInstance](value) {
    return typeof value?.price === "number";
  }
}

const book = { title: "Dune", price: 12 };
const note = { title: "Shopping" };

console.log(book instanceof Priced);
console.log(note instanceof Priced);
console.log(new Priced() instanceof Priced);
```

**Output**

```text
true
false
false
```

**Rule:** `x instanceof F` first looks for a method at `F[Symbol.hasInstance]`. It calls that method with `x` and turns the result into a boolean. With a method of your own, the prototype chain is not checked at all.

`Function.prototype[Symbol.hasInstance]` is the default method, and it walks the chain. Every function inherits it, so you write your own only to change the answer.

**Common mistake:** leaving out `static`.

**Wrong**

```js
class Even {
  «[Symbol.hasInstance](n)» {
    return n % 2 === 0;
  }
}

console.log(4 instanceof Even);
```

**Output**

```text
false
```

**Fix**

```js
class Even {
  «static [Symbol.hasInstance](n)» {
    return n % 2 === 0;
  }
}

console.log(4 instanceof Even);
```

**Output**

```text
true
```

Without `static`, the method sits on `Even.prototype`. `instanceof` reads `Even[Symbol.hasInstance]`, so it found the default and walked the chain of `4`, which has none. Your own method can even accept a primitive.

<!-- task -->

## Spreading into concat

**Code**

```js
const fruit = ["apple"];
const greens = ["leek", "kale"];
const box = { length: 2, 0: "fig", 1: "plum", [Symbol.isConcatSpreadable]: true };

greens[Symbol.isConcatSpreadable] = false;

const all = fruit.concat(box, greens);

console.log(all.length);
console.log(all[1], all[2]);
console.log(Array.isArray(all[3]));
```

**Output**

```text
4
fig plum
true
```

**Rule:** `concat` spreads an argument into the result when its `Symbol.isConcatSpreadable` is `true`. When the key is missing, it spreads arrays only. With `false`, an array stays whole and becomes one item.

`box` is an array-like, so `concat` reads its `length` and its indexes. Without the symbol, the whole object would be one item.

`static get [Symbol.species]()` on an `Array` subclass picks the class that `map`, `filter`, `slice` and `concat` use for the array they return.

<!-- task -->

## The async hook

**Code**

```js
const feed = {
  async *[Symbol.asyncIterator]() {
    yield "news";
    await null;
    yield "sport";
  },
};

for await (const topic of feed) {
  console.log(topic);
}

console.log(typeof feed[Symbol.iterator]);
```

**Output**

```text
news
sport
undefined
```

**Rule:** `for await...of` looks for a method under `Symbol.asyncIterator`. The iterator it returns has a `next()` that gives a promise of `{ value, done }`. An `async *` method writes that iterator for you.

When `Symbol.asyncIterator` is missing, `for await...of` uses `Symbol.iterator` and awaits each value. So it also works on an array of promises.

**Common mistake:** spreading an async iterable.

**Wrong**

```js
const feed = {
  async *[Symbol.asyncIterator]() {
    yield "news";
    yield "sport";
  },
};

const topics = «[...feed]»;
console.log(topics.length);
```

**Error**

```text
TypeError: Spread syntax requires ...iterable[Symbol.iterator] to be a function
```

**Fix**

```js
const feed = {
  async *[Symbol.asyncIterator]() {
    yield "news";
    yield "sport";
  },
};

const topics = «await Array.fromAsync(feed)»;
console.log(topics.length);
```

Spread and `for...of` look only for `Symbol.iterator`, and `feed` has none. `Array.fromAsync(feed)` reads an async iterable and gives a promise of the array. Chrome and Node say `feed is not iterable`.

<!-- task -->

## Remember

- A well-known symbol is a key the language looks up: `Symbol.iterator` for `for...of`, `Symbol.asyncIterator` for `for await...of`.
- `Symbol.toPrimitive` drives conversion. `Symbol.toStringTag` names the object, and must give a string.
- `static [Symbol.hasInstance]` answers `instanceof`, and the chain is not checked.
- `Symbol.isConcatSpreadable` decides whether `concat` spreads a value. `Symbol.species` picks the class of derived arrays.
