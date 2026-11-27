# Methods That Return a New Array

## slice and concat

**Code**

```js
const week = ["Mon", "Tue", "Wed", "Thu", "Fri"];

console.log(week.slice(1, 3).join(","));
console.log(week.slice(-2).join(","));
console.log(week.slice(3, 1).length);

const longer = week.concat(["Sat"], "Sun");
console.log(longer.length);
console.log(week.length);
```

**Output**

```text
Tue,Wed
Thu,Fri
0
7
5
```

```steps
[1, 2, 3, 4].slice(1, «3»).join() => "2,3"
[1, 2, 3, 4].slice(«-1»).join() => "4"
[1, 2].concat([3], 4).length => 4
```

**Rule:** `slice(start, end)` returns a new array with the items from `start` up to, but not including, `end`. A negative index counts from the end. `concat` returns a new array with its arguments added at the end. Neither changes the original.

`concat` unpacks an array argument by one level only. `[1].concat([[2]])` gives `[1, [2]]`.

`slice()` with no arguments copies the whole array.

**Common mistake:** treating the second argument of `slice` as a count.

**Wrong**

```js
const results = ["r1", "r2", "r3", "r4", "r5", "r6"];
const page = results.slice(«2, 2»);

console.log(page.length);
```

**Output**

```text
0
```

**Fix**

```js
const results = ["r1", "r2", "r3", "r4", "r5", "r6"];
const page = results.slice(«2, 4»);

console.log(page.length);
```

The second argument of `slice` is an end index, not a count. `slice(2, 2)` starts and ends at the same place, so it takes nothing.

<!-- task -->

## Copying versions

**Code**

```js
const lineup = ["Ada", "Bo", "Cy"];

const reversed = lineup.toReversed();
const replaced = lineup.with(0, "Zoe");
const spliced = lineup.toSpliced(1, 1, "Max", "Kim");

console.log(reversed.join(","));
console.log(replaced.join(","));
console.log(spliced.join(","));
console.log(lineup.join(","));
```

**Output**

```text
Cy,Bo,Ada
Zoe,Bo,Cy
Ada,Max,Kim,Cy
Ada,Bo,Cy
```

**Rule:** Three methods are copying versions of mutating ones. `toReversed()` works like `reverse()`, and `toSpliced()` like `splice()`. `with(index, value)` works like `list[index] = value`. Each returns a new array and leaves the original as it was.

The new array holds the same items. An object in it is shared with the original, not copied.

`toSorted` is the copying version of `sort`. It has its own lesson, with `sort`.

**Common mistake:** expecting `toSpliced` to return the removed items.

**Wrong**

```js
const cart = ["pen", "ink", "cap"];
const removed = cart.«toSpliced(1, 1)»;

console.log(removed.join(","));
```

**Output**

```text
pen,cap
```

**Fix**

```js
const cart = ["pen", "ink", "cap"];
const removed = cart.«slice(1, 2)»;

console.log(removed.join(","));
```

`splice` returns what it removed, but `toSpliced` returns the whole new array. To read the items at some indexes, take them with `slice`.

<!-- task -->

## with checks the index

**Code**

```js
const scores = [10, 20, 30];

console.log(scores.with(-1, 99).join(","));

try {
  scores.with(5, 99);
} catch (error) {
  console.log(error.name);
}

const grown = [...scores];
grown[5] = 99;
console.log(grown.length);
```

**Output**

```text
10,20,99
RangeError
6
```

**Rule:** `with` accepts an index from `-length` up to `length - 1`. A negative index counts from the end, as in `at`. Any other index throws a `RangeError`. So `with` never makes an array longer, while `list[5] = x` does.

`[1, , 3].toReversed()` gives `[3, undefined, 1]`. `toReversed`, `toSpliced` and `with` turn each hole into `undefined`. `slice` and `concat` keep holes.

**Common mistake:** using `with` to add an item at the end.

**Wrong**

```js
const tags = ["new", "sale"];
const next = tags.«with(tags.length, "hot")»;

console.log(next.join(", "));
```

**Error**

```text
RangeError: Array index out of range
```

**Fix**

```js
const tags = ["new", "sale"];
const next = «[...tags, "hot"]»;

console.log(next.join(", "));
```

`tags.length` is one past the last index, so `with` refused it. `with` only replaces. Spread builds a new array with one more item.

<!-- task -->

## Remember

- `slice`, `concat`, `toReversed`, `toSpliced`, `with` and `toSorted` return a new array. The original stays as it was.
- `slice(start, end)` stops before `end`. The second argument is an index, not a count.
- `toSpliced` returns the new array, not the removed items.
- `with(index, value)` replaces one item. An index outside the array throws a `RangeError`.
