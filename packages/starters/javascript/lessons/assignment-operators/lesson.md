# Assignment Is an Expression

## Assignment has a value

**Code**

```js
let seats;

console.log(seats = 40);
console.log((seats = 12) + 1);
console.log(seats);

const queue = ["wash", "dry"];
let job;

while ((job = queue.shift()) !== undefined) {
  console.log(job);
}
```

**Output**

```text
40
13
12
wash
dry
```

**Rule:** An assignment is an expression. It stores the value, and it also gives that value back. So an assignment can sit inside a larger expression.

`(job = queue.shift()) !== undefined` stores the next job, then compares it. Without the parentheses, `job` would get the result of the comparison.

**Common mistake:** writing `=` where `===` was meant.

**Wrong**

```js
const order = { status: "pending" };

if (order.status = "paid") {
  console.log("send the parcel");
}

console.log(order.status);
```

**Output**

```text
send the parcel
paid
```

**Fix**

```js
const order = { status: "pending" };

if (order.status «===» "paid") {
  console.log("send the parcel");
}

console.log(order.status);
```

The condition assigned `"paid"`, then tested that value. A string with text in it is truthy, so the branch ran. The order was changed too.

<!-- task -->

## Chains run from the right

**Code**

```js
let low;
let high;

low = high = 5;
high += 1;
console.log(low, high);

let drafts;
let sent;

drafts = sent = [];
sent.push("hello");
console.log(drafts.length);
```

**Output**

```text
5 6
1
```

**Rule:** `a = b = c` runs from the right. It assigns `c` to `b`, then gives that value to `a`. Both names get the same value. For an array or an object, that is the same one, not a copy.

**Common mistake:** declaring two variables with one chain.

**Wrong**

```js
let width = height = 100;

console.log(width, height);
```

**Error**

```text
ReferenceError: height is not defined
```

**Fix**

```js
«let width = 100;
let height = 100;»

console.log(width, height);
```

`let` declares only `width`. `height = 100` is a plain assignment to a name that was never declared, so it throws. In an old script that is not a module, it silently makes a global variable instead.

<!-- task -->

## Compound assignment

**Code**

```js
let stock = 10;

stock -= 3;
stock *= 2;
console.log(stock);
console.log(stock %= 4);

let label = "left: ";

label += stock;
console.log(label);
```

**Output**

```text
14
2
left: 2
```

**Rule:** `x += y` means `x = x + y`. The other maths operators have the same short form: `-=`, `*=`, `/=`, `%=` and `**=`. Each one is an assignment, so it gives back the new value.

`x *= 2 + 3` multiplies `x` by `5`. The whole right side is worked out first.

**Common mistake:** using `+=` on a value that is not there yet.

**Wrong**

```js
const votes = {};

for (const name of ["tea", "cake", "tea"]) {
  votes[name] += 1;
}

console.log(votes.tea);
```

**Output**

```text
NaN
```

**Fix**

```js
const votes = {};

for (const name of ["tea", "cake", "tea"]) {
  votes[name] = «(votes[name] ?? 0)» + 1;
}

console.log(votes.tea);
```

`votes.tea` started as `undefined`, and `undefined + 1` is `NaN`. Give the missing value a start of `0`.

<!-- task -->

## ||=, &&= and ??=

**Code**

```js
function nextId() {
  console.log("making an id");
  return 7;
}

const draft = { id: null, title: "", likes: 0 };

draft.id ??= nextId();
draft.id ??= nextId();
draft.title ||= "Untitled";
draft.likes &&= draft.likes + 1;

console.log(JSON.stringify(draft));
```

**Output**

```text
making an id
{"id":7,"title":"Untitled","likes":0}
```

**Rule:** `a ??= b` assigns `b` only when `a` is `null` or `undefined`. `a ||= b` assigns only when `a` is falsy. `a &&= b` assigns only when `a` is truthy. When they do not assign, `b` never runs.

**Common mistake:** using `||=` for a default when `0` is a real value.

**Wrong**

```js
const player = { volume: 0 };

player.volume ||= 50;
console.log(player.volume);
```

**Output**

```text
50
```

**Fix**

```js
const player = { volume: 0 };

player.volume «??=» 50;
console.log(player.volume);
```

`0` is falsy, so `||=` replaced it. `??=` replaces only `null` and `undefined`.

<!-- task -->

## Remember

- An assignment gives back the value it assigned.
- `a = b = c` runs from the right, and both names get the same value.
- `x += y` means `x = x + y`. A missing `x` gives `NaN`.
- `??=`, `||=` and `&&=` assign only when needed. Otherwise the right side never runs.
