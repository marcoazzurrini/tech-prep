# Promises

## Pending, then settled

**Code**

```js
const order = new Promise((resolve) => {
  setTimeout(() => resolve("pizza"), 20);
});

const payment = new Promise((resolve, reject) => {
  reject(new Error("card declined"));
});

console.log("ordered");
order.then((food) => console.log("arrived: " + food));
payment.catch((error) => console.log("failed: " + error.message));
```

**Output**

```text
ordered
failed: card declined
arrived: pizza
```

**Rule:** A **promise** is an object that stands for a result that comes later. It starts **pending**. `resolve(value)` makes it **fulfilled** with a value. `reject(reason)` makes it **rejected** with a reason.

A promise that is fulfilled or rejected is **settled**. Reject with an `Error`, as you would `throw` one.

`promise.then(fn)` calls `fn` with the value once the promise is fulfilled. `promise.catch(fn)` calls `fn` with the reason once it is rejected. The next lesson covers both.

<!-- task -->

## The executor runs at once

**Code**

```js
console.log("before");

const job = new Promise((resolve) => {
  console.log("executor runs");
  resolve("done");
  console.log("still in the executor");
});

console.log("after");
job.then((value) => console.log(value));
```

**Output**

```text
before
executor runs
still in the executor
after
done
```

**Rule:** The function you pass to `new Promise` is the **executor**. It runs at once, during `new Promise`, before the next line. It gets two functions: `resolve` and `reject`.

`resolve` does not stop the executor. The code after it still runs. Write `return resolve(value)` to stop there.

Slow work inside the executor does not run in the background. It blocks the program, as any other code does.

<!-- task -->

## Settled only once

**Code**

```js
const vote = new Promise((resolve, reject) => {
  resolve("yes");
  resolve("no");
  reject(new Error("too late"));
});

vote.then((answer) => console.log("answer: " + answer));
```

**Output**

```text
answer: yes
```

**Rule:** A promise settles once. The first call to `resolve` or `reject` wins, and every later call is ignored.

If the executor throws, the promise is rejected with the error. The `throw` does not escape `new Promise`.

**Common mistake:** a path that never settles.

**Wrong**

```js
const seats = 0;

const booking = new Promise((resolve) => {
  setTimeout(() => {
    if (seats > 0) {
      resolve("booked");
    }
  }, 10);
});

console.log("booking...");
booking.then((result) => console.log(result));
```

**Output**

```text
booking...
```

**Fix**

```js
const seats = 0;

const booking = new Promise((resolve) => {
  setTimeout(() => {
    if (seats > 0) {
      resolve("booked");
    } «else {
      resolve("sold out");
    }»
  }, 10);
});

console.log("booking...");
booking.then((result) => console.log(result));
```

**Output**

```text
booking...
sold out
```

With no seats, nothing called `resolve`. The promise stayed pending forever, so the `then` callback never ran. Make every path call `resolve` or `reject`.

<!-- task -->

## Wrap a timer

**Code**

```js
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log("brewing");
delay(30).then(() => console.log("tea is ready"));
```

**Output**

```text
brewing
tea is ready
```

**Rule:** To turn a timer into a promise, call `resolve` when the timer fires. `setTimeout(resolve, ms)` uses `resolve` itself as the timer's callback.

`delay(ms)` is a common helper. It gives a promise that is fulfilled after `ms` milliseconds, with the value `undefined`.

`setTimeout(resolve, ms, value)` fulfils the promise with `value`.

**Common mistake:** creating the promise but not returning it.

**Wrong**

```js
function delay(ms) {
  «new Promise((resolve) => setTimeout(resolve, ms));»
}

delay(30).then(() => console.log("tea is ready"));
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'delay(30).then')
```

**Fix**

```js
function delay(ms) {
  «return» new Promise((resolve) => setTimeout(resolve, ms));
}

delay(30).then(() => console.log("tea is ready"));
```

`delay` made a promise and dropped it. The call gave `undefined`, which has no `then`. Chrome and Node say `Cannot read properties of undefined (reading 'then')`.

<!-- task -->

## Remember

- A promise starts pending, then settles once: fulfilled with a value, or rejected with a reason.
- The executor runs at once, during `new Promise`. `resolve` does not stop it.
- The first `resolve` or `reject` wins. A `throw` in the executor rejects the promise.
- Every path must settle. Return the promise you make.
