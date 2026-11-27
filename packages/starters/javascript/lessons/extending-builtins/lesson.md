# Extending Built-ins

## Extending Array

**Code**

```js
class ScoreList extends Array {
  highest() {
    return Math.max(...this);
  }
}

const scores = new ScoreList(12, 35, 20, 8);
const passing = scores.filter((n) => n >= 15);

console.log(Array.isArray(scores));
console.log(passing instanceof ScoreList);
console.log(passing.highest());
```

**Output**

```text
true
true
35
```

**Rule:** A class can extend `Array` to add methods while keeping array behaviour. Methods such as `filter`, `map` and `slice` return instances of the subclass.

`ScoreList.from([4, 9])` also returns a `ScoreList`, because the subclass inherits `Array`'s static methods.

`new ScoreList(3)` creates an empty array of length `3`, just like `new Array(3)`.

<!-- task -->

## Choosing the return type

**Code**

```js
class LabeledList extends Array {
  static get [Symbol.species]() {
    return Array;
  }

  constructor(label, ...items) {
    super(...items);
    this.label = label;
  }
}

const list = new LabeledList("math", 10, 20, 30);
const doubled = list.map((n) => n * 2);

console.log(list.label);
console.log(doubled instanceof LabeledList);
console.log(doubled instanceof Array);
console.log(doubled.join(","));
```

**Output**

```text
math
false
true
20,40,60
```

**Rule:** A static getter named `[Symbol.species]` tells methods like `map`, `filter` and `slice` which constructor to use for the result. Returning `Array` makes them return plain arrays.

Without `[Symbol.species]`, `Array` methods read `this.constructor` and call it with the new array's length.

**Common mistake:** adding extra constructor arguments to an `Array` subclass without `[Symbol.species]`.

**Wrong**

```js
class LabeledList extends Array {
  «constructor(label, ...items) {»
    super(...items);
    this.label = label;
  }
}

const list = new LabeledList("math", 10, 20);
const doubled = list.map((n) => n * 2);

console.log(doubled.label);
console.log(doubled.length);
```

**Output**

```text
2
2
```

**Fix**

```js
class LabeledList extends Array {
  «static get [Symbol.species]() { return Array; }»

  constructor(label, ...items) {
    super(...items);
    this.label = label;
  }
}

const list = new LabeledList("math", 10, 20);
const doubled = list.map((n) => n * 2);

console.log(doubled.label);
console.log(doubled.length);
```

`map` called `new LabeledList(2)` with the length, so `2` landed in `label`. Returning `Array` from `[Symbol.species]` makes `map` return a plain array instead.

<!-- task -->

## Other built-ins and statics

**Code**

```js
class DefaultMap extends Map {
  constructor(fallback, entries) {
    super(entries);
    this.fallback = fallback;
  }

  get(key) {
    return this.has(key) ? super.get(key) : this.fallback;
  }
}

const counts = new DefaultMap(0, [["a", 2]]);
console.log(counts.get("a"));
console.log(counts.get("b"));
console.log(counts instanceof Map);
console.log(Object.getPrototypeOf(Map) === Function.prototype);
console.log(typeof Map.keys);
```

**Output**

```text
2
0
true
true
undefined
```

**Rule:** You can extend `Map`, `Set` and `Error` in the same way, because `super()` creates their internal storage. Unlike user classes, built-ins do not inherit static methods from `Object`.

`Object.getPrototypeOf(Array) === Function.prototype` is `true`, so `Array.keys` is `undefined`.

`Map.prototype` still inherits from `Object.prototype`, so instances keep methods like `toString`.

<!-- task -->

## Remember

- A class can extend built-ins such as `Array`, `Map`, `Set` and `Error`.
- Array methods like `map`, `filter` and `slice` return instances of the subclass by default.
- Define `static get [Symbol.species]() { return Array; }` when derived array methods should return plain arrays.
- Built-in classes do not inherit static methods from `Object`; their prototype is `Function.prototype`.
