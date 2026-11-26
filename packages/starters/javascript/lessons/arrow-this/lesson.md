# this in Arrow Functions

## No this of its own

**Code**

```js
const team = {
  name: "Blue",
  players: ["Ana", "Leo"],
  list() {
    this.players.forEach((player) => {
      console.log(`${this.name}: ${player}`);
    });
  },
};

team.list();
```

**Output**

```text
Blue: Ana
Blue: Leo
```

**Rule:** An arrow function has no `this` of its own. Inside it, `this` is the `this` of the function around it.

Here the function around the arrow function is `list`. The call was `team.list()`, so `this` is `team` in both.

**Common mistake:** writing the callback as a regular function.

**Wrong**

```js
const team = {
  name: "Blue",
  players: ["Ana", "Leo"],
  list() {
    this.players.forEach(«function (player)» {
      console.log(`${this.name}: ${player}`);
    });
  },
};

team.list();
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.name')
```

**Fix**

```js
const team = {
  name: "Blue",
  players: ["Ana", "Leo"],
  list() {
    this.players.forEach(«(player) =>» {
      console.log(`${this.name}: ${player}`);
    });
  },
};

team.list();
```

A regular function gets its own `this` at each call. `forEach` makes a plain call, so that `this` was `undefined`. An arrow function reads the `this` of `list`.

<!-- task -->

## Fixed where it is written

**Code**

```js
const lamp = {
  name: "lamp",
  getReader() {
    return () => this.name;
  },
};

const radio = { name: "radio" };
const read = lamp.getReader();

radio.read = read;

console.log(read());
console.log(radio.read());
console.log(read.call(radio));
console.log(read.bind(radio)());
```

**Output**

```text
lamp
lamp
lamp
lamp
```

**Rule:** An arrow function finds `this` as it finds a variable: in the code around it. The way it is called does not matter, so `call`, `apply` and `bind` cannot change its `this`.

`read.call(radio, 1, 2)` still passes `1` and `2`. Only the value for `this` is ignored.

`lamp.getReader.call(radio)()` gives `"radio"`. `getReader` is a regular function, so its `this` is set at each call. The arrow function follows it.

<!-- task -->

## Not for methods

**Code**

```js
function createUser() {
  return {
    name: "Ada",
    regular() {
      return this?.name;
    },
    arrow: () => this?.name,
  };
}

const user = createUser();

console.log(user.regular());
console.log(user.arrow());
```

**Output**

```text
Ada
undefined
```

**Rule:** The braces of an object literal are not a function, so they give an arrow function no `this`. An arrow function used as a method takes `this` from the function around the object.

Here that function is `createUser`. `createUser()` is a plain call, so `this` is `undefined` in `arrow`.

**Common mistake:** writing a method as an arrow function.

**Wrong**

```js
function createCounter() {
  return {
    count: 0,
    increment: «() =>» {
      this.count += 1;

      return this.count;
    },
  };
}

const counter = createCounter();

console.log(counter.increment());
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.count')
```

**Fix**

```js
function createCounter() {
  return {
    count: 0,
    «increment()» {
      this.count += 1;

      return this.count;
    },
  };
}

const counter = createCounter();

console.log(counter.increment());
```

The call `counter.increment()` has `counter` before the dot, but an arrow function ignores that. A method written as `increment() { }` gets `this` from the call.

<!-- task -->

## Remember

- An arrow function has no `this` of its own. It uses the `this` of the function around it.
- `call`, `apply` and `bind` cannot change `this` in an arrow function.
- Use an arrow function for a callback inside a method.
- Do not write a method as an arrow function. An object literal gives it no `this`.
