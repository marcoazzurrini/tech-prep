# The + Operator

## A string joins

**Code**

```js
const quantity = "2";
const next = quantity + 1;

console.log(next);
console.log(typeof next);
console.log(1 + quantity);
console.log(quantity + null);
```

**Output**

```text
21
string
12
2null
```

```steps
"2" + 1 => "21"
1 + "2" => "12"
"2" + null => "2null"
```

**Rule:** When either side of `+` is a string, the other side becomes a string too, and the two are joined.

`"" + 5` gives `"5"`. Adding an empty string is an old way to convert a value to a string.

**Common mistake:** adding to a number that arrived as text.

**Wrong**

```js
const price = "10";
const shipping = 5;

console.log(price + shipping);
```

**Output**

```text
105
```

**Fix**

```js
const price = "10";
const shipping = 5;

console.log(«Number(price)» + shipping);
```

Text that a user typed is a string, even when it looks like a number. Convert it before you add.

<!-- task -->

## No string, so numbers

**Code**

```js
console.log(true + 1);
console.log(null + 1);
console.log(undefined + 1);
console.log(true + true);
```

**Output**

```text
2
1
NaN
2
```

**Rule:** When neither side is a string, `+` converts both sides to numbers and adds them. So `true` counts as `1`, `null` as `0` and `undefined` as `NaN`.

`[1] + 1` gives `"11"`, and `[] + []` gives `""`. An array or a plain object becomes a string first, so `+` joins.

<!-- task -->

## Left to right

**Code**

```js
console.log(1 + 2 + "3");
console.log("1" + 2 + 3);
```

**Output**

```text
33
123
```

```steps
1 + 2 + "3" => «3» + "3"
3 + "3" => "33"
"1" + 2 + 3 => «"12"» + 3
"12" + 3 => "123"
```

**Rule:** A chain of `+` runs from left to right, one pair at a time. Numbers are added until the first string appears. After that, every step joins.

**Common mistake:** putting a sum inside a message.

**Wrong**

```js
const adults = 2;
const children = 3;

console.log("Guests: " + adults + children);
```

**Output**

```text
Guests: 23
```

**Fix**

```js
const adults = 2;
const children = 3;

console.log("Guests: " + «(adults + children)»);
```

The string came first, so each number was joined to it in turn. The parentheses make the sum run first.

<!-- task -->

## Other operators use numbers

**Code**

```js
console.log("8" - 3);
console.log("8" * "2");
console.log("8" / "2");
console.log("eight" - 3);
console.log("8" + 3 - 1);
```

**Output**

```text
5
16
4
NaN
82
```

```steps
"8" + 3 - 1 => «"83"» - 1
"83" - 1 => 82
```

**Rule:** Only `+` joins strings. `-`, `*`, `/`, `%` and `**` always convert both sides to numbers.

`+"8" + 3` gives `11`. The unary plus converts the string before the sum runs.

<!-- task -->

## Remember

- `+` joins when either side is a string. Otherwise it converts both sides to numbers and adds them.
- A chain of `+` runs left to right: `1 + 2 + "3"` is `"33"`, and `"1" + 2 + 3` is `"123"`.
- `-`, `*`, `/`, `%` and `**` always use numbers: `"3" - 1` is `2`.
- Convert text before you add: `Number(text) + 1`.
