# Writing call, apply and bind

## call with a symbol key

**Code**

```js
Function.prototype.myCall = function (thisArg, ...args) {
  const key = Symbol("fn");
  thisArg[key] = this;
  const result = thisArg[key](...args);
  delete thisArg[key];
  return result;
};

function greet(greeting, mark) {
  return `${greeting}, ${this.name}${mark}`;
}

const ada = { name: "Ada" };

console.log(greet.myCall(ada, "Hello", "!"));
console.log(Reflect.ownKeys(ada).length);
```

**Output**

```text
Hello, Ada!
1
```

**Rule:** In `greet.myCall(ada)`, `this` is the function `greet`. To run it with `this` set to `ada`, store it on `ada` under a temporary key and call it as a method of `ada`. Then delete the key and return the result.

A new `Symbol` is a key that no other code has. It cannot replace a property the object already has, and `Object.keys` does not list it.

`greet.myCall(null)` throws a `TypeError`, because `null` cannot hold a key. The real `call` passes `null` on as `this`. A polyfill cannot copy that exactly.

**Common mistake:** a string as the temporary key.

**Wrong**

```js
Function.prototype.myCall = function (thisArg, ...args) {
  «thisArg.fn = this;
  const result = thisArg.fn(...args);
  delete thisArg.fn;»
  return result;
};

function total() {
  return this.price * 2;
}

const order = { price: 5, fn: "express" };

console.log(total.myCall(order));
console.log(order.fn);
```

**Output**

```text
10
undefined
```

**Fix**

```js
Function.prototype.myCall = function (thisArg, ...args) {
  «const key = Symbol("fn");
  thisArg[key] = this;
  const result = thisArg[key](...args);
  delete thisArg[key];»
  return result;
};

function total() {
  return this.price * 2;
}

const order = { price: 5, fn: "express" };

console.log(total.myCall(order));
console.log(order.fn);
```

The order had its own `fn`. The polyfill wrote over it, then deleted it. A fresh symbol cannot be a key that the object already uses.

<!-- task -->

## apply takes an array

**Code**

```js
Function.prototype.myApply = function (thisArg, args) {
  const key = Symbol("fn");
  thisArg[key] = this;
  const result = thisArg[key](...(args ?? []));
  delete thisArg[key];
  return result;
};

function total(tax, tip) {
  return this.price + tax + tip;
}

function label() {
  return `table ${this.table}`;
}

console.log(total.myApply({ price: 20 }, [2, 3]));
console.log(label.myApply({ table: 4 }));
console.log(label.myApply({ table: 7 }, null));
```

**Output**

```text
25
table 4
table 7
```

**Rule:** `myApply` works like `myCall`, but it takes the arguments as one array and spreads it into the call. The real `apply` also accepts `null` or `undefined` in place of the array, and then passes no arguments.

`args ?? []` gives an empty array when `args` is `null` or `undefined`. Spreading an empty array passes nothing.

**Common mistake:** spreading an array that was not passed.

**Wrong**

```js
Function.prototype.myApply = function (thisArg, args) {
  const key = Symbol("fn");
  thisArg[key] = this;
  const result = thisArg[key](«...args»);
  delete thisArg[key];
  return result;
};

function label() {
  return `table ${this.table}`;
}

console.log(label.myApply({ table: 4 }));
```

**Error**

```text
TypeError: Spread syntax requires ...iterable not be null or undefined
```

**Fix**

```js
Function.prototype.myApply = function (thisArg, args) {
  const key = Symbol("fn");
  thisArg[key] = this;
  const result = thisArg[key](«...(args ?? [])»);
  delete thisArg[key];
  return result;
};

function label() {
  return `table ${this.table}`;
}

console.log(label.myApply({ table: 4 }));
```

The call left out the array, so `args` was `undefined`, and spread cannot take `undefined` apart. Chrome and Node word the error as `args is not iterable`.

<!-- task -->

## bind with saved arguments

**Code**

```js
Function.prototype.myBind = function (thisArg, ...early) {
  const fn = this;
  return function (...later) {
    return fn.apply(thisArg, [...early, ...later]);
  };
};

function order(table, dish) {
  return `${this.name}, table ${table}: ${dish}`;
}

const cafe = { name: "Cafe" };
const tableFour = order.myBind(cafe, 4);

console.log(tableFour("soup"));
console.log(tableFour.call({ name: "Bar" }, "tea"));
console.log(order.myBind(cafe)(2, "pie"));
```

**Output**

```text
Cafe, table 4: soup
Cafe, table 4: tea
Cafe, table 2: pie
```

**Rule:** `myBind` returns a new function that remembers the function, `this` and the first arguments. Each call passes the saved arguments first and the new ones after them.

The new function ignores its own `this`. So `call` with another object cannot change it.

Save the function as `fn` before you return. Inside the new function, `this` is whatever its caller gave.

**Common mistake:** reading `this` inside the returned function.

**Wrong**

```js
Function.prototype.myBind = function (thisArg, ...early) {
  return function (...later) {
    return «this».apply(thisArg, [...early, ...later]);
  };
};

function order(table, dish) {
  return `${this.name}, table ${table}: ${dish}`;
}

const tableFour = order.myBind({ name: "Cafe" }, 4);
console.log(tableFour("soup"));
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.apply')
```

**Fix**

```js
Function.prototype.myBind = function (thisArg, ...early) {
  «const fn = this;»
  return function (...later) {
    return «fn».apply(thisArg, [...early, ...later]);
  };
};

function order(table, dish) {
  return `${this.name}, table ${table}: ${dish}`;
}

const tableFour = order.myBind({ name: "Cafe" }, 4);
console.log(tableFour("soup"));
```

`tableFour("soup")` is a plain call, so the inner function's `this` was `undefined`. The original function was the `this` of `myBind`, one level up. Keep it in a variable there.

<!-- task -->

## new ignores the bound this

**Code**

```js
Function.prototype.myBind = function (thisArg, ...early) {
  const fn = this;
  return function (...later) {
    if (new.target) {
      return new fn(...early, ...later);
    }
    return fn.apply(thisArg, [...early, ...later]);
  };
};

function Ticket(film, seat) {
  this.film = film;
  this.seat = seat;
}

const box = { film: "none" };
const DuneTicket = Ticket.myBind(box, "Dune");
const ticket = new DuneTicket("B4");

console.log(ticket.film, ticket.seat);
console.log(ticket instanceof Ticket);
console.log(box.film);
```

**Output**

```text
Dune B4
true
none
```

**Rule:** The real `bind` makes a function that also works with `new`. Then the bound `this` is ignored. `new` builds an object from the original function, with the saved arguments first.

`new.target` is set when the function was called with `new`, and `undefined` in a plain call. Use it to pick the branch.

The constructor returns the object made by `new fn(...)`. When a constructor returns an object, `new` gives back that object.

**Common mistake:** applying the bound `this` under `new`.

**Wrong**

```js
Function.prototype.myBind = function (thisArg, ...early) {
  const fn = this;
  return function (...later) {
    return «fn.apply(thisArg, [...early, ...later])»;
  };
};

function Ticket(film, seat) {
  this.film = film;
  this.seat = seat;
}

const box = { film: "none" };
const ticket = new (Ticket.myBind(box, "Dune"))("B4");

console.log(ticket.film, ticket instanceof Ticket);
console.log(box.film, box.seat);
```

**Output**

```text
undefined false
Dune B4
```

**Fix**

```js
Function.prototype.myBind = function (thisArg, ...early) {
  const fn = this;
  return function (...later) {
    «if (new.target) {
      return new fn(...early, ...later);
    }»
    return fn.apply(thisArg, [...early, ...later]);
  };
};

function Ticket(film, seat) {
  this.film = film;
  this.seat = seat;
}

const box = { film: "none" };
const ticket = new (Ticket.myBind(box, "Dune"))("B4");

console.log(ticket.film, ticket instanceof Ticket);
console.log(box.film, box.seat);
```

`Ticket` ran with `this` set to `box`, so it filled in `box`. The new ticket stayed empty, and it is not a `Ticket`. Under `new`, call the original function with `new` too.

<!-- task -->

## Remember

- `myCall` stores the function on the object under a fresh `Symbol`, calls it as a method, deletes the key and returns the result.
- `myApply` does the same with one array of arguments, and treats `null` or `undefined` as no arguments.
- `myBind` saves the function as `fn`, and returns a function that passes the saved arguments first.
- Under `new`, a bound function ignores the bound `this`: check `new.target` and call `new fn(...)`.
