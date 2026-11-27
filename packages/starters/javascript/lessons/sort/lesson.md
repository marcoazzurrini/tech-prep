# Sorting

## Default sort uses strings

**Code**

```js
const prices = [10, 2, 100, 25];
const result = prices.sort();

console.log(prices.join(", "));
console.log(result === prices);
```

**Output**

```text
10, 100, 2, 25
true
```

**Rule:** With no argument, `sort` turns each item into a string and compares the strings by character code. It changes the array in place and returns the same array.

`"100"` comes before `"2"` because `"1"` has a smaller character code than `"2"`.

`toSorted` works like `sort`, but returns a new array and leaves the original untouched.

**Common mistake:** sorting numbers with no compare function.

**Wrong**

```js
const ages = [30, 5, 12, 100];
console.log(ages.sort().join(", "));
```

**Output**

```text
100, 12, 30, 5
```

**Fix**

```js
const ages = [30, 5, 12, 100];
console.log(ages.sort(«(a, b) => a - b»).join(", "));
```

Without a compare function, `ages` was sorted as text. Passing `(a, b) => a - b` sorts numbers from smallest to largest.

<!-- task -->

## Writing a compare function

**Code**

```js
const tasks = [
  { name: "mail", rank: 2 },
  { name: "pay", rank: 1 },
  { name: "call", rank: 2 },
];

const ordered = tasks.toSorted((a, b) => a.rank - b.rank);
console.log(ordered.map((t) => t.name).join(", "));
console.log(tasks.map((t) => t.name).join(", "));
```

**Output**

```text
pay, mail, call
mail, pay, call
```

**Rule:** A compare function takes `(a, b)` and returns a number. A negative number puts `a` first, a positive number puts `b` first, and `0` keeps their original order.

`mail` stayed before `call` because both had rank `2`. JavaScript's `sort` is stable, so ties keep their starting order.

Return a number, not a boolean. `a > b` gives `true` or `false`, never a negative number, so engines can disagree on the order.

**Common mistake:** mutating an array when you meant to keep the original.

**Wrong**

```js
const scores = [30, 10, 20];
const highest = scores.sort((a, b) => b - a);

console.log(highest.join(", "));
console.log(scores.join(", "));
```

**Output**

```text
30, 20, 10
30, 20, 10
```

**Fix**

```js
const scores = [30, 10, 20];
const highest = scores.«toSorted»((a, b) => b - a);

console.log(highest.join(", "));
console.log(scores.join(", "));
```

`sort` changed `scores` in place, so both variables saw the new order. Use `toSorted` when callers still need the original array.

<!-- task -->

## Ties and undefined

**Code**

```js
const values = [3, undefined, 1, undefined, 2];
let sawUndefined = false;

const sorted = values.toSorted((a, b) => {
  if (a === undefined || b === undefined) sawUndefined = true;
  return b - a;
});

console.log(sorted.map(String).join(", "));
console.log(sawUndefined);
```

**Output**

```text
3, 2, 1, undefined, undefined
false
```

**Rule:** `undefined` items always move to the end, and the compare function is never called for them. Holes move to the very end, after `undefined`.

`(a, b) => a.group - b.group || a.id - b.id` breaks ties by `id`, because `0` is falsy so `||` moves to the second test.

**Common mistake:** subtracting strings in a compare function.

**Wrong**

```js
const words = ["pear", "apple", "fig"];
const sorted = words.toSorted((a, b) => a - b);

console.log(sorted.join(", "));
```

**Output**

```text
pear, apple, fig
```

**Fix**

```js
const words = ["pear", "apple", "fig"];
const sorted = words.toSorted((a, b) => «a < b ? -1 : a > b ? 1 : 0»);

console.log(sorted.join(", "));
```

Subtracting two strings gives `NaN`, which `sort` treats as `0`, so nothing moves. Compare strings with `<` and `>`.

<!-- task -->

## Remember

- `sort()` compares items as strings and mutates the array. Use `toSorted()` to get a new array.
- Pass `(a, b) => a - b` for ascending numbers and `(a, b) => b - a` for descending numbers.
- Returning `< 0` puts `a` first, `> 0` puts `b` first, and `0` keeps the original order.
- `undefined` items always go to the end without calling the compare function.
