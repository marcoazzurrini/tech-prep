# parseInt and parseFloat

## Read from the start

**Code**

```js
const width = "120px";

console.log(parseInt(width));
console.log(Number(width));
console.log(parseFloat("1.5rem"));
console.log(parseInt("1.5rem"));
console.log(parseInt("px120"));
```

**Output**

```text
120
NaN
1.5
1
NaN
```

**Rule:** `parseInt` reads a whole number from the start of a string, and `parseFloat` reads one that may have a fraction. Both stop at the first character that does not fit, and give `NaN` when they read nothing.

`parseInt(" 42 ")` gives `42`: spaces at the start are skipped. `parseInt("")` gives `NaN`, where `Number("")` gives `0`.

`parseInt("1e3")` gives `1`, and `parseFloat("1e3")` gives `1000`. Only `parseFloat` reads an exponent.

**Common mistake:** checking an input with `parseInt`.

**Wrong**

```js
const input = "12abc";
const quantity = parseInt(input);

if (Number.isNaN(quantity)) {
  console.log("not a number");
} else {
  console.log(`quantity: ${quantity}`);
}
```

**Output**

```text
quantity: 12
```

**Fix**

```js
const input = "12abc";
const quantity = «Number(input)»;

if (Number.isNaN(quantity)) {
  console.log("not a number");
} else {
  console.log(`quantity: ${quantity}`);
}
```

`parseInt` read `12` and ignored the rest. `Number` needs the whole string to be a number.

<!-- task -->

## The radix

**Code**

```js
console.log(parseInt("ff", 16));
console.log(parseInt("101", 2));
console.log(parseInt("0x1f"));
console.log(parseInt("08"));
```

**Output**

```text
255
5
31
8
```

```steps
parseInt("19", 8) => 1
parseInt("7", «0») => 7
parseInt("8", «1») => NaN
parseInt("9", «2») => NaN
```

**Rule:** The second argument of `parseInt` is the **radix**: the base of the number system, from 2 to 36. With no radix the base is 10, unless the text starts with `0x`, which means base 16.

`parseInt("08")` gives `8`. A leading `0` does not change the base.

`parseInt("19", 8)` gives `1`. The digit `9` does not fit base 8, so the reading stops there.

**Common mistake:** passing `parseInt` straight to `map`.

**Wrong**

```js
const ids = ["7", "8", "9"];

console.log(ids.map(parseInt));
```

**Output**

```text
[ 7, NaN, NaN ]
```

**Fix**

```js
const ids = ["7", "8", "9"];

console.log(ids.map(«(id) => parseInt(id, 10)»));
```

`map` calls its function with the item and its index, so the index became the radix. Radix `0` counts as no radix, radix `1` is not valid, and `9` does not fit base 2.

<!-- task -->

## Numbers become text first

**Code**

```js
console.log(parseInt(15.99));
console.log(parseInt(0.0000005));
console.log(String(0.0000005));
console.log(Math.trunc(0.0000005));
```

**Output**

```text
15
5
5e-7
0
```

```steps
String(0.0000005) => "5e-7"
parseInt(«"5e-7"») => 5
```

**Rule:** `parseInt` converts its argument to a string, then reads that string. A very small or very large number becomes text in the `e` form, so `parseInt` reads only its first digits.

`Math.trunc(15.99)` gives `15`. Use it to drop the fraction of a number.

`parseInt(null)` gives `NaN`. The text `"null"` does not start with a digit.

<!-- task -->

## Remember

- `parseInt` and `parseFloat` read from the start and stop at the first character that does not fit. `Number` needs the whole string.
- When nothing can be read, the result is `NaN`. So `parseInt("")` is `NaN`.
- The second argument of `parseInt` is the radix. `map(parseInt)` passes the index as the radix.
- `parseInt` converts its argument to a string first. Use `Math.trunc` on a number.
