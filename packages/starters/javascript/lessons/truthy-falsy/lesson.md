# Truthy and Falsy

## Eight falsy values

**Code**

```js
const stock = 0;
const note = "";

if (stock) {
  console.log("in stock");
} else {
  console.log("sold out");
}

console.log(note ? "has a note" : "no note");
```

**Output**

```text
sold out
no note
```

```steps
Boolean(0) => false
Boolean(-0) => false
Boolean(0n) => false
Boolean("") => false
Boolean(null) => false
Boolean(undefined) => false
Boolean(NaN) => false
```

**Rule:** A condition converts its value to a boolean. Eight values are **falsy**, which means they convert to `false`: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` and `NaN`.

`Boolean(value)` does the same conversion. Every value outside the eight gives `true`.

`if`, `while`, `for` and `? :` all convert their condition this way.

<!-- task -->

## Everything else is truthy

**Code**

```js
console.log(Boolean("0"));
console.log(Boolean(" "));
console.log(Boolean("false"));
console.log(Boolean([]));
console.log(Boolean({}));
console.log(Boolean(-1));
```

**Output**

```text
true
true
true
true
true
true
```

**Rule:** Every value except the eight falsy ones is **truthy**: a condition treats it as `true`. That includes every string with at least one character, and every object and array, even an empty one.

`Boolean("")` gives `false`. The falsy values are `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` and `NaN`.

`Boolean(Infinity)` gives `true`. The only falsy numbers are `0`, `-0` and `NaN`.

**Common mistake:** testing for an empty array with the array itself.

**Wrong**

```js
const results = [];

if (results) {
  console.log("we found something");
} else {
  console.log("nothing found");
}
```

**Output**

```text
we found something
```

**Fix**

```js
const results = [];

if (results«.length > 0») {
  console.log("we found something");
} else {
  console.log("nothing found");
}
```

An empty array is still an object, so it is truthy. Ask for its `length` instead.

<!-- task -->

## The ! operator

**Code**

```js
const title = "Dune";
const pages = 0;

console.log(!title);
console.log(!pages);
console.log(!!title);
console.log(!!pages);
```

**Output**

```text
false
true
true
false
```

**Rule:** `!value` converts the value to a boolean and flips it. `!!value` flips it twice, so it gives the same as `Boolean(value)`.

**Common mistake:** using `!value` to ask "is it missing?".

**Wrong**

```js
function stockLabel(count) {
  if (!count) {
    return "stock unknown";
  }

  return `${count} left`;
}

console.log(stockLabel(0));
```

**Output**

```text
stock unknown
```

**Fix**

```js
function stockLabel(count) {
  if («count === undefined») {
    return "stock unknown";
  }

  return `${count} left`;
}

console.log(stockLabel(0));
```

`0` is a real count, but it is falsy, so `!count` was `true`. Compare with the missing value itself.

<!-- task -->

## Remember

- Falsy: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` and `NaN`.
- Everything else is truthy, including `"0"`, `" "`, `"false"`, `[]` and `{}`.
- `!!value` and `Boolean(value)` give the boolean that a condition sees.
- `0` and `""` are falsy, but they can be real data. Test for `null` or `undefined` by name.
