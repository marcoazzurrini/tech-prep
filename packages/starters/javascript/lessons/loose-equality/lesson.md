# == and ===

## === never converts

**Code**

```js
const typed = "42";
const stored = 42;

console.log(typed === stored);
console.log(typed == stored);
console.log(NaN == NaN);
console.log([] == []);
```

**Output**

```text
false
true
false
false
```

**Rule:** `===` never converts, so two values of different types are never equal. `==` converts first when the types differ. When the types are the same, `==` works exactly as `===`.

`NaN == NaN` and `[] == []` give `false`, as they do with `===`. The types match, so nothing is converted.

`a != b` is the opposite of `a == b`, and `a !== b` is the opposite of `a === b`.

**Common mistake:** comparing typed text with a number.

**Wrong**

```js
const answer = "4";

if (answer === 2 + 2) {
  console.log("correct");
} else {
  console.log("wrong");
}
```

**Output**

```text
wrong
```

**Fix**

```js
const answer = "4";

if («Number(answer)» === 2 + 2) {
  console.log("correct");
} else {
  console.log("wrong");
}
```

Text that a user typed is a string, so `===` saw two types. Convert it yourself, and keep `===`.

<!-- task -->

## null and undefined

**Code**

```js
console.log(null == undefined);
console.log(null == 0);
console.log(null == "");
console.log(undefined == false);
console.log(null === undefined);
```

**Output**

```text
true
false
false
false
false
```

**Rule:** With `==`, `null` and `undefined` are equal to each other and to themselves. They are equal to nothing else, because `==` never converts them.

`x == null` is `true` only when `x` is `null` or `undefined`. This is the one good use of `==`.

`Number(null)` gives `0`, but `null == 0` gives `false`.

**Common mistake:** testing for `null` alone.

**Wrong**

```js
const user = { name: "Ada", email: null };

function label(value) {
  if (value === null) {
    return "missing";
  }

  return "set";
}

console.log(label(user.email));
console.log(label(user.phone));
```

**Output**

```text
missing
set
```

**Fix**

```js
const user = { name: "Ada", email: null };

function label(value) {
  if (value «== null») {
    return "missing";
  }

  return "set";
}

console.log(label(user.email));
console.log(label(user.phone));
```

`user.phone` does not exist, so it is `undefined`, and `=== null` let it through. `== null` catches both empty values, and nothing else.

<!-- task -->

## Strings and booleans

**Code**

```js
console.log("" == 0);
console.log(" 12 " == 12);
console.log("0" == false);
console.log("1" == true);
console.log("true" == true);
```

**Output**

```text
true
true
true
true
false
```

```steps
"0" == false => "0" == «0»
"0" == 0 => «0» == 0
"true" == true => "true" == «1»
"true" == 1 => «NaN» == 1
```

**Rule:** When `==` compares a string with a number, the string becomes a number. A boolean always becomes a number first: `true` is `1`, and `false` is `0`.

`"0" == false` gives `true`, but `"0"` is truthy. `==` never asks whether a value is truthy.

**Common mistake:** testing a value with `== true`.

**Wrong**

```js
const name = "Ada";

if (name == true) {
  console.log("has a name");
} else {
  console.log("no name");
}
```

**Output**

```text
no name
```

**Fix**

```js
const name = "Ada";

if («name») {
  console.log("has a name");
} else {
  console.log("no name");
}
```

`true` became `1`, then `"Ada"` became `NaN`. A condition converts its value to a boolean by itself, so leave `== true` out.

<!-- task -->

## Objects become primitives

**Code**

```js
const cart = [];

console.log(cart == "");
console.log(cart == 0);
console.log([7] == 7);
console.log(["a", "b"] == "a,b");
console.log(cart == !cart);
```

**Output**

```text
true
true
true
true
true
```

```steps
[] == ![] => [] == «false»
[] == false => [] == «0»
[] == 0 => «""» == 0
"" == 0 => «0» == 0
```

**Rule:** When `==` compares an object with a primitive, the object becomes a primitive first, with the hint `"default"`. Then the rules for primitives apply. Two objects are never converted: `==` compares their identity.

`![]` gives `false`, because every array is truthy. So `[] == ![]` compares an array with `false`.

An array becomes its text: `[]` becomes `""`, and `[7]` becomes `"7"`.

<!-- task -->

## Remember

- `===` never converts. With two values of the same type, `==` does the same as `===`.
- `null == undefined` is `true`. Neither one equals anything else, not even `0`, `""` or `false`.
- Otherwise `==` moves towards numbers: a boolean becomes a number, a string beside a number becomes a number, and an object becomes a primitive.
- Use `===`. The one good use of `==` is `x == null`.
