# instanceof

## Walking the chain

**Code**

```js
function Order() {}
function Refund() {}

const order = new Order();
const fake = Object.create(Order.prototype);

console.log(order instanceof Order, order instanceof Refund);
console.log(order instanceof Object);
console.log(fake instanceof Order);
```

**Output**

```text
true false
true
true
```

**Rule:** `obj instanceof F` walks up the prototype chain of `obj`. It gives `true` if it meets `F.prototype` on the way. It never asks which function made the object.

`fake` was made by `Object.create`, and `Order` never ran. It still passes, because `Order.prototype` is on its chain.

`order instanceof Object` is `true`. The chain of `order` goes on past `Order.prototype` to `Object.prototype`.

**Common mistake:** putting a plain object on the right of `instanceof`.

**Wrong**

```js
const orderProto = { kind: "order" };
const order = Object.create(orderProto);

console.log(order instanceof «orderProto»);
```

**Error**

```text
TypeError: orderProto is not a function. (evaluating 'order instanceof orderProto')
```

**Fix**

```js
const orderProto = { kind: "order" };
const order = Object.create(orderProto);

console.log(«orderProto.isPrototypeOf(order)»);
```

`instanceof` needs a function on its right, and reads that function's `prototype`. `proto.isPrototypeOf(obj)` asks the same question about an object: is `proto` on the chain of `obj`? Chrome and Node word the error as `Right-hand side of 'instanceof' is not callable`.

<!-- task -->

## Changed after the fact

**Code**

```js
function Plan() {}
const old = new Plan();

Plan.prototype = { tier: "pro" };
const fresh = new Plan();

console.log(old instanceof Plan, fresh instanceof Plan);
console.log(old.constructor === Plan);

Object.setPrototypeOf(old, Plan.prototype);
console.log(old instanceof Plan);
```

**Output**

```text
false true
true
true
```

**Rule:** `instanceof` reads `Plan.prototype` as it is at the moment of the check. `old` still links to the first prototype object, which `Plan` no longer holds, so the check fails.

`old.constructor` still says `Plan`. It is read from the old prototype object, which still holds it.

`Object.setPrototypeOf(old, Plan.prototype)` moves the link, so `old` passes again.

**Common mistake:** checking the kind of an object with `constructor`.

**Wrong**

```js
function Coupon(code) {
  this.code = code;
}

Coupon.prototype = {
  apply(total) {
    return total - 5;
  },
};

const coupon = new Coupon("SAVE5");
console.log(«coupon.constructor === Coupon»);
```

**Output**

```text
false
```

**Fix**

```js
function Coupon(code) {
  this.code = code;
}

Coupon.prototype = {
  apply(total) {
    return total - 5;
  },
};

const coupon = new Coupon("SAVE5");
console.log(«coupon instanceof Coupon»);
```

**Output**

```text
true
```

The new prototype has no `constructor`, so the read found `Object`. `constructor` is a plain property that anyone can lose or change. `instanceof` checks the chain itself.

<!-- task -->

## Where it says false

**Code**

```js
const bare = Object.create(null);

console.log(bare instanceof Object);
console.log([1, 2] instanceof Array, [1, 2] instanceof Object);
console.log(7 instanceof Number, "tea" instanceof String);
console.log(null instanceof Object);
```

**Output**

```text
false
true true
false false
false
```

**Rule:** `Object.create(null)` makes an object with no prototype at all. Its chain is empty, so it is not an `instanceof Object`. A primitive has no chain either, so `instanceof` gives `false` for every primitive, `null` included.

An array passes both checks. Its chain is `Array.prototype`, then `Object.prototype`.

`Symbol.hasInstance` is a method a function can define to answer `instanceof` its own way. A later lesson covers it.

<!-- task -->

## Remember

- `obj instanceof F` is `true` when `F.prototype` is somewhere on the chain of `obj`.
- It reads `F.prototype` at the time of the check. Replacing it later fails objects made before.
- `proto.isPrototypeOf(obj)` asks the same question with an object in place of a function.
- A primitive, `null` and an object with no prototype give `false`.
