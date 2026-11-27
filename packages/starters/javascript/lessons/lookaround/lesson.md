# Lookahead and Lookbehind

## Lookahead

**Code**

```js
const line = "3 boxes cost 45€, 2 bags cost 9€";

console.log(line.match(/\d+(?=€)/g).join(","));
console.log(line.match(/\d+(?![\d€])/g).join(","));
```

**Output**

```text
45,9
3,2
```

**Rule:** `X(?=Y)` matches `X` only when `Y` comes right after it. `X(?!Y)` matches `X` only when `Y` does not come after it. `Y` is tested, but it is not part of the match.

These tests are called lookaheads. `(?=Y)` is a positive lookahead and `(?!Y)` a negative one.

`(?![\d€])` says "not followed by a digit or `€`". The digit matters, as the mistake below shows.

**Common mistake:** a negative lookahead after `\d+` that lets the number shrink.

**Wrong**

```js
const line = "3 boxes cost 45€, 2 bags cost 9€";

console.log(line.match(/\d+«(?!€)»/g).join(","));
```

**Output**

```text
3,4,2
```

**Fix**

```js
const line = "3 boxes cost 45€, 2 bags cost 9€";

console.log(line.match(/\d+«(?![\d€])»/g).join(","));
```

`45` failed the test, so `\d+` gave back a digit and tried again. `4` is followed by `5`, not `€`, so it passed. Ruling out a digit after the number stops that.

<!-- task -->

## Lookbehind

**Code**

```js
const prices = "Pay $30 now, 45 later, or £12";

console.log(prices.match(/(?<=\$)\d+/g).join(","));
console.log(prices.match(/(?<![$£\d])\d+/g).join(","));
console.log(prices.replace(/(?<=\$)\d+/, "40"));
```

**Output**

```text
30
45
Pay $40 now, 45 later, or £12
```

**Rule:** `(?<=Y)X` matches `X` only when `Y` comes right before it. `(?<!Y)X` matches `X` only when `Y` does not. These are lookbehinds. As with a lookahead, `Y` is not part of the match, so `replace` leaves the `$` in place.

The `\d` in `[$£\d]` stops the regex from matching the `0` of `$30`, the same way as with a lookahead.

In JavaScript, a lookbehind can hold any pattern, even one of varying length, such as `(?<=\$\s*)`. Many other regex engines refuse that.

<!-- task -->

## Several rules at once

**Code**

```js
const strong = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;

for (const password of ["sunshine", "Sunshine1", "Sun1"]) {
  console.log(password, strong.test(password));
}
```

**Output**

```text
sunshine false
Sunshine1 true
Sun1 false
```

**Rule:** A lookahead tests the text but does not move the position. So several lookaheads at `^` each test the whole string from its start. Here one wants a digit somewhere, one wants a capital somewhere, and `.{8,}$` checks the length.

Each rule is one lookahead, so a new rule is easy to add. A negative one works too: `(?!.*x)` at `^` says the string holds no `x`.

**Common mistake:** a rule without `.*` in front.

**Wrong**

```js
const strong = /^(?=«\d»)(?=.*[A-Z]).{8,}$/;

console.log(strong.test("Sunshine1"));
```

**Output**

```text
false
```

**Fix**

```js
const strong = /^(?=«.*\d»)(?=.*[A-Z]).{8,}$/;

console.log(strong.test("Sunshine1"));
```

Without `.*`, the lookahead tests only the first character, so it asked for a digit at the very start. The `.*` lets it find the digit anywhere.

<!-- task -->

## Matching a position

**Code**

```js
const amount = "1234567";

console.log(amount.replace(/\B(?=(\d{3})+$)/g, ","));
```

**Output**

```text
1,234,567
```

```steps
"1234".replace(/\B(?=(\d{3})+$)/g, ",") => "1,234"
"123456".replace(/\B(?=(\d{3})+$)/g, ",") => "123,456"
"999".replace(/\B(?=(\d{3})+$)/g, ",") => "999"
```

**Rule:** A regex made only of tests matches an empty string, at a position. Here the position has whole groups of three digits after it, up to the end. `replace` puts the comma into that empty match.

`\B` is the opposite of `\b`: a position that is not a word boundary. It stops a comma at the very start, as in `",123,456"`.

**Common mistake:** leaving out the `$`.

**Wrong**

```js
const amount = "1234567";

console.log(amount.replace(/\B(?=«(\d{3})+»)/g, ","));
```

**Output**

```text
1,2,3,4,567
```

**Fix**

```js
const amount = "1234567";

console.log(amount.replace(/\B(?=(\d{3})+«$»)/g, ","));
```

Without `$`, any position with three digits after it passed. The `$` makes the groups of three reach the end of the number.

<!-- task -->

## Remember

- `X(?=Y)` and `X(?!Y)` test what comes after `X`. `(?<=Y)X` and `(?<!Y)X` test what comes before it. `Y` is never part of the match.
- After `\d+`, a negative test must also rule out a digit, or the number shrinks until the test passes.
- Lookaheads at `^` each test the whole string, so each rule gets one.
- A regex of only tests matches a position, and `replace` can insert text there.
