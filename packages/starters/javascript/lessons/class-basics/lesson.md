# Classes

## A function with methods

**Code**

```js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hi, ${this.name}`;
  }
}

const ada = new User("Ada");
const leo = new User("Leo");

console.log(ada.greet());
console.log(typeof User);
console.log(Object.keys(ada));
console.log(ada.greet === User.prototype.greet);
console.log(ada.greet === leo.greet);
```

**Output**

```text
Hi, Ada
function
[ "name" ]
true
true
```

**Rule:** `class User { ... }` makes a function named `User`. `new User("Ada")` runs the `constructor` method. Every other method goes on `User.prototype`, so all the objects share it. An object made by `new User()` is an **instance** of the class.

`Object.keys(ada)` gives `["name"]`. The constructor put `name` on the instance. `greet` is found through the prototype chain.

`class Empty {}` has no `constructor`, so it gets an empty one.

<!-- task -->

## Only with new

**Code**

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function attempt(action) {
  try {
    action();

    return "ok";
  } catch (error) {
    return error.name;
  }
}

console.log(attempt(() => new Point(1, 2)));
console.log(attempt(() => Point(1, 2)));
console.log(attempt(() => Point.call({}, 1, 2)));
```

**Output**

```text
ok
TypeError
TypeError
```

**Rule:** A class can only be called with `new`. A call without `new` throws a `TypeError`, and so do `call` and `apply`.

A constructor function has no such guard. Without `new` it runs as a plain call.

**Common mistake:** passing a class where a function is called.

**Wrong**

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

const users = ["Ada", "Leo"].map(«User»);

console.log(users.length);
```

**Error**

```text
TypeError: Cannot call a class constructor User without |new|
```

**Fix**

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

const users = ["Ada", "Leo"].map(«(name) => new User(name)»);

console.log(users.length);
```

`map` calls its callback plainly, without `new`. The arrow function makes the `new` call. Chrome and Node word the error as `Class constructor User cannot be invoked without 'new'`.

<!-- task -->

## Methods skip the loop

**Code**

```js
function OldCart() {
  this.items = 2;
}

OldCart.prototype.total = function () {
  return this.items * 5;
};

class Cart {
  constructor() {
    this.items = 2;
  }

  total() {
    return this.items * 5;
  }
}

function loopKeys(obj) {
  const keys = [];

  for (const key in obj) {
    keys.push(key);
  }

  return keys;
}

console.log(loopKeys(new OldCart()));
console.log(loopKeys(new Cart()));
console.log(new Cart().total());
```

**Output**

```text
[ "items", "total" ]
[ "items" ]
10
```

**Rule:** A method written in a class is not enumerable, so `for...in` skips it. A method assigned to `prototype` by hand is enumerable, and the loop lists it.

`Object.getOwnPropertyNames(Cart.prototype)` gives `["constructor", "total"]`. It lists the keys that are not enumerable too.

The body of a class is always in strict mode, even in a sloppy file. A method called plainly gets `undefined` as `this`.

<!-- task -->

## Not before its line

**Code**

```js
function early() {
  try {
    console.log(greet());
    console.log(new Robot().name);
  } catch (error) {
    console.log(error.name);
  }

  function greet() {
    return "hello";
  }

  class Robot {
    constructor() {
      this.name = "R2";
    }
  }

  console.log(new Robot().name);
}

early();
```

**Output**

```text
hello
ReferenceError
R2
```

**Rule:** A function declaration is hoisted with its body. A class declaration is not. Like `let`, its name is in the dead zone until its line runs.

A class declaration belongs to its block, as `let` does.

`const Robot = class { ... }` is a class expression: a class written as a value. It follows the rules of its variable.

<!-- task -->

## Remember

- A class is a function. Its `constructor` runs on `new`, and its other methods live on `prototype`.
- A class called without `new` throws a `TypeError`.
- Class methods are not enumerable, and the class body is always strict.
- A class cannot be used before its line: it has a dead zone, as `let` does.
