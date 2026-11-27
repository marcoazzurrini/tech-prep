# Set

## Each value once

**Code**

```js
const scores = [7, 3, 7, NaN, 3, NaN, 0, -0];
const unique = new Set(scores);

console.log(unique.size);
console.log([...unique].join(", "));
console.log(unique.has(NaN));
console.log(unique.has("7"));
```

**Output**

```text
4
7, 3, NaN, 0
true
false
```

**Rule:** A `Set` holds each value once. It compares with SameValueZero: as `===` does, except that `NaN` matches `NaN`. `[...new Set(list)]` removes duplicates and keeps the order in which values first appear.

`set.add(value)` returns the set, so calls can be chained. Adding a value the set already holds does nothing.

`set.delete(value)` gives `true` when it removed the value, and `false` otherwise.

**Common mistake:** passing a single string to `new Set`.

**Wrong**

```js
const guests = new Set(«"Ada"»);
guests.add("Bo");

console.log(guests.size);
console.log(guests.has("Ada"));
```

**Output**

```text
4
false
```

**Fix**

```js
const guests = new Set(«["Ada"]»);
guests.add("Bo");

console.log(guests.size);
console.log(guests.has("Ada"));
```

`new Set(x)` takes the values out of `x` one by one. A string gives its characters, so the set held `"A"`, `"d"` and `"a"`. Wrap a single value in an array.

<!-- task -->

## Objects by reference

**Code**

```js
const apple = { id: 1 };
const basket = new Set();

basket.add(apple);
basket.add(apple);
basket.add({ id: 1 });

console.log(basket.size);
console.log(basket.has(apple));
console.log(basket.has({ id: 1 }));
```

**Output**

```text
2
true
false
```

**Rule:** A `Set` compares objects by reference. Two objects are the same only when they are one object. Objects with equal content are all kept.

`new Set([[1], [1]]).size` gives `2`. Arrays are objects, so the same rule applies.

**Common mistake:** removing duplicate objects with `new Set`.

**Wrong**

```js
const orders = [{ id: 7 }, { id: 9 }, { id: 7 }];

const unique = [«...new Set(orders)»];
console.log(unique.length);
```

**Output**

```text
3
```

**Fix**

```js
const orders = [{ id: 7 }, { id: 9 }, { id: 7 }];

const seenIds = new Set();
const unique = orders.filter((order) => {
  if («seenIds.has(order.id)») {
    return false;
  }
  seenIds.add(order.id);
  return true;
});
console.log(unique.length);
```

The three orders are three different objects, so the set kept them all. The fix keeps a set of ids and lets through only the first order with each id.

<!-- task -->

## Order and looping

**Code**

```js
const queue = new Set(["Ada", "Bo"]);
queue.add("Cy");
queue.add("Ada");

for (const name of queue) {
  console.log(name);
}

const names = [...queue];
console.log(names[0], names.length);
```

**Output**

```text
Ada
Bo
Cy
Ada 3
```

**Rule:** A `Set` keeps its values in the order they were first added. Adding a value it already holds does not move it. After a `delete`, adding the value again puts it at the end.

`for...of`, spread and `set.forEach((value) => ...)` visit the values in that order. `Array.from(set)` turns a set into an array too.

`set.entries()` gives `[value, value]` pairs, and `keys()` gives the same values as `values()`. A set works like a map whose keys are its values.

**Common mistake:** reading a set like an array.

**Wrong**

```js
const queue = new Set(["Ada", "Bo"]);

console.log(«queue[0]»);
console.log(«queue.length»);
```

**Output**

```text
undefined
undefined
```

**Fix**

```js
const queue = new Set(["Ada", "Bo"]);

console.log(«[...queue][0]»);
console.log(«queue.size»);
```

A set has no indexes and no `length`. Spread it into an array to read by position, and use `size` to count.

<!-- task -->

## Remember

- A `Set` holds each value once. `NaN` matches `NaN`, and `0` matches `-0`.
- Objects are compared by reference. Equal content does not make two objects the same.
- `new Set(x)` takes the values out of `x`. A string gives its characters.
- A set keeps insertion order, has `size` and no indexes. `[...set]` turns it into an array.
