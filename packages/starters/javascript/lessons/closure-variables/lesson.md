# Closures Hold Variables, Not Values

## The latest value

**Code**

```js
let discount = 10;

const priceAfter = (price) => price - discount;

console.log(priceAfter(100));

discount = 30;

console.log(priceAfter(100));
```

**Output**

```text
90
70
```

**Rule:** A closure holds the variable itself, not a copy of its value. It reads the variable each time it runs, so it sees the latest value.

**Common mistake:** expecting the value from the moment the function was created.

**Wrong**

```js
let name = "Ada";

const greet = () => `Hi, ${name}`;

name = "Lin";

console.log(greet());
```

**Output**

```text
Hi, Lin
```

**Fix**

```js
let name = "Ada";
«const saved = name;»

const greet = () => `Hi, ${saved}`;

name = "Lin";

console.log(greet());
```

**Output**

```text
Hi, Ada
```

`greet` reads `name` when it runs, and by then `name` is `"Lin"`. To keep a value, copy it into a variable that never changes.

<!-- task -->

## Two closures, one variable

**Code**

```js
function makeScore() {
  let points = 0;

  const add = (n) => {
    points += n;
  };
  const read = () => points;

  return { add, read };
}

const score = makeScore();

score.add(5);
score.add(2);

console.log(score.read());
```

**Output**

```text
7
```

**Rule:** Closures created in the same scope share its variables. When one of them changes a variable, the others see the new value.

**Common mistake:** returning the value, not a function that reads it.

**Wrong**

```js
function makeScore() {
  let points = 0;

  const add = (n) => {
    points += n;
  };

  return { add, «points» };
}

const score = makeScore();

score.add(5);

console.log(score.points);
```

**Output**

```text
0
```

**Fix**

```js
function makeScore() {
  let points = 0;

  const add = (n) => {
    points += n;
  };

  return { add, «read: () => points» };
}

const score = makeScore();

score.add(5);

console.log(score.read());
```

**Output**

```text
5
```

`{ points }` copies the value `0` into a property, once. The property is not the variable. A function reads the variable each time it is called.

<!-- task -->

## A new call, new variables

**Code**

```js
function makeCounter() {
  let count = 0;

  return () => {
    count += 1;
    return count;
  };
}

const laps = makeCounter();
const goals = makeCounter();

console.log(laps());
console.log(laps());
console.log(goals());
```

**Output**

```text
1
2
1
```

**Rule:** Each call of a function makes new variables. Closures from two different calls share nothing.

**Common mistake:** declaring the variable outside the function that makes the closures.

**Wrong**

```js
«let count = 0;»

function makeCounter() {
  return () => {
    count += 1;
    return count;
  };
}

const laps = makeCounter();
const goals = makeCounter();

console.log(laps());
console.log(goals());
```

**Output**

```text
1
2
```

**Fix**

```js
function makeCounter() {
  «let count = 0;»

  return () => {
    count += 1;
    return count;
  };
}

const laps = makeCounter();
const goals = makeCounter();

console.log(laps());
console.log(goals());
```

**Output**

```text
1
1
```

There was only one `count`, so both closures found the same one. Declared inside `makeCounter`, it is made again at each call.

<!-- task -->

## Remember

- A closure holds the variable, not a copy of its value. It reads the latest value.
- To keep a value, copy it into a variable that never changes.
- Closures from the same call share their variables.
- Each call makes new variables. Closures from two calls share nothing.
