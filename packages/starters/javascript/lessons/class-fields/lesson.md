# Class Fields

## One for each instance

**Code**

```js
class Cart {
  items = [];
  discount = 0;
  note;

  add(item) {
    this.items.push(item);
  }
}

const mine = new Cart();
const yours = new Cart();

mine.add("tea");

console.log(Object.keys(mine));
console.log(mine.items.length, yours.items.length);
console.log(Object.hasOwn(Cart.prototype, "items"));
console.log(mine.note);
```

**Output**

```text
[ "items", "discount", "note" ]
1 0
false
undefined
```

**Rule:** A **field** is a line such as `items = []` in the body of a class. It makes an own property on each instance. Its value is worked out again at every `new`, so each cart gets an array of its own.

`note;` is a field with no value. The property exists and holds `undefined`.

**Common mistake:** keeping an array on the prototype.

**Wrong**

```js
class Cart {}

«Cart.prototype.items = [];»

const mine = new Cart();
const yours = new Cart();

mine.items.push("tea");

console.log(yours.items.length);
```

**Output**

```text
1
```

**Fix**

```js
class Cart {
  «items = [];»
}

const mine = new Cart();
const yours = new Cart();

mine.items.push("tea");

console.log(yours.items.length);
```

**Output**

```text
0
```

The prototype holds one array, and every cart finds that same array. A field makes a new array for each cart.

<!-- task -->

## Before the constructor body

**Code**

```js
class Order {
  id = 7;
  label = `Order ${this.id}`;

  constructor(customer) {
    console.log(this.label);

    this.customer = customer;
    this.id = 8;
  }
}

const order = new Order("Ada");

console.log(JSON.stringify(order));
```

**Output**

```text
Order 7
{"id":8,"label":"Order 7","customer":"Ada"}
```

**Rule:** Fields are set from top to bottom, before the body of the constructor runs. In the value of a field, `this` is the new instance, so a field can read the fields above it.

`label` stays `"Order 7"` after `id` changes. The value of a field is worked out once, when the instance is made.

A class that extends another class sets its fields a little later. A later lesson covers it.

**Common mistake:** using a constructor parameter in a field.

**Wrong**

```js
class Ticket {
  price = «basePrice» * 2;

  constructor(basePrice) {
    this.basePrice = basePrice;
  }
}

console.log(new Ticket(10).price);
```

**Error**

```text
ReferenceError: basePrice is not defined
```

**Fix**

```js
class Ticket {
  price = 0;

  constructor(basePrice) {
    this.basePrice = basePrice;
    «this.price = basePrice * 2;»
  }
}

console.log(new Ticket(10).price);
```

A parameter belongs to the constructor, and a field is not inside it. Set the property in the constructor, where the parameter is in scope.

<!-- task -->

## An arrow function field

**Code**

```js
class Button {
  label = "Save";

  onClick = () => `${this.label} clicked`;

  describe() {
    return `${this.label} button`;
  }
}

const save = new Button();
const cancel = new Button();
const { onClick } = save;

console.log(onClick());
console.log(save.onClick === cancel.onClick);
console.log(save.describe === cancel.describe);
console.log(Object.keys(save));
```

**Output**

```text
Save clicked
false
true
[ "label", "onClick" ]
```

**Rule:** An arrow function in a field uses the `this` of the field, which is the instance. So it keeps its instance however it is called. The cost is one new function for each instance, where a method is shared.

**Common mistake:** passing a method as a callback.

**Wrong**

```js
class Timer {
  seconds = 0;

  «tick()» {
    this.seconds += 1;
  }
}

const timer = new Timer();

[1, 2, 3].forEach(timer.tick);

console.log(timer.seconds);
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.seconds')
```

**Fix**

```js
class Timer {
  seconds = 0;

  «tick = () =>» {
    this.seconds += 1;
  };
}

const timer = new Timer();

[1, 2, 3].forEach(timer.tick);

console.log(timer.seconds);
```

`forEach` calls `tick` plainly, so `this` is `undefined`. As an arrow function in a field, `tick` keeps its timer. A wrapper works too: `() => timer.tick()`.

<!-- task -->

## Remember

- A field such as `count = 0` makes an own property on each instance, with a fresh value each time.
- Fields are set top to bottom, before the constructor body. They cannot see its parameters.
- An arrow function in a field keeps `this` as the instance, so it is safe to pass as a callback.
- Each instance gets its own copy of that function. A method is shared on the prototype.
