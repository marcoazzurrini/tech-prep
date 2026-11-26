# this in a Method Call

## The object before the dot

**Code**

```js
const user = {
  name: "Ada",
  greet() {
    return `Hi, I am ${this.name}`;
  },
};

console.log(user.greet());

user.name = "Grace";

console.log(user.greet());
```

**Output**

```text
Hi, I am Ada
Hi, I am Grace
```

**Rule:** A **method** is a function stored in a property of an object. In the call `user.greet()`, `this` is the object before the dot: `user`.

`greet() { ... }` is short for `greet: function () { ... }`.

`this.name` is read when the method runs, so the second call sees the new name.

**Common mistake:** reading a property without `this`.

**Wrong**

```js
const cart = {
  prices: [4, 6],
  count() {
    return «prices».length;
  },
};

console.log(cart.count());
```

**Error**

```text
ReferenceError: prices is not defined
```

**Fix**

```js
const cart = {
  prices: [4, 6],
  count() {
    return «this.prices».length;
  },
};

console.log(cart.count());
```

A bare name is a variable, and no variable `prices` exists. A property is reached through its object, and inside a method that object is `this`.

<!-- task -->

## Set at each call

**Code**

```js
function describe() {
  return `${this.name} costs ${this.price}`;
}

const tea = { name: "Tea", price: 3, describe };
const cake = { name: "Cake", price: 5, describe };

console.log(tea.describe());
console.log(cake.describe());
console.log(tea.describe === cake.describe);
```

**Output**

```text
Tea costs 3
Cake costs 5
true
```

**Rule:** `this` is not fixed when a function is written. It is set at each call, to the object the call is made on.

`cake["describe"]()` sets `this` to `cake` too. Square brackets work like the dot.

`const scone = { name: "Scone", price: 2, describe: tea.describe }` gives `scone` the same function. Then `scone.describe()` reads `scone.name`, not `tea.name`.

<!-- task -->

## Only the nearest object

**Code**

```js
const shop = {
  name: "Corner Shop",
  owner: {
    name: "Ada",
    greet() {
      return `Hi from ${this.name}`;
    },
  },
};

console.log(shop.owner.greet());
```

**Output**

```text
Hi from Ada
```

**Rule:** In `shop.owner.greet()`, `this` is `shop.owner`: the object right before the last dot. The objects further left play no part.

**Common mistake:** reaching for the outer object through `this`.

**Wrong**

```js
const order = {
  id: 7,
  customer: {
    name: "Ada",
    label() {
      return `${this.name}, order ${«this.id»}`;
    },
  },
};

console.log(order.customer.label());
```

**Output**

```text
Ada, order undefined
```

**Fix**

```js
const order = {
  id: 7,
  customer: {
    name: "Ada",
    label() {
      return `${this.name}, order ${«order.id»}`;
    },
  },
};

console.log(order.customer.label());
```

**Output**

```text
Ada, order 7
```

`this` is `order.customer`, and that object has no `id`. A nested object has no link back to the object that holds it, so name the outer object.

<!-- task -->

## Remember

- In `obj.method()`, `this` is the object before the dot.
- `this` is set at each call. One function can run for many objects.
- In `a.b.method()`, `this` is `a.b`, not `a`.
- Inside a method, reach a property with `this.name`. A bare `name` is a variable.
