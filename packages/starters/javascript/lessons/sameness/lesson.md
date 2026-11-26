# Three Kinds of Sameness

## === and Object.is

**Code**

```js
console.log(NaN === NaN);
console.log(Object.is(NaN, NaN));

console.log(0 === -0);
console.log(Object.is(0, -0));

console.log(Object.is("5", 5));
console.log(Object.is("ab", "ab"));
```

**Output**

```text
false
true
true
false
false
true
```

**Rule:** `Object.is(a, b)` compares as `===` does, with two changes. `NaN` is the same as `NaN`, and `0` is not the same as `-0`.

`Object.is("5", 5)` gives `false`. Like `===`, it never converts.

`Object.is({}, {})` gives `false`. Two objects are the same only when they are one object.

**Common mistake:** using `Object.is` as a safer `===`.

**Wrong**

```js
const change = Math.round(-0.2);

if (Object.is(change, 0)) {
  console.log("no change");
} else {
  console.log("changed");
}
```

**Output**

```text
changed
```

**Fix**

```js
const change = Math.round(-0.2);

if (change «=== 0») {
  console.log("no change");
} else {
  console.log("changed");
}
```

`Math.round(-0.2)` gives `-0`, and `Object.is` says that `-0` is not `0`. For the result of maths, `===` is the right test. Keep `Object.is` for when `NaN` must match, or the sign of zero matters.

<!-- task -->

## includes, Set and Map

**Code**

```js
const readings = [3, NaN, 0];

console.log(readings.includes(NaN));
console.log(readings.includes(-0));

const seen = new Set([NaN, NaN, 0, -0]);
console.log(seen.size);

const notes = new Map([[NaN, "sensor broken"]]);
console.log(notes.get(NaN));
```

**Output**

```text
true
true
2
sensor broken
```

**Rule:** `includes`, `Set` and `Map` use a third rule. `NaN` is the same as `NaN`, and `0` is the same as `-0`. The language standard names this rule **SameValueZero**.

`seen.size` gives `2`. A `Set` keeps each value once, so it holds one `NaN` and one zero.

`notes.get(NaN)` finds the entry. A `Map` looks up its keys with the same rule.

**Common mistake:** searching for `NaN` with `indexOf`.

**Wrong**

```js
const temps = [21, NaN, 19];

if (temps.indexOf(NaN) !== -1) {
  console.log("bad reading");
} else {
  console.log("all good");
}
```

**Output**

```text
all good
```

**Fix**

```js
const temps = [21, NaN, 19];

if (temps.«includes(NaN)») {
  console.log("bad reading");
} else {
  console.log("all good");
}
```

`indexOf` compares with `===`, so it never finds `NaN`. `includes` uses the third rule, and finds it.

<!-- task -->

## A rule by hand

**Code**

```js
function sameValueZero(a, b) {
  return a === b || (Number.isNaN(a) && Number.isNaN(b));
}

console.log(sameValueZero(NaN, NaN));
console.log(sameValueZero(0, -0));
console.log(sameValueZero("1", 1));
console.log(sameValueZero(NaN, "NaN"));
```

**Output**

```text
true
true
false
false
```

**Rule:** The three rules agree on every value except `NaN` and the two zeros. To write one by hand, start from `===` and add the case where it differs.

`a === b` already says that `0` and `-0` are the same. So this rule only has to add `NaN`.

`Number.isNaN(a) && Number.isNaN(b)` gives `true` only when both values are `NaN`. That is the one case `===` gets wrong here.

<!-- task -->

## Remember

- `===` says `NaN` differs from `NaN`, and `0` equals `-0`. `indexOf` and `switch` use it.
- `Object.is` says the opposite on both: `NaN` is the same as `NaN`, and `0` differs from `-0`.
- `includes`, `Set` and `Map` say `NaN` is the same as `NaN`, and `0` is the same as `-0`.
- On every other value the three agree, and none of them converts.
