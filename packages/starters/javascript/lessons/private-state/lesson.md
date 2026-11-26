# Private State with Closures

## Hidden from outside

**Code**

```js
function createAccount(balance) {
  return {
    deposit(amount) {
      balance += amount;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createAccount(100);

account.deposit(50);

console.log(account.getBalance());
console.log(account.balance);
```

**Output**

```text
150
undefined
```

**Rule:** A variable inside a function cannot be reached from outside. Only the functions created in that scope can use it, so it is **private state**.

`account.balance` gives `undefined`. The object has two properties, `deposit` and `getBalance`, and nothing else.

<!-- task -->

## Guarding the state

**Code**

```js
function createAccount(balance) {
  return {
    withdraw(amount) {
      if (amount > balance) {
        return false;
      }

      balance -= amount;
      return true;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createAccount(50);

console.log(account.withdraw(30));
console.log(account.withdraw(30));
console.log(account.getBalance());
```

**Output**

```text
true
false
20
```

**Rule:** Outside code can change private state only through the functions you return. Put the checks in those functions, and the state can never become invalid.

**Common mistake:** returning a private array itself.

**Wrong**

```js
function createPlaylist() {
  const songs = [];

  return {
    add(song) {
      songs.push(song);
    },
    getSongs() {
      return «songs»;
    },
  };
}

const playlist = createPlaylist();

playlist.add("Intro");
playlist.getSongs().push("Advert");

console.log(playlist.getSongs().length);
```

**Output**

```text
2
```

**Fix**

```js
function createPlaylist() {
  const songs = [];

  return {
    add(song) {
      songs.push(song);
    },
    getSongs() {
      return «[...songs]»;
    },
  };
}

const playlist = createPlaylist();

playlist.add("Intro");
playlist.getSongs().push("Advert");

console.log(playlist.getSongs().length);
```

**Output**

```text
1
```

`getSongs` handed out the private array, so outside code could change it. A copy keeps the private array out of reach.

<!-- task -->

## Each call, separate state

**Code**

```js
function createCounter(start) {
  let count = start;

  return {
    increment() {
      count += 1;
    },
    getCount() {
      return count;
    },
  };
}

const visits = createCounter(0);
const errors = createCounter(10);

visits.increment();
visits.increment();
errors.increment();

console.log(visits.getCount());
console.log(errors.getCount());
```

**Output**

```text
2
11
```

**Rule:** Each call makes a new object with its own private variables. Two objects from two calls share no state.

`createCounter` is a **factory**: a function that builds and returns objects.

`visits.increment === errors.increment` gives `false`. Each call makes new functions too.

<!-- task -->

## Run only once

**Code**

```js
function once(fn) {
  let done = false;
  let result;

  return (...args) => {
    if (!done) {
      done = true;
      result = fn(...args);
    }

    return result;
  };
}

const connect = once(() => {
  console.log("connecting");

  return "ready";
});

console.log(connect());
console.log(connect());
```

**Output**

```text
connecting
ready
ready
```

**Rule:** A function can keep private state about another function. `once` hides a flag and the first result, so `fn` runs a single time.

**Common mistake:** using the result as the flag.

**Wrong**

```js
function once(fn) {
  let result;

  return (...args) => {
    if («result === undefined») {
      result = fn(...args);
    }

    return result;
  };
}

let runs = 0;
const setUp = once(() => {
  runs += 1;
});

setUp();
setUp();

console.log(runs);
```

**Output**

```text
2
```

**Fix**

```js
function once(fn) {
  let done = false;
  let result;

  return (...args) => {
    if («!done») {
      done = true;
      result = fn(...args);
    }

    return result;
  };
}

let runs = 0;
const setUp = once(() => {
  runs += 1;
});

setUp();
setUp();

console.log(runs);
```

**Output**

```text
1
```

`fn` returned `undefined`, so `result` never looked filled, and `fn` ran again. A separate flag works for any result.

<!-- task -->

## Remember

- A variable inside a function is private. Only the functions created there can use it.
- Return functions that check before they change the state. Return copies of private arrays.
- Each call of a factory makes separate state.
- `once(fn)` keeps a private flag and the first result.
