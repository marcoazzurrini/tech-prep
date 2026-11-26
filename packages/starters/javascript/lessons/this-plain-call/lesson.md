# this in a Plain Call

## No object, no this

**Code**

```js
function kind() {
  return typeof this;
}

const tool = { kind };

console.log(tool.kind());
console.log(kind());
```

**Output**

```text
object
undefined
```

**Rule:** A **plain call** has no object before the function: `kind()`. In a plain call, `this` is `undefined`.

`kind()` gives `"undefined"` because every module runs in strict mode. Old non-strict code gets the global object as `this` instead.

**Common mistake:** calling a function that reads `this` with no object.

**Wrong**

```js
function describe() {
  return `${this.name} costs ${this.price}`;
}

const tea = { name: "Tea", price: 3, describe };

console.log(«describe()»);
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.name')
```

**Fix**

```js
function describe() {
  return `${this.name} costs ${this.price}`;
}

const tea = { name: "Tea", price: 3, describe };

console.log(«tea.describe()»);
```

`this` was `undefined`, and reading a property of `undefined` throws. Chrome and Node word the error as `Cannot read properties of undefined (reading 'name')`.

<!-- task -->

## A function inside a method

**Code**

```js
const lamp = {
  name: "Lamp",
  check() {
    function inner() {
      return typeof this;
    }

    return `${typeof this}, then ${inner()}`;
  },
};

console.log(lamp.check());
```

**Output**

```text
object, then undefined
```

**Rule:** Every function gets its own `this`, from its own call. `inner()` is a plain call, so its `this` is `undefined`, even inside a method.

**Common mistake:** using `this` in a helper function inside a method.

**Wrong**

```js
const cart = {
  rate: 2,
  prices: [4, 6],
  total() {
    function withRate(price) {
      return price * «this.rate»;
    }

    return withRate(this.prices[0]) + withRate(this.prices[1]);
  },
};

console.log(cart.total());
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.rate')
```

**Fix**

```js
const cart = {
  rate: 2,
  prices: [4, 6],
  total() {
    «const rate = this.rate;»

    function withRate(price) {
      return price * «rate»;
    }

    return withRate(this.prices[0]) + withRate(this.prices[1]);
  },
};

console.log(cart.total());
```

The helper is called plainly, so its `this` is `undefined`. The method reads `this.rate` into a variable, and the helper uses that variable through its closure.

<!-- task -->

## Calls made for you

**Code**

```js
const team = {
  name: "Blue",
  members: ["Ada", "Kim"],
  list() {
    this.members.forEach(function (member) {
      console.log(member, typeof this);
    });
  },
};

team.list();
```

**Output**

```text
Ada undefined
Kim undefined
```

**Rule:** A callback is called by the code you hand it to. `forEach` calls it with no object, so its `this` is `undefined`.

`obj.make()()` is two calls. The first is a method call. The second calls the returned function plainly.

**Common mistake:** using `this` in a callback inside a method.

**Wrong**

```js
const team = {
  name: "Blue",
  members: ["Ada", "Kim"],
  labels() {
    const result = [];

    this.members.forEach(function (member) {
      result.push(`${«this.name»}: ${member}`);
    });

    return result;
  },
};

console.log(team.labels().join(", "));
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.name')
```

**Fix**

```js
const team = {
  name: "Blue",
  members: ["Ada", "Kim"],
  labels() {
    const result = [];
    «const self = this;»

    this.members.forEach(function (member) {
      result.push(`${«self.name»}: ${member}`);
    });

    return result;
  },
};

console.log(team.labels().join(", "));
```

`self` is a plain variable that holds the method's `this`. The callback reaches it through its closure. A later lesson shows how arrow functions do this for you.

<!-- task -->

## Remember

- A plain call, `f()`, sets `this` to `undefined` in strict mode. Old non-strict code gets the global object.
- Every function gets its own `this`. A function inside a method does not share the method's `this`.
- A callback and a returned function are called plainly.
- To use the method's `this` in an inner function, keep it in a variable: `const self = this`.
