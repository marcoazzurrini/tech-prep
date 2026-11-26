# Comparing with < and >

## Two strings, by character

**Code**

```js
console.log("10" < "9");
console.log(10 < 9);
console.log("apple" < "banana");
console.log("Zoe" < "adam");
console.log("car" < "cart");
```

**Output**

```text
true
false
true
true
true
```

```steps
"10" < "9" => «"1" < "9"»
"Z".charCodeAt(0) => 90
"a".charCodeAt(0) => 97
```

**Rule:** When both sides are strings, `<` and `>` compare them character by character, by character code. The first pair of characters that differ decides. Nothing becomes a number.

A **character code** is the number that stands for a character. `"Z"` is 90 and `"a"` is 97, so the capital letters `A` to `Z` all come before the small ones.

`"car" < "cart"` gives `true`. When one string is the start of the other, the shorter one is smaller.

**Common mistake:** comparing numbers that are still text.

**Wrong**

```js
const bids = { ada: "100", bob: "25" };
const winner = bids.ada > bids.bob ? "ada" : "bob";

console.log(winner);
```

**Output**

```text
bob
```

**Fix**

```js
const bids = { ada: "100", bob: "25" };
const winner = «Number(bids.ada) > Number(bids.bob)» ? "ada" : "bob";

console.log(winner);
```

Both bids were strings, so `"1"` was compared with `"2"`. Convert them first, and the numbers are compared.

<!-- task -->

## Otherwise, numbers

**Code**

```js
console.log("10" > 9);
console.log("2" < 12);
console.log(true > 0);
console.log("abc" < 5);
console.log("abc" >= 5);
```

**Output**

```text
true
true
true
false
false
```

```steps
"10" > 9 => «10» > 9
true > 0 => «1» > 0
"abc" < 5 => «NaN» < 5
```

**Rule:** Unless both sides are strings, `<`, `>`, `<=` and `>=` convert both sides to numbers. When a side becomes `NaN`, every comparison gives `false`.

`[10] > 9` gives `true`. An object becomes a primitive first, with the hint `"number"`.

**Common mistake:** turning a comparison around with `!`.

**Wrong**

```js
const age = Number("eighteen");

if (!(age < 18)) {
  console.log("adult");
} else {
  console.log("minor");
}
```

**Output**

```text
adult
```

**Fix**

```js
const age = Number("eighteen");

if («age >= 18») {
  console.log("adult");
} else {
  console.log("minor");
}
```

`age` is `NaN`, so `age < 18` is `false`, and `!` made it `true`. With `NaN`, `age >= 18` is `false` too. Write the comparison you mean.

<!-- task -->

## null and undefined

**Code**

```js
console.log(null >= 0);
console.log(null > 0);
console.log(null == 0);
console.log(undefined >= 0);
console.log(undefined < 1);
```

**Output**

```text
true
false
false
false
false
```

```steps
null >= 0 => «0» >= 0
undefined >= 0 => «NaN» >= 0
```

**Rule:** `<`, `>`, `<=` and `>=` convert `null` to `0`, and `undefined` to `NaN`. So `null >= 0` is `true`, and every comparison with `undefined` is `false`.

`null == 0` gives `false`, because `==` never converts `null`. Only `<`, `>`, `<=` and `>=` treat it as `0`.

**Common mistake:** letting a missing value pass a range test.

**Wrong**

```js
const result = { player: "Ada", score: null };

if (result.score >= 0) {
  console.log("valid score");
} else {
  console.log("no score");
}
```

**Output**

```text
valid score
```

**Fix**

```js
const result = { player: "Ada", score: null };

if («result.score !== null &&» result.score >= 0) {
  console.log("valid score");
} else {
  console.log("no score");
}
```

`null` counted as `0`, and `0 >= 0` is `true`. Rule out `null` before you compare.

<!-- task -->

## Chained comparisons

**Code**

```js
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
```

**Output**

```text
true
false
```

```steps
1 < 2 < 3 => «true» < 3
true < 3 => «1» < 3
3 > 2 > 1 => «true» > 1
true > 1 => «1» > 1
```

**Rule:** A chain of comparisons runs left to right, one pair at a time. The first pair gives `true` or `false`, and the next comparison converts that to `1` or `0`.

**Common mistake:** writing a range as in maths.

**Wrong**

```js
const age = 80;

console.log(18 <= age <= 65);
```

**Output**

```text
true
```

**Fix**

```js
const age = 80;

console.log(«18 <= age && age <= 65»);
```

`18 <= 80` gave `true`, and `true <= 65` means `1 <= 65`. Test each end by itself, and join the two tests with `&&`.

<!-- task -->

## Remember

- Two strings compare character by character, by code: `"10" < "9"`, and `"Z" < "a"`.
- Any other mix becomes numbers: `"10" > 9`. Convert text yourself before you compare.
- `NaN` and `undefined` make every comparison `false`. `null` counts as `0`, so `null >= 0` is `true`.
- `1 < 2 < 3` compares `true < 3`. Write `a < b && b < c`.
