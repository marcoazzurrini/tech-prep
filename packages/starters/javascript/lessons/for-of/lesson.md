# for...of

## Values, one by one

**Code**

```js
const cart = ["tea", "milk"];

for (const item of cart) {
  console.log(item);
}

for (const letter of "ok") {
  console.log(letter);
}
```

**Output**

```text
tea
milk
o
k
```

**Rule:** `for (const x of list)` visits the values of an iterable, in order. An iterable is a value that can be walked item by item, such as an array or a string.

`for (const letter of "ok")` walks the string character by character.

`for (const key in cart)` gives the keys `"0"` and `"1"`, as strings. `for...in` is made for objects, not for lists.

<!-- task -->

## The index, with entries()

**Code**

```js
const queue = ["Ada", "Lin", "Sam"];

for (const [index, name] of queue.entries()) {
  console.log(index, name);
}
```

**Output**

```text
0 Ada
1 Lin
2 Sam
```

**Rule:** `list.entries()` gives one `[index, value]` pair for each item. Destructuring in the loop header splits the pair into two variables.

**Common mistake:** assigning to the loop variable to change the array.

**Wrong**

```js
const prices = [10, 20];

for (let price of prices) {
  «price = price * 2»;
}

console.log(prices.join(" "));
```

**Output**

```text
10 20
```

**Fix**

```js
const prices = [10, 20];

for (const [index, price] of prices.entries()) {
  «prices[index] = price * 2»;
}

console.log(prices.join(" "));
```

**Output**

```text
20 40
```

The loop variable holds a copy of the number, so assigning to it changes only the copy. Write to `prices[index]` to change the array.

<!-- task -->

## break, continue and return

**Code**

```js
const words = ["an", "apple", "is", "ripe", "STOP", "now"];
const kept = [];

for (const word of words) {
  if (word.length < 3) continue;
  if (word === "STOP") break;
  kept.push(word);
}

console.log(kept.join(" "));
```

**Output**

```text
apple ripe
```

**Rule:** In `for...of`, `break` and `continue` work as in any loop, and `return` leaves the function around the loop. `forEach` can do none of these.

`break` inside a `forEach` callback is a `SyntaxError`. The callback is a function, not a loop body.

**Common mistake:** a `return` inside a `forEach` callback.

**Wrong**

```js
function firstNegative(readings) {
  readings.forEach((reading) => {
    if (reading < 0) «return reading»;
  });

  return null;
}

console.log(firstNegative([4, -2, 7, -9]));
```

**Output**

```text
null
```

**Fix**

```js
function firstNegative(readings) {
  «for (const reading of readings)» {
    if (reading < 0) return reading;
  }

  return null;
}

console.log(firstNegative([4, -2, 7, -9]));
```

**Output**

```text
-2
```

The `return` left the callback, not `firstNegative`. `forEach` ignores what its callback returns, and goes on to the next item.

<!-- task -->

## Remember

- `for...of` gives the values of an array, the characters of a string, and the items of any other iterable.
- `for (const [index, value] of list.entries())` gives the index too.
- Assigning to the loop variable does not change the array.
- `for...of` can `break`, `continue` and `return`. A `return` in a `forEach` callback only ends that one call.
