# Getters and Setters

## Getters run on read

**Code**

```js
const cart = {
  prices: [4, 6],
  get total() {
    return this.prices[0] + this.prices[1];
  },
};

console.log(cart.total);

cart.prices[0] = 10;

console.log(cart.total);
console.log(typeof cart.total);
```

**Output**

```text
10
16
number
```

**Rule:** `get total() { ... }` makes a getter: a function that runs each time `cart.total` is read. The read gives what the function returns. There are no parentheses, and `this` is the object the property is read from.

`Object.keys(cart)` gives `["prices", "total"]`. From outside, a getter looks like a plain property.

`{ ...cart }` runs the getter once and copies the result. The copy has a plain `total` that stays `16`.

**Common mistake:** calling a getter.

**Wrong**

```js
const cart = {
  prices: [4, 6],
  get total() {
    return this.prices[0] + this.prices[1];
  },
};

console.log(cart.total«()»);
```

**Error**

```text
TypeError: cart.total is not a function. (In 'cart.total()', 'cart.total' is 10)
```

**Fix**

```js
const cart = {
  prices: [4, 6],
  get total() {
    return this.prices[0] + this.prices[1];
  },
};

console.log(cart.total);
```

`cart.total` already ran the getter and gave `10`. The parentheses then tried to call the number `10`.

<!-- task -->

## Setters run on assignment

**Code**

```js
const timer = {
  seconds: 90,
  get minutes() {
    return this.seconds / 60;
  },
  set minutes(value) {
    this.seconds = value * 60;
  },
};

timer.minutes = 3;

console.log(timer.seconds);
console.log(timer.minutes);
```

**Output**

```text
180
3
```

**Rule:** `set minutes(value) { ... }` makes a setter: a function that runs each time `timer.minutes` is assigned. The assigned value is its one parameter. A getter and a setter with the same name make one property.

`timer.minutes += 1` runs the getter, then the setter.

`(timer.minutes = 3)` gives `3`, the value on the right. What a setter returns is ignored.

<!-- task -->

## Half a pair

**Code**

```js
const account = {
  cents: 250,
  get euros() {
    return this.cents / 100;
  },
  set note(text) {
    this.lastNote = text;
  },
};

account.note = "rent";

console.log(account.note);
console.log(account.lastNote);

try {
  account.euros = 9;
} catch (error) {
  console.log(error.name);
}

console.log(account.euros);
```

**Output**

```text
undefined
rent
TypeError
2.5
```

**Rule:** A property with a setter and no getter reads as `undefined`. A property with a getter and no setter is read-only: assigning to it throws a `TypeError` in strict mode. A module is always in strict mode.

In old code that is not strict, the assignment does nothing and gives no error.

**Common mistake:** assigning to a property that is computed.

**Wrong**

```js
const cart = {
  items: 2,
  get isEmpty() {
    return this.items === 0;
  },
};

«cart.isEmpty = true;»

console.log(cart.isEmpty);
```

**Error**

```text
TypeError: Attempted to assign to readonly property.
```

**Fix**

```js
const cart = {
  items: 2,
  get isEmpty() {
    return this.items === 0;
  },
};

«cart.items = 0;»

console.log(cart.isEmpty);
```

`isEmpty` has no setter, so it cannot be assigned. Change the data that the getter reads. Chrome and Node word the error as `Cannot set property isEmpty of #<Object> which has only a getter`.

<!-- task -->

## The backing property

**Code**

```js
const user = {
  _name: "Ada",
  get name() {
    return this._name;
  },
  set name(value) {
    if (value.trim() === "") {
      throw new RangeError("Name is empty");
    }

    this._name = value.trim();
  },
};

user.name = "  Grace ";
console.log(user.name);

try {
  user.name = "  ";
} catch (error) {
  console.log(error.message);
}

console.log(user.name);
```

**Output**

```text
Grace
Name is empty
Grace
```

**Rule:** A getter and a setter store nothing themselves. To check or clean a value, they keep it in a second property with another name, such as `_name`. That one is called the backing property.

`user._name = ""` still works. The underscore only asks other code to stay away.

**Common mistake:** reading the property inside its own getter.

**Wrong**

```js
const user = {
  _name: "Ada",
  get name() {
    return «this.name»;
  },
};

console.log(user.name);
```

**Error**

```text
RangeError: Maximum call stack size exceeded.
```

**Fix**

```js
const user = {
  _name: "Ada",
  get name() {
    return «this._name»;
  },
};

console.log(user.name);
```

`this.name` inside the getter runs the getter again, without end. A setter that assigns `this.name` fails the same way. Use the backing property.

<!-- task -->

## Remember

- `get name()` runs when the property is read, and `set name(value)` when it is assigned. No parentheses.
- Only a getter: read-only, and assigning throws in strict mode. Only a setter: reads as `undefined`.
- Keep the value in a backing property such as `_name`. Using the same name recurses without end.
- Spread and `Object.assign` copy the value a getter returns, not the getter.
