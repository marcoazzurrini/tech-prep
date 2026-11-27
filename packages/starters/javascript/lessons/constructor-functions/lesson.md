# Constructor Functions and new

## What new does

**Code**

```js
function Ticket(film, seat) {
  this.film = film;
  this.seat = seat;
}

const ticket = new Ticket("Dune", "B4");

console.log(ticket.film, ticket.seat);
console.log(typeof ticket);
console.log(Object.getPrototypeOf(ticket) === Ticket.prototype);
console.log(new Ticket("Up", "A1") === new Ticket("Up", "A1"));
```

**Output**

```text
Dune B4
object
true
false
```

**Rule:** A **constructor function** is an ordinary function that is meant to be called with `new`. `new Ticket("Dune", "B4")` takes four steps. It makes a new empty object. It sets the object's prototype to `Ticket.prototype`. It runs `Ticket` with `this` set to the new object. Then it gives back that object.

`Ticket.prototype` is an object stored on the function `Ticket`. The next lesson is about it.

By custom, the name of a constructor starts with a capital letter. Each `new` makes a different object, so two tickets are never `===`.

<!-- task -->

## When it returns

**Code**

```js
function Plain() {
  this.kind = "plain";
  return 42;
}

function Swap() {
  this.kind = "swap";
  return { kind: "other" };
}

console.log(new Plain().kind);
console.log(new Swap().kind);
console.log(Object.getPrototypeOf(new Swap()) === Swap.prototype);
```

**Output**

```text
plain
other
false
```

**Rule:** A constructor that returns an object replaces the new one: `new` gives back the returned object, and the object `this` pointed to is thrown away. A returned primitive is ignored.

`return null` is ignored too. `null` is a primitive, not an object.

An array or a function counts as an object, so `new` gives it back in place of the new object.

<!-- task -->

## Forgetting new

**Code**

```js
function Ticket(film) {
  console.log(new.target === Ticket);
  this.film = film;
}

new Ticket("Dune");

try {
  Ticket("Up");
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
true
false
TypeError
```

**Rule:** Without `new`, `Ticket("Up")` is a plain call, so `this` is `undefined` in strict mode. Setting `this.film` then throws a `TypeError`. Inside a function, `new.target` is the function itself when it was called with `new`, and `undefined` when it was not.

In old code that is not strict, `this` would be the global object. `Ticket("Up")` would then make a global `film` and give `undefined`, with no error.

**Common mistake:** calling a constructor without `new`.

**Wrong**

```js
function Ticket(film) {
  this.film = film;
}

const ticket = «Ticket("Dune")»;
console.log(ticket.film);
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.film = film')
```

**Fix**

```js
function Ticket(film) {
  this.film = film;
}

const ticket = «new Ticket("Dune")»;
console.log(ticket.film);
```

The plain call gave `Ticket` no object to fill, so `this` was `undefined`. `new` makes the object first. Chrome and Node word the error as `Cannot set properties of undefined (setting 'film')`.

<!-- task -->

## Remember

- `new F()` makes an empty object, links it to `F.prototype`, runs `F` with `this` set to it, and gives it back.
- If `F` returns an object, `new` gives that object instead. A returned primitive or `null` is ignored.
- Without `new`, `this` is `undefined` in strict mode, so `this.x = ...` throws.
- `new.target` is the function when called with `new`, and `undefined` otherwise.
