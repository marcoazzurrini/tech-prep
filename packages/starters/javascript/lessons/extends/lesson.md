# extends

## A child class

**Code**

```js
class Book {
  constructor(title) {
    this.title = title;
  }

  label() {
    return `Book: ${this.title}`;
  }
}

class Ebook extends Book {
  download() {
    return `Downloading ${this.title}`;
  }
}

const ebook = new Ebook("Dune");

console.log(ebook.label());
console.log(ebook.download());
console.log(Object.getPrototypeOf(Ebook.prototype) === Book.prototype);
console.log(Object.hasOwn(Ebook.prototype, "label"));
```

**Output**

```text
Book: Dune
Downloading Dune
true
false
```

**Rule:** `class Ebook extends Book` makes `Ebook` a child class of `Book`, which is its parent class. It links `Ebook.prototype` to `Book.prototype`. So an `Ebook` instance finds the methods of both classes on its chain.

`new Ebook("Dune")` runs the constructor of `Book` with the same arguments, because `Ebook` has no constructor of its own.

`Book.prototype.shout = ...` added later is found by every `Ebook` too. The methods are linked, not copied.

<!-- task -->

## Statics are inherited

**Code**

```js
class Shape {
  static unit = "cm";

  static create(size) {
    return new this(size);
  }

  constructor(size) {
    this.size = size;
  }
}

class Square extends Shape {}

const square = Square.create(4);

console.log(Square.unit);
console.log(square instanceof Square);
console.log(Object.getPrototypeOf(Square) === Shape);
console.log(Object.hasOwn(Square, "create"));
```

**Output**

```text
cm
true
true
false
```

**Rule:** `extends` sets up a second chain: it links the class `Square` itself to the class `Shape`. So `Square` finds the static members of `Shape`. In an inherited static method, `this` is still the class before the dot.

`Object.getPrototypeOf(Shape) === Function.prototype` gives `true`. A class with no parent is linked to `Function.prototype`, like any function.

**Common mistake:** writing to an inherited static field through `this`.

**Wrong**

```js
class Shape {
  static count = 0;

  static track() {
    «this».count += 1;
  }
}

class Square extends Shape {}

Shape.track();
Square.track();
Square.track();

console.log(Shape.count);
console.log(Square.count);
```

**Output**

```text
1
3
```

**Fix**

```js
class Shape {
  static count = 0;

  static track() {
    «Shape».count += 1;
  }
}

class Square extends Shape {}

Shape.track();
Square.track();
Square.track();

console.log(Shape.count);
console.log(Square.count);
```

In `Square.track()`, `this` is `Square`. The assignment made a new `count` on `Square`, because writing never climbs the chain. Naming `Shape` keeps one counter, and both lines print `3`.

<!-- task -->

## instanceof up the chain

**Code**

```js
class Book {}
class Ebook extends Book {}
class Audiobook extends Book {}

const ebook = new Ebook();

console.log(ebook instanceof Ebook);
console.log(ebook instanceof Book);
console.log(ebook instanceof Object);
console.log(ebook instanceof Audiobook);
console.log(new Book() instanceof Ebook);
```

**Output**

```text
true
true
true
false
false
```

**Rule:** An instance of a child class is also an instance of every class above it, because `instanceof` finds each `prototype` on the chain. An instance of the parent is not an instance of the child.

`ebook.constructor === Ebook` gives `true`, and `ebook.constructor === Book` gives `false`. Use it to test for one exact class.

**Common mistake:** testing for the parent class first.

**Wrong**

```js
class Book {}
class Ebook extends Book {}

function shelf(item) {
  if (item instanceof «Book») {
    return "paper";
  }

  if (item instanceof «Ebook») {
    return "digital";
  }

  return "none";
}

console.log(shelf(new Ebook()));
```

**Output**

```text
paper
```

**Fix**

```js
class Book {}
class Ebook extends Book {}

function shelf(item) {
  if (item instanceof «Ebook») {
    return "digital";
  }

  if (item instanceof «Book») {
    return "paper";
  }

  return "none";
}

console.log(shelf(new Ebook()));
```

An `Ebook` is also a `Book`, so the first test took it. Test for the child class first, then for the parent.

<!-- task -->

## Remember

- `class B extends A` links `B.prototype` to `A.prototype`: instances of `B` inherit the methods of `A`.
- It also links `B` to `A`: `B` inherits the static members of `A`.
- Assigning `B.count` makes a new property on `B`. It does not change `A.count`.
- An instance of `B` is `instanceof A` too. Test for the child class first.
