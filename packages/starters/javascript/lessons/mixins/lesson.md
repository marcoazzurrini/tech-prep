# Mixins

## Copying methods in

**Code**

```js
const describable = {
  describe() {
    return `${this.name} (${this.kind})`;
  },
};

class Song {
  constructor(name) {
    this.name = name;
    this.kind = "song";
  }
}

class Podcast {
  constructor(name) {
    this.name = name;
    this.kind = "podcast";
  }
}

Object.assign(Song.prototype, describable);
Object.assign(Podcast.prototype, describable);

console.log(new Song("Intro").describe());
console.log(new Podcast("Daily").describe());
console.log(Song.prototype.describe === Podcast.prototype.describe);
console.log(Object.hasOwn(Song.prototype, "describe"));
```

**Output**

```text
Intro (song)
Daily (podcast)
true
true
```

**Rule:** A class can extend only one class. A **mixin** is a set of methods that many classes can take in without extending it. `Object.assign(Song.prototype, describable)` copies the methods onto the prototype, so every song gets them.

`Object.assign` replaces a method of the same name that the prototype already has. The mixin wins, silently.

A method that `Object.assign` adds is enumerable, unlike a method written in the class. So `for...in` lists it.

**Common mistake:** copying onto the class instead of its prototype.

**Wrong**

```js
const describable = {
  describe() {
    return `${this.name} (${this.kind})`;
  },
};

class Song {
  constructor(name) {
    this.name = name;
    this.kind = "song";
  }
}

Object.assign(«Song», describable);

const song = new Song("Intro");

console.log(song.describe());
```

**Error**

```text
TypeError: song.describe is not a function. (In 'song.describe()', 'song.describe' is undefined)
```

**Fix**

```js
const describable = {
  describe() {
    return `${this.name} (${this.kind})`;
  },
};

class Song {
  constructor(name) {
    this.name = name;
    this.kind = "song";
  }
}

Object.assign(«Song.prototype», describable);

const song = new Song("Intro");

console.log(song.describe());
```

Copied onto `Song`, `describe` became a static method. A song looks for methods on `Song.prototype`, not on `Song`.

<!-- task -->

## A class factory

**Code**

```js
const Timestamped = (Base) =>
  class extends Base {
    stamp(time) {
      this.savedAt = time;
      return this;
    }

    describe() {
      return `${super.describe()} at ${this.savedAt}`;
    }
  };

class Note {
  constructor(text) {
    this.text = text;
  }

  describe() {
    return `Note "${this.text}"`;
  }
}

class StampedNote extends Timestamped(Note) {}

const note = new StampedNote("milk").stamp("09:00");

console.log(note.describe());
console.log(note instanceof Note);
console.log(Timestamped(Note) === Timestamped(Note));
```

**Output**

```text
Note "milk" at 09:00
true
false
```

**Rule:** A mixin can be a function that takes a class and returns a subclass of it. This is a **class factory**: `(Base) => class extends Base { ... }`. Its methods are real class methods, so `super.describe()` calls the method of the base class.

Each call makes a new class. `Timestamped(Note)` and `Timestamped(Note)` are two different classes.

**Common mistake:** using `super` in a method copied with `Object.assign`.

**Wrong**

```js
class Note {
  describe() {
    return "Note";
  }
}

class StampedNote extends Note {}

const timestamped = {
  describe() {
    return `${«super.describe()»} at 09:00`;
  },
};

Object.assign(StampedNote.prototype, timestamped);

console.log(new StampedNote().describe());
```

**Error**

```text
TypeError: super.describe is not a function. (In 'super.describe()', 'super.describe' is undefined)
```

**Fix**

```js
class Note {
  describe() {
    return "Note";
  }
}

const Timestamped = (Base) =>
  «class extends Base» {
    describe() {
      return `${super.describe()} at 09:00`;
    }
  };

class StampedNote extends Timestamped(Note) {}

console.log(new StampedNote().describe());
```

`super` looks up from the object where the method was written. That is `timestamped`, whose prototype is `Object.prototype`, and it has no `describe`. Copying the method does not move its `super`. In a class factory, `super` is the base class.

<!-- task -->

## Two mixins

**Code**

```js
const Saved = (Base) =>
  class extends Base {
    describe() {
      return `${super.describe()} +saved`;
    }
  };

const Shared = (Base) =>
  class extends Base {
    describe() {
      return `${super.describe()} +shared`;
    }
  };

class Doc {
  describe() {
    return "doc";
  }
}

class Report extends Shared(Saved(Doc)) {}
class Draft extends Saved(Shared(Doc)) {}

console.log(new Report().describe());
console.log(new Draft().describe());
console.log(new Report() instanceof Doc);
```

**Output**

```text
doc +saved +shared
doc +shared +saved
true
```

**Rule:** Mixins compose by nesting: `Shared(Saved(Doc))`. The outer one becomes the direct parent of `Report`, so its method runs first. Each `super.describe()` calls the next class in, down to `Doc`. Swap the order, and the order of the work swaps too.

`new Report() instanceof Saved` throws a `TypeError`. `Saved` is an arrow function, not a class, so it has no `prototype`.

**Common mistake:** extending the mixin itself.

**Wrong**

```js
const Saved = (Base) =>
  class extends Base {
    save() {
      return "saved";
    }
  };

class Doc {}

class Report extends «Saved» {}

console.log(new Report().save());
```

**Error**

```text
TypeError: The superclass is not a constructor.
```

**Fix**

```js
const Saved = (Base) =>
  class extends Base {
    save() {
      return "saved";
    }
  };

class Doc {}

class Report extends «Saved(Doc)» {}

console.log(new Report().save());
```

`Saved` is a function that makes a class. It is not a class. Call it with a base class, and extend the class it returns. Chrome and Node say `Class extends value ... is not a constructor or null`.

<!-- task -->

## Remember

- A class extends only one class. A mixin adds methods from another source.
- `Object.assign(Target.prototype, mixin)` copies methods in. It overwrites methods of the same name, and `super` in them does not reach the class's parent.
- `const Mixin = (Base) => class extends Base { ... }` makes a subclass, so `super` works.
- `A(B(Base))` nests two mixins. The outer one's method runs first.
