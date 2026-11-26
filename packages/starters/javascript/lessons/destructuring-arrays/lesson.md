# Destructuring Arrays

## Items by position

**Code**

```js
const scores = [91, 78, 64];
const [first, second] = scores;
const [, , third, fourth] = scores;

console.log(first);
console.log(second);
console.log(third);
console.log(fourth);
```

**Output**

```text
91
78
64
undefined
```

**Rule:** `const [a, b] = list` is destructuring: it gives each variable the item at the same position. An empty place between two commas skips an item. A position past the end gives `undefined`.

`const [first] = scores` leaves `scores` as it was. Destructuring only reads.

`const [a, b] = [1, 2, 3]` is fine. Items that no variable asks for are ignored.

<!-- task -->

## Defaults and rest

**Code**

```js
const box = [20, undefined, null];
const [width = 100, height = 50, depth = 10] = box;
const [winner, ...others] = ["Ada", "Ben", "Cy"];

console.log(width);
console.log(height);
console.log(depth);
console.log(winner);
console.log(others);
```

**Output**

```text
20
50
null
Ada
[ "Ben", "Cy" ]
```

**Rule:** A default, written after `=`, is used only when the item is `undefined`. `null` is a value, so it stays. `...others` collects all the remaining items in a new array.

`const [a, ...rest] = [1]` gives `[]` for `rest`. It is always an array, never `undefined`.

`const [...rest, last] = list` is a `SyntaxError`. The `...rest` must come last.

**Common mistake:** expecting a default to replace `null`.

**Wrong**

```js
const row = ["Ada", null];
const [name, team = "none"] = row;

console.log(name, team.toUpperCase());
```

**Error**

```text
TypeError: null is not an object (evaluating 'team.toUpperCase')
```

**Fix**

```js
const row = ["Ada", null];
const [name, team] = row;

console.log(name, («team ?? "none"»).toUpperCase());
```

The item was `null`, not `undefined`, so the default was skipped. `??` replaces both `null` and `undefined`.

<!-- task -->

## Swap and nest

**Code**

```js
let cup = "tea";
let jug = "milk";
[cup, jug] = [jug, cup];

const line = [[0, 5], [8, 3]];
const [[x1, y1], [x2, y2]] = line;

console.log(cup);
console.log(jug);
console.log(x2 - x1);
console.log(y2 - y1);
```

**Output**

```text
milk
tea
8
-2
```

**Rule:** With no `const` or `let`, a pattern assigns to variables that already exist. The right side is built first, so `[a, b] = [b, a]` swaps two variables. A pattern inside a pattern takes items from a nested array.

`[list[0], list[1]] = [list[1], list[0]]` swaps two items of an array. A target can be anything you can assign to.

`const [[x], [y] = [0]] = [[1]]` gives `0` for `y`. A default can stand in for a missing nested array.

<!-- task -->

## Any iterable

**Code**

```js
const [initial, ...letters] = "Ada";
const [smallest, largest] = new Set([3, 8]);

console.log(initial);
console.log(letters);
console.log(smallest);
console.log(largest);
```

**Output**

```text
A
[ "d", "a" ]
3
8
```

**Rule:** The right side can be any iterable: a value that `for...of` can loop over, such as an array, a string or a `Set`. Anything else throws a `TypeError`, and that includes `null`, `undefined`, a number and a plain object.

**Common mistake:** destructuring a list that may be missing.

**Wrong**

```js
const report = { title: "Spring" };
const [best] = report.scores;

console.log(best);
```

**Error**

```text
TypeError: undefined is not an object (evaluating '[best]')
```

**Fix**

```js
const report = { title: "Spring" };
const [best] = report.scores «?? []»;

console.log(best);
```

`report.scores` is `undefined`, and `undefined` is not iterable. An empty array is, so `best` is just `undefined`. Chrome and Node word the error as `report.scores is not iterable`.

<!-- task -->

## Remember

- `const [a, , c] = list` takes items by position. The empty place skips one.
- A default applies only to `undefined`, not to `null`. `...rest` must be last and is always an array.
- `[a, b] = [b, a]` swaps. Patterns nest: `const [[x, y]] = points`.
- Any iterable works, such as a string. `null` and `undefined` throw a `TypeError`.
