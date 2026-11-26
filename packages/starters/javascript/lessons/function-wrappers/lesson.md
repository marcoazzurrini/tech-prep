# Wrapping Functions

## A function around another

**Code**

```js
function withLog(fn) {
  return function (...args) {
    console.log(`called with ${args.join(", ")}`);

    const result = fn(...args);

    console.log(`returned ${result}`);

    return result;
  };
}

const add = (a, b) => a + b;
const loggedAdd = withLog(add);

console.log(loggedAdd(2, 3));
```

**Output**

```text
called with 2, 3
returned 5
5
```

**Rule:** A **wrapper** takes a function and returns a new one. The new function does something extra, calls the original with every argument, and returns its result.

`add` is not changed. `add(2, 3)` still prints nothing.

`loggedAdd.length` gives `0`. The new function has its own `length` and `name`.

**Common mistake:** not returning the result of the original.

**Wrong**

```js
function withLog(fn) {
  return function (...args) {
    console.log(`called with ${args.join(", ")}`);
    «fn(...args);»
  };
}

const add = (a, b) => a + b;
const loggedAdd = withLog(add);

console.log(loggedAdd(2, 3));
```

**Output**

```text
called with 2, 3
undefined
```

**Fix**

```js
function withLog(fn) {
  return function (...args) {
    console.log(`called with ${args.join(", ")}`);
    «return fn(...args);»
  };
}

const add = (a, b) => a + b;
const loggedAdd = withLog(add);

console.log(loggedAdd(2, 3));
```

**Output**

```text
called with 2, 3
5
```

The new function called `add` and dropped what it returned. The caller expects the result of the original.

<!-- task -->

## Pass this on

**Code**

```js
function withLog(fn) {
  return function (...args) {
    console.log(`called with ${args.join(", ")}`);

    return fn.apply(this, args);
  };
}

const account = {
  balance: 100,
  deposit(amount) {
    this.balance += amount;

    return this.balance;
  },
};

account.deposit = withLog(account.deposit);

console.log(account.deposit(50));
```

**Output**

```text
called with 50
150
```

**Rule:** The new function gets `this` from its own call. `fn.apply(this, args)` calls the original with that same `this` and the same arguments. Then the wrapper works on methods too.

The call is `account.deposit(50)`, so `this` is `account` in the new function. `apply` hands it on to the original `deposit`.

**Common mistake:** calling the original as a plain function.

**Wrong**

```js
function withLog(fn) {
  return function (...args) {
    console.log(`called with ${args.join(", ")}`);

    return «fn(...args)»;
  };
}

const account = {
  balance: 100,
  deposit(amount) {
    this.balance += amount;

    return this.balance;
  },
};

account.deposit = withLog(account.deposit);

console.log(account.deposit(50));
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.balance')
```

**Fix**

```js
function withLog(fn) {
  return function (...args) {
    console.log(`called with ${args.join(", ")}`);

    return «fn.apply(this, args)»;
  };
}

const account = {
  balance: 100,
  deposit(amount) {
    this.balance += amount;

    return this.balance;
  },
};

account.deposit = withLog(account.deposit);

console.log(account.deposit(50));
```

`fn(...args)` is a plain call, so `this` was `undefined` inside `deposit`. The new function had the right `this` and did not pass it on.

<!-- task -->

## Not an arrow function

**Code**

```js
function keepThis(fn) {
  return function (...args) {
    return fn.apply(this, args);
  };
}

function loseThis(fn) {
  return (...args) => fn.apply(this, args);
}

const dog = {
  name: "Rex",
  speak(sound) {
    return `${this?.name} says ${sound}`;
  },
};

dog.bark = keepThis(dog.speak);
dog.growl = loseThis(dog.speak);

console.log(dog.bark("woof"));
console.log(dog.growl("grr"));
```

**Output**

```text
Rex says woof
undefined says grr
```

**Rule:** A wrapper must return a regular function, which gets `this` at each call. An arrow function has no `this` of its own, so it would pass on the `this` of the wrapper.

`loseThis(dog.speak)` is a plain call, so `this` is `undefined` in `loseThis`. Its arrow function passes that `undefined` to `speak`.

<!-- task -->

## Remember

- A wrapper takes a function and returns a new one that calls it.
- Pass every argument on, and return the result.
- Call the original with `fn.apply(this, args)`, so the wrapper works on methods too.
- Return a regular function from a wrapper, not an arrow function.
