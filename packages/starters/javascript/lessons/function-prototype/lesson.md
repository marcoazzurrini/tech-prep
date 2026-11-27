# The prototype Property

## Shared methods

**Code**

```js
function Player(name) {
  this.name = name;
}

Player.prototype.greet = function () {
  return "Hi, " + this.name;
};

const ada = new Player("Ada");
const kim = new Player("Kim");

console.log(ada.greet(), kim.greet());
console.log(ada.greet === kim.greet);
console.log(Object.hasOwn(ada, "greet"));
```

**Output**

```text
Hi, Ada Hi, Kim
true
false
```

**Rule:** An ordinary function, written with `function`, has a `prototype` property that holds an object. `new Player()` makes objects whose prototype is `Player.prototype`. A method put there is stored once and shared by every player, and `this` is the player it is called on.

Keep data that differs per object in the constructor, with `this.name = name`. Put methods on `Player.prototype`.

**Common mistake:** making each method again for every object.

**Wrong**

```js
function Player(name) {
  this.name = name;
  «this.greet = function () {
    return "Hi, " + this.name;
  };»
}

const ada = new Player("Ada");
const kim = new Player("Kim");

console.log(ada.greet === kim.greet);
```

**Output**

```text
false
```

**Fix**

```js
function Player(name) {
  this.name = name;
}

«Player.prototype.greet = function () {
  return "Hi, " + this.name;
};»

const ada = new Player("Ada");
const kim = new Player("Kim");

console.log(ada.greet === kim.greet);
```

**Output**

```text
true
```

Each `new` ran the constructor body again, so each player got its own copy of the function. On the prototype, a thousand players share one copy.

<!-- task -->

## Two different links

**Code**

```js
function Player() {}
const player = new Player();

console.log(typeof Player.prototype);
console.log(Object.getPrototypeOf(player) === Player.prototype);
console.log(Object.getPrototypeOf(Player) === Player.prototype);
console.log(Object.getPrototypeOf(Player) === Function.prototype);
console.log(player.prototype);
```

**Output**

```text
object
true
false
true
undefined
```

**Rule:** `Player.prototype` is an ordinary property of the function. It is the prototype that `new Player()` gives to the objects it makes. It is not the prototype of `Player` itself. Like every ordinary function, `Player` links to `Function.prototype`.

`player.prototype` is `undefined`. The objects that `new` makes have no `prototype` property.

`(() => {}).prototype` is `undefined`. Arrow functions and methods written as `greet() {}` have no `prototype`, and `new` on them throws a `TypeError`.

**Common mistake:** putting a method on the function instead of on its `prototype`.

**Wrong**

```js
function Player(name) {
  this.name = name;
}

«Player.greet» = function () {
  return "Hi, " + this.name;
};

const ada = new Player("Ada");
console.log(ada.greet());
```

**Error**

```text
TypeError: ada.greet is not a function. (In 'ada.greet()', 'ada.greet' is undefined)
```

**Fix**

```js
function Player(name) {
  this.name = name;
}

«Player.prototype.greet» = function () {
  return "Hi, " + this.name;
};

const ada = new Player("Ada");
console.log(ada.greet());
```

`Player.greet` is a property of the function object, and `ada` does not link to the function. `ada` links to `Player.prototype`. Chrome and Node word the error as `ada.greet is not a function`.

<!-- task -->

## constructor points back

**Code**

```js
function Player(name) {
  this.name = name;
}

const ada = new Player("Ada");
const kim = new ada.constructor("Kim");

console.log(Player.prototype.constructor === Player);
console.log(ada.constructor === Player, Object.hasOwn(ada, "constructor"));
console.log(kim.name, Object.getPrototypeOf(kim) === Player.prototype);
```

**Output**

```text
true
true false
Kim true
```

**Rule:** The `prototype` object a function starts with holds one property, `constructor`, which points back at the function. Every player inherits it, so `ada.constructor` is `Player`.

`new ada.constructor("Kim")` makes another object of the same kind as `ada`, without naming `Player`.

`for...in` does not list `constructor`. It has `enumerable: false`.

**Common mistake:** replacing the whole `prototype` with a literal.

**Wrong**

```js
function Player(name) {
  this.name = name;
}

Player.prototype = «{
  greet() {
    return "Hi, " + this.name;
  },
}»;

const ada = new Player("Ada");
console.log(ada.constructor === Player, ada.constructor.name);
```

**Output**

```text
false Object
```

**Fix**

```js
function Player(name) {
  this.name = name;
}

Player.prototype = {
  «constructor: Player,»
  greet() {
    return "Hi, " + this.name;
  },
};

const ada = new Player("Ada");
console.log(ada.constructor === Player, ada.constructor.name);
```

**Output**

```text
true Player
```

The new literal had no `constructor`, so the read went up to `Object.prototype` and found `Object`. JavaScript never fixes `constructor` for you. Add it back, or add methods one at a time to the `prototype` that is already there.

<!-- task -->

## Read when new runs

**Code**

```js
function Plan() {}
Plan.prototype.tier = "basic";

const early = new Plan();

Plan.prototype.seats = 5;
Plan.prototype = { tier: "pro" };

const late = new Plan();

console.log(early.tier, early.seats);
console.log(late.tier, late.seats);
console.log(early.constructor === Plan, late.constructor === Plan);
```

**Output**

```text
basic 5
pro undefined
true false
```

**Rule:** `new Plan()` reads `Plan.prototype` at the moment it runs. A property added to that object shows at once in every object linked to it. Putting a new object in `Plan.prototype` changes only the objects made after. The objects made before keep their link to the old one.

`Plan.prototype = 5` is allowed, but `new Plan()` then uses `Object.prototype`. A prototype must be an object.

<!-- task -->

## Remember

- `new F()` gives its objects `F.prototype` as their prototype. Methods put there are shared by all of them.
- `F.prototype` is not the prototype of `F`, which is `Function.prototype`. Arrow functions have no `prototype`.
- `F.prototype.constructor` is `F`. Replacing `F.prototype` with a literal loses it.
- `new` reads `F.prototype` when it runs. Replacing it later does not move objects made before.
