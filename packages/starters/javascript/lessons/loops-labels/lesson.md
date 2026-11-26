# Loops, break and continue

## while and do...while

**Code**

```js
let stock = 0;

while (stock > 0) {
  console.log("while sells one");
  stock--;
}

do {
  console.log("do...while sells one");
  stock--;
} while (stock > 0);

console.log(stock);
```

**Output**

```text
do...while sells one
-1
```

**Rule:** `while` tests before each round, so its body may never run. `do...while` tests after each round, so its body runs at least once.

A round is one run of the loop body.

`while (stock)` also works. The test can be any value, and the loop stops when the value is falsy.

<!-- task -->

## The for header

**Code**

```js
let i = 0;

for (; i < 3; i++) {
  console.log("round", i);
}

console.log("after", i);

for (;;) {
  i--;
  if (i === 1) break;
}

console.log("end", i);
```

**Output**

```text
round 0
round 1
round 2
after 3
end 1
```

**Rule:** `for (start; test; update)` runs `start` once, `test` before each round and `update` after each round. Each of the three is optional, but both semicolons must stay.

`for (;;)` has no test, so it never stops by itself. It needs a `break`.

After the first loop, `i` is `3`. That is the first value that failed the test.

<!-- task -->

## break and continue

**Code**

```js
const temps = [21, -40, 19, 999, 23];

for (let i = 0; i < temps.length; i++) {
  if (temps[i] < 0) continue;
  if (temps[i] > 100) break;
  console.log(i, temps[i]);
}
```

**Output**

```text
0 21
2 19
```

**Rule:** `break` leaves the loop. `continue` skips the rest of this round and goes to the next one. In a `for` loop, the update still runs after `continue`.

In a `while` loop, `continue` jumps straight to the test. An `i++` at the end of the body is skipped, and the loop can run forever.

In a `switch` inside a loop, `break` leaves the `switch`, not the loop. `continue` still goes to the next round of the loop.

<!-- task -->

## Labels

**Code**

```js
const shelves = [
  ["tea", "rice"],
  ["salt", "key", "oil"],
  ["soap"],
];

search: for (let row = 0; row < shelves.length; row++) {
  for (let slot = 0; slot < shelves[row].length; slot++) {
    console.log("look at", shelves[row][slot]);
    if (shelves[row][slot] === "key") break search;
  }
}

console.log("done");
```

**Output**

```text
look at tea
look at rice
look at salt
look at key
done
```

**Rule:** A label is a name with a colon, written before a loop. `break search` leaves the loop named `search`, and every loop inside it.

`continue search` goes to the next round of the loop named `search`. Here that is the next shelf.

**Common mistake:** a plain `break` in the inner loop.

**Wrong**

```js
const boxes = [[5, 0], [7, 8]];
let opened = 0;

for (let b = 0; b < boxes.length; b++) {
  for (let i = 0; i < boxes[b].length; i++) {
    opened++;
    if (boxes[b][i] === 5) «break»;
  }
}

console.log(opened);
```

**Output**

```text
3
```

**Fix**

```js
const boxes = [[5, 0], [7, 8]];
let opened = 0;

all: for (let b = 0; b < boxes.length; b++) {
  for (let i = 0; i < boxes[b].length; i++) {
    opened++;
    if (boxes[b][i] === 5) «break all»;
  }
}

console.log(opened);
```

**Output**

```text
1
```

A plain `break` leaves the nearest loop only, so the outer loop went on to the second box. `break all` leaves both loops.

<!-- task -->

## Remember

- `while` tests first. `do...while` runs its body once, then tests.
- `for (start; test; update)`: every part is optional, and `for (;;)` runs until a `break`.
- `break` leaves the nearest loop. `continue` goes to its next round, and a `for` loop still runs its update.
- A label names a loop. `break name` and `continue name` act on that loop.
