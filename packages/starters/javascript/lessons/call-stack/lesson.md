# The Call Stack

## Push, run, pop

**Code**

```js
function makeTea() {
  console.log("tea: start");
  boilWater();
  console.log("tea: end");
}

function boilWater() {
  console.log("water: start");
  console.log("water: end");
}

makeTea();
console.log("done");
```

**Output**

```text
tea: start
water: start
water: end
tea: end
done
```

**Rule:** The **call stack** is the pile of calls that have started and not finished. A call is pushed on top when it starts. It is popped off when it returns.

`boilWater()` is pushed on top of `makeTea()`. `makeTea()` stops at that line and waits. When `boilWater()` returns, it is popped, and `makeTea()` carries on.

Each entry on the stack is a **frame**. It holds one call's arguments, its local variables and the line it stopped at.

<!-- task -->

## Only the top runs

**Code**

```js
function size() {
  console.log("size");
  return 2;
}

function unitPrice() {
  console.log("unit price");
  return 5;
}

function cost(amount, price) {
  console.log("cost");
  return amount * price;
}

console.log(cost(size(), unitPrice()));
```

**Output**

```text
size
unit price
cost
10
```

**Rule:** JavaScript runs one call at a time: the one on top of the stack. Every call below it waits.

`cost(size(), unitPrice())` needs its arguments first. So `size()` runs and returns, then `unitPrice()`. Only then is `cost` pushed.

The outer `console.log` is a call too. It waits for its argument, so `10` is printed last.

<!-- task -->

## A stack trace

**Code**

```js
const stack = [];

function checkout() {
  stack.push("checkout");
  loadCart();
  addTax();
  stack.pop();
}

function loadCart() {
  stack.push("loadCart");
  stack.pop();
}

function addTax() {
  stack.push("addTax");
  console.log(stack.toReversed().join("\n"));
  stack.pop();
}

checkout();
```

**Output**

```text
addTax
checkout
```

**Rule:** A **stack trace** lists the calls that are on the stack at one moment, newest first. A call that has already returned is not in it.

The array `stack` copies by hand what JavaScript does for every call. `loadCart` was popped before `addTax` started, so the trace does not show it.

`error.stack` holds the stack trace of an error, as text. It names the function that threw first, then its caller, and so on down.

<!-- task -->

## Remember

- A call is pushed on the stack when it starts, and popped when it returns.
- Only the call on top runs. Its caller waits at the line of the call.
- The arguments of a call are worked out before the call is pushed.
- A stack trace lists the unfinished calls, newest first.
