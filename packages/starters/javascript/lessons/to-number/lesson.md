# Converting to a Number

## Number() reads text

**Code**

```js
const inputs = ["42", " 3.5 ", "12px", "1e3", ""];

for (const input of inputs) {
  console.log(Number(input));
}
```

**Output**

```text
42
3.5
NaN
1000
0
```

```steps
Number(" 3.5 ") => 3.5
Number(«"12px"») => NaN
Number(«""») => 0
Number("   ") => 0
```

**Rule:** `Number(text)` ignores spaces and line breaks at both ends, and needs the rest to be one whole number. Text that fails gives `NaN`, and empty text gives `0`.

`Number("0x1f")` gives `31`. The prefixes `0x`, `0b` and `0o` work as they do in code.

`Number("1,5")` and `Number("1_000")` give `NaN`. A comma or an underscore is not part of a number.

**Common mistake:** trusting `NaN` to catch a blank input.

**Wrong**

```js
const input = "";
const age = Number(input);

if (Number.isNaN(age)) {
  console.log("please type your age");
} else {
  console.log(`age: ${age}`);
}
```

**Output**

```text
age: 0
```

**Fix**

```js
const input = "";
const age = Number(input);

if («input.trim() === "" ||» Number.isNaN(age)) {
  console.log("please type your age");
} else {
  console.log(`age: ${age}`);
}
```

Blank text converts to `0`, not to `NaN`, so the test let it through. Check for blank text first.

<!-- task -->

## null, undefined, booleans

**Code**

```js
console.log(Number(null));
console.log(Number(undefined));
console.log(Number(true));
console.log(Number(false));
```

**Output**

```text
0
NaN
1
0
```

**Rule:** `null` converts to `0`, but `undefined` converts to `NaN`. `true` converts to `1`, and `false` converts to `0`.

`Number([])` gives `0`, `Number([7])` gives `7` and `Number({})` gives `NaN`. An array or a plain object becomes a string first, and then that string is read.

<!-- task -->

## Unary plus

**Code**

```js
const price = "19.99";
const qty = "3";

console.log(+price);
console.log(typeof +qty);
console.log(+"");
console.log(+"three");
console.log(-qty);
```

**Output**

```text
19.99
number
0
NaN
-3
```

```steps
+"42" => 42
+true => 1
+null => 0
+undefined => NaN
```

**Rule:** A `+` in front of one value is the **unary plus**. It converts the value to a number, by the same rules as `Number`. A `-` in front converts too, and then flips the sign.

`+10n` throws a `TypeError`. `Number(10n)` gives `10`.

<!-- task -->

## Remember

- `Number(text)` ignores outer spaces, then needs the whole text to be a number. Otherwise it gives `NaN`.
- `""` and `null` give `0`. `undefined` gives `NaN`.
- `true` gives `1`, and `false` gives `0`.
- `+value` converts as `Number(value)` does.
