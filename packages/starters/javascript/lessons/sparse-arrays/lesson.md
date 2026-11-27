# Holes in Arrays

## A hole is no property

**Code**

```js
const gaps = ["red", , "blue"];
const blanks = ["red", undefined, "blue"];

console.log(gaps.length, blanks.length);
console.log(gaps[1], blanks[1]);
console.log(1 in gaps, 1 in blanks);
console.log(Object.keys(gaps).join(","));
```

**Output**

```text
3 3
undefined undefined
false true
0,2
```

**Rule:** A hole is an index below `length` that has no property at all. Reading a hole gives `undefined`, just like reading an item that holds `undefined`. Only `index in array` tells them apart.

An array with holes is called **sparse**. An array with none is **dense**.

`Object.keys(gaps)` lists only the indexes that exist, as strings.

**Common mistake:** finding holes by reading the value.

**Wrong**

```js
const seats = ["Ada", undefined, , "Cy"];
let holes = 0;

for (let i = 0; i < seats.length; i++) {
  if («seats[i] === undefined») holes++;
}

console.log(holes);
```

**Output**

```text
2
```

**Fix**

```js
const seats = ["Ada", undefined, , "Cy"];
let holes = 0;

for (let i = 0; i < seats.length; i++) {
  if («!(i in seats)») holes++;
}

console.log(holes);
```

Index `1` holds `undefined`, so it is not a hole. Only index `2` is. `i in seats` asks whether the index exists, and ignores the value.

<!-- task -->

## How holes are made

**Code**

```js
const slots = new Array(3);
console.log(slots.length, 0 in slots);

const days = ["Mon", "Tue", "Wed"];
delete days[1];
console.log(days.length, 1 in days);

const queue = ["Ada"];
queue[3] = "Di";
console.log(queue.length, 1 in queue, 2 in queue);
```

**Output**

```text
3 false
3 false
4 false false
```

**Rule:** Four things make holes. `new Array(3)` gives three holes. A literal with an empty spot, such as `[1, , 3]`, has one. `delete` removes an item and leaves a hole. Writing past the end leaves holes for the indexes it skipped.

`delete days[1]` does not change `length`. The items after it do not move.

`list.length = 5` on a shorter list adds holes at the end.

**Common mistake:** counting items with `length` after writing past the end.

**Wrong**

```js
const lockers = [];
lockers[2] = "Ada";
lockers[9] = "Bo";

console.log(«lockers.length»);
```

**Output**

```text
10
```

**Fix**

```js
const lockers = [];
lockers[2] = "Ada";
lockers[9] = "Bo";

console.log(«Object.keys(lockers).length»);
```

`length` is the highest index plus one, so it counted eight holes. `Object.keys` lists only the indexes that hold an item.

<!-- task -->

## Who skips holes

**Code**

```js
const marks = [7, , 9];

let calls = 0;
marks.forEach(() => calls++);
console.log(calls);

const doubled = marks.map((mark) => mark * 2);
console.log(doubled.length, 1 in doubled);

let visits = 0;
for (const mark of marks) visits++;
console.log(visits);

console.log(1 in [...marks]);
console.log(JSON.stringify(marks));
```

**Output**

```text
2
3 false
3
true
[7,null,9]
```

**Rule:** `forEach` skips holes: its callback never runs for them. `map` skips them too, and keeps the hole in the new array. `for...of` and spread visit every index, and give `undefined` for a hole.

`[...marks]` is dense. Spread turns each hole into a real `undefined`.

`JSON.stringify` writes a hole as `null`, and `join` writes it as an empty string.

**Common mistake:** counting holes with `forEach`.

**Wrong**

```js
const answers = ["yes", , "no", , "no"];
let skipped = 0;

«answers.forEach((answer) => {»
  if (answer === undefined) skipped++;
«});»

console.log(skipped);
```

**Output**

```text
0
```

**Fix**

```js
const answers = ["yes", , "no", , "no"];
let skipped = 0;

«for (const answer of answers) {»
  if (answer === undefined) skipped++;
«}»

console.log(skipped);
```

`forEach` never called its callback for the two holes, so nothing was counted. `for...of` visits them and gives `undefined`.

<!-- task -->

## Remember

- A hole is a missing index. It reads as `undefined`, but `index in array` gives `false`.
- `new Array(n)`, `[1, , 3]`, `delete` and writing past the end all make holes.
- `forEach` and `map` skip holes. `map` keeps them in its result.
- `for...of` and spread give `undefined` for each hole.
