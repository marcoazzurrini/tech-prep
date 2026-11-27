# Getters and Setters in Classes

## On the prototype

**Code**

```js
class Temperature {
  #celsius;

  constructor(celsius) {
    this.#celsius = celsius;
  }

  get fahrenheit() {
    return this.#celsius * 1.8 + 32;
  }
}

const today = new Temperature(20);

console.log(today.fahrenheit);
console.log(Object.hasOwn(today, "fahrenheit"));
console.log(Object.hasOwn(Temperature.prototype, "fahrenheit"));
console.log(Object.keys(today));
console.log(JSON.stringify(today));
```

**Output**

```text
68
false
true
[]
{}
```

**Rule:** `get fahrenheit()` in a class body puts one accessor on `Temperature.prototype`. An **accessor** is a property run by a getter, a setter or both. Every instance shares it, and it is not an own property of any of them.

A getter suits a **derived value**: one worked out from other data on each read. There is nothing to keep in sync.

`"fahrenheit" in today` gives `true`, because `in` looks up the prototype chain.

**Common mistake:** expecting JSON to include a getter.

**Wrong**

```js
class Temperature {
  #celsius = 20;

  get fahrenheit() {
    return this.#celsius * 1.8 + 32;
  }
}

console.log(«JSON.stringify(new Temperature())»);
```

**Output**

```text
{}
```

**Fix**

```js
class Temperature {
  #celsius = 20;

  get fahrenheit() {
    return this.#celsius * 1.8 + 32;
  }

  «toJSON() {
    return { celsius: this.#celsius, fahrenheit: this.fahrenheit };
  }»
}

console.log(JSON.stringify(new Temperature()));
```

**Output**

```text
{"celsius":20,"fahrenheit":68}
```

`JSON.stringify` and spread copy only own properties. The getter lives on the prototype, so both skip it. `toJSON` says exactly what to write.

<!-- task -->

## A setter that checks

**Code**

```js
class Product {
  #price = 0;

  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  get price() {
    return this.#price;
  }

  set price(value) {
    if (typeof value !== "number" || value < 0) {
      throw new RangeError(`Bad price: ${value}`);
    }

    this.#price = value;
  }
}

const tea = new Product("tea", 4);

tea.price = 5;
console.log(tea.price);

try {
  new Product("milk", -1);
} catch (error) {
  console.log(error.message);
}

console.log(Object.keys(tea));
```

**Output**

```text
5
Bad price: -1
[ "name" ]
```

**Rule:** A setter can check a value before it stores it in a private field. `this.price = price` in the constructor runs the setter too, so even the first value is checked.

The private field holds the value for the accessor. Unlike `_price`, no code outside the class can change it.

**Common mistake:** a public field with the accessor's name.

**Wrong**

```js
class Product {
  #price = 0;
  «price = 0;»

  get price() {
    return this.#price;
  }

  set price(value) {
    if (value < 0) {
      throw new RangeError(`Bad price: ${value}`);
    }

    this.#price = value;
  }
}

const tea = new Product();

tea.price = -5;

console.log(tea.price);
```

**Output**

```text
-5
```

**Fix**

```js
class Product {
  «#price = 0;»

  get price() {
    return this.#price;
  }

  set price(value) {
    if (value < 0) {
      throw new RangeError(`Bad price: ${value}`);
    }

    this.#price = value;
  }
}

const tea = new Product();

try {
  tea.price = -5;
} catch (error) {
  console.log(error.message);
}
```

**Output**

```text
Bad price: -5
```

The field `price = 0` made an own property on each product. It sits in front of the accessor on the prototype. So `tea.price = -5` wrote that plain property, and the setter never ran. Remove the public field.

<!-- task -->

## Static accessors

**Code**

```js
class Order {
  static #count = 0;

  constructor(total) {
    Order.#count += 1;
    this.total = total;
  }

  static get count() {
    return Order.#count;
  }
}

new Order(10);
new Order(25);

console.log(Order.count);
console.log(Object.hasOwn(Order, "count"));
console.log(Object.keys(Order));
console.log(new Order(5).count);
```

**Output**

```text
2
true
[]
undefined
```

**Rule:** `static get count()` puts an accessor on the class itself. Read it as `Order.count`, with no parentheses. A static getter over a private static field gives outside code a value it can read but not change.

`Order.count = 0` throws a `TypeError`, because `count` has no setter.

An accessor in a class body is not enumerable, so `Object.keys` and `for...in` skip it. An accessor in an object literal is enumerable.

<!-- task -->

## Remember

- `get` and `set` in a class put one accessor on the prototype. It is not an own property of the instance.
- So `Object.keys`, spread and `JSON.stringify` skip it. Add `toJSON` to include it.
- Keep the value in a private field, and check it in the setter. A public field with the same name hides the accessor.
- `static get name()` puts an accessor on the class itself.
