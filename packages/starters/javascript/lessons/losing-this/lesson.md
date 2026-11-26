# Losing this

## A method in a variable

**Code**

```js
const user = {
  name: "Ada",
  whoAmI() {
    return this === undefined ? "nobody" : this.name;
  },
};

const whoAmI = user.whoAmI;

console.log(user.whoAmI());
console.log(whoAmI());
console.log(whoAmI === user.whoAmI);
```

**Output**

```text
Ada
nobody
true
```

**Rule:** `user.whoAmI` without `()` gives the function alone. The function keeps no link to `user`. Calling it through the variable is a plain call, so `this` is `undefined`.

`const { whoAmI } = user` does the same. Destructuring reads the property into a variable.

**Common mistake:** destructuring a method, then calling it.

**Wrong**

```js
const cart = {
  prices: [4, 6],
  total() {
    return this.prices[0] + this.prices[1];
  },
};

const «{ total }» = cart;

console.log(total());
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.prices')
```

**Fix**

```js
const cart = {
  prices: [4, 6],
  total() {
    return this.prices[0] + this.prices[1];
  },
};

console.log(«cart.total()»);
```

`total()` is a plain call, so `this` is `undefined` and `this.prices` throws. Keep the object, and call the method on it.

<!-- task -->

## A method as a callback

**Code**

```js
function run(action) {
  return action();
}

const user = {
  name: "Ada",
  whoAmI() {
    return this === undefined ? "nobody" : this.name;
  },
};

console.log(run(user.whoAmI));
console.log(run(() => user.whoAmI()));
```

**Output**

```text
nobody
Ada
```

**Rule:** Passing `user.whoAmI` passes the function alone, and the receiver calls it plainly. To keep `this`, pass a **wrapper**: a small function that calls the method on its object.

`setTimeout(user.whoAmI, 100)` loses `this` in the same way.

**Common mistake:** passing a method straight to `forEach`.

**Wrong**

```js
const basket = {
  items: [],
  add(item) {
    this.items.push(item);
  },
};

["tea", "jam"].forEach(«basket.add»);

console.log(basket.items.join(", "));
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.items')
```

**Fix**

```js
const basket = {
  items: [],
  add(item) {
    this.items.push(item);
  },
};

["tea", "jam"].forEach(«(item) => basket.add(item)»);

console.log(basket.items.join(", "));
```

`forEach` got the function without `basket`. The wrapper makes a method call each time, and passes the item on. `bind`, in a later lesson, builds such a wrapper for you.

<!-- task -->

## Only a direct call

**Code**

```js
const door = {
  name: "Door",
  locked: true,
  whoAmI() {
    return this === undefined ? "nobody" : this.name;
  },
};

console.log(door.whoAmI());
console.log((door.whoAmI)());
console.log((door.locked ? door.whoAmI : null)());
console.log((door.whoAmI || null)());
console.log((0, door.whoAmI)());
```

**Output**

```text
Door
Door
nobody
nobody
nobody
```

**Rule:** The object becomes `this` only when the call sits right on the property: `door.whoAmI()` or `door["whoAmI"]()`. When an operator handles the function first, it gives back the function alone.

`(door.whoAmI)()` keeps `this`. Parentheses alone change nothing.

`door.whoAmI?.()` keeps `this` too.

**Common mistake:** choosing a method with `?:`, then calling the result.

**Wrong**

```js
const report = {
  title: "Sales",
  long: false,
  short() {
    return this.title;
  },
  full() {
    return `${this.title}, all rows`;
  },
};

console.log(«(report.long ? report.full : report.short)()»);
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.title')
```

**Fix**

```js
const report = {
  title: "Sales",
  long: false,
  short() {
    return this.title;
  },
  full() {
    return `${this.title}, all rows`;
  },
};

console.log(«report.long ? report.full() : report.short()»);
```

`?:` gives back a function, and the call after it is plain. Make the call inside each branch.

<!-- task -->

## Remember

- `obj.method` without `()` gives the function alone. It keeps no link to `obj`.
- A method in a variable, destructured or passed as a callback is called plainly. Its `this` is `undefined`.
- To pass a method, wrap the call: `() => obj.method()`.
- Only `obj.method()` and `obj["method"]()` make `obj` the `this`. `(a ? obj.method : other)()` does not.
