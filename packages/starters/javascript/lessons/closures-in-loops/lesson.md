# Closures in Loops

## One var for all rounds

**Code**

```js
const readers = [];

for (var i = 0; i < 3; i++) {
  readers.push(() => i);
}

console.log(readers[0]());
console.log(readers[1]());
console.log(readers[2]());
```

**Output**

```text
3
3
3
```

**Rule:** A `var` loop has one variable for all its rounds. Every closure holds that same variable, so after the loop they all read its last value.

`readers[0]()` gives `3`, not `2`. The loop stops when `i < 3` is false, so `i` ends at `3`.

<!-- task -->

## let: one per round

**Code**

```js
const readers = [];

for (let i = 0; i < 3; i++) {
  readers.push(() => i);
}

console.log(readers[0]());
console.log(readers[1]());
console.log(readers[2]());
```

**Output**

```text
0
1
2
```

**Rule:** With `let` in the header of a `for` loop, each round gets a new variable of its own. Each closure holds the variable of its round.

`for (const word of words)` makes a new `word` for each round too.

**Common mistake:** declaring the variable before the loop.

**Wrong**

```js
const readers = [];
«let i = 0;»

while (i < 3) {
  readers.push(() => i);
  i++;
}

console.log(readers[0]());
console.log(readers[2]());
```

**Output**

```text
3
3
```

**Fix**

```js
const readers = [];
let i = 0;

while (i < 3) {
  «const round = i;»
  readers.push(() => round);
  i++;
}

console.log(readers[0]());
console.log(readers[2]());
```

**Output**

```text
0
2
```

A variable declared before the loop is one variable, whatever keyword it has. A `const` inside the loop body is made again in each round.

<!-- task -->

## A function per round

**Code**

```js
function makeReader(value) {
  return () => value;
}

const readers = [];

for (var i = 0; i < 3; i++) {
  readers.push(makeReader(i));
}

console.log(readers[0]());
console.log(readers[1]());
console.log(readers[2]());
```

**Output**

```text
0
1
2
```

**Rule:** A function call makes new variables. Passing `i` to a function gives the closure a parameter of its own, with a copy of the value.

`makeReader(i)` runs once in each round, so there are three separate `value` variables. This was the fix before `let` existed.

`list.forEach((item) => ...)` calls its callback once for each item. Each call has its own `item`.

<!-- task -->

## Remember

- `for (var i ...)` has one `i`. All the closures share it, and read its last value.
- `for (let i ...)` makes a new `i` for each round. So does `for (const x of list)`.
- A variable declared before the loop is shared, whatever keyword it has.
- A `const` in the loop body, or a parameter of a function, gives each closure its own copy.
