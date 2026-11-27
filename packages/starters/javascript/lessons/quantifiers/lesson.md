# Quantifiers

## Counting repeats

**Code**

```js
const order = "Order 7: 42 mugs, 105 cups";

console.log(order.match(/\d+/g).join(","));
console.log(/colou?r/.test("color"));
console.log(/colou?r/.test("colour"));
console.log("b bo boo".match(/bo*/g).join(","));
```

**Output**

```text
7,42,105
true
true
b,bo,boo
```

```steps
"haaa".match(/ha«+»/)[0] => "haaa"
"hahaha".match(/ha«+»/)[0] => "ha"
```

**Rule:** A quantifier says how many times to repeat the item before it. `+` means one or more, `*` means zero or more, and `?` means zero or one.

A quantifier repeats only the one item right before it. `/ha+/` repeats the `a`, not `ha`.

**Common mistake:** using `*` when at least one is needed.

**Wrong**

```js
const receipt = { text: "Total: 42" };

console.log(JSON.stringify(receipt.text.match(/\d*/)[0]));
```

**Output**

```text
""
```

**Fix**

```js
const receipt = { text: "Total: 42" };

console.log(JSON.stringify(receipt.text.match(/\d«+»/)[0]));
```

`\d*` can match zero digits, so it matched the empty text before the `T`. The search stops at the first place that matches. `\d+` needs at least one digit.

<!-- task -->

## Exact counts

**Code**

```js
const zip = /^\d{5}$/;

console.log(zip.test("90210"));
console.log(zip.test("9021"));
console.log("7 42 105 2024".match(/\b\d{2,3}\b/g).join(","));
console.log("1 22 333".match(/\d{2,}/g).join(","));
```

**Output**

```text
true
false
42,105
22,333
```

**Rule:** `{n}` repeats exactly `n` times. `{n,m}` repeats from `n` to `m` times, and `{n,}` repeats `n` times or more. So `+` is `{1,}`, `*` is `{0,}` and `?` is `{0,1}`.

`/a{1, 3}/` has a space, so it is not a quantifier. It matches the text `a{1, 3}` itself.

**Common mistake:** a length limit without anchors.

**Wrong**

```js
const username = /\w{3,8}/;

console.log(username.test("ada_lovelace_1815"));
```

**Output**

```text
true
```

**Fix**

```js
const username = /«^»\w{3,8}«$»/;

console.log(username.test("ada_lovelace_1815"));
```

Without anchors, the pattern only needs three to eight word characters somewhere in the string. A longer name contains them too. `^` and `$` make the limit apply to the whole string.

<!-- task -->

## Greedy and lazy

**Code**

```js
const html = "<b>Sale</b> today";

console.log(html.match(/<.+>/)[0]);
console.log(html.match(/<.+?>/)[0]);
console.log(html.match(/<.+?>/g).join(" "));
console.log(html.match(/<[^>]+>/g).join(" "));
```

**Output**

```text
<b>Sale</b>
<b>
<b> </b>
<b> </b>
```

**Rule:** Quantifiers are greedy: they take as many characters as they can. A `?` right after a quantifier makes it lazy: it takes as few as it can. `.+` ran to the last `>`, and `.+?` stopped at the first one.

`[^>]+` cannot run past a `>`, so greedy is safe there. A negated set is often clearer than a lazy quantifier.

**Common mistake:** ending a pattern with a lazy quantifier.

**Wrong**

```js
const link = { text: "page?id=4821" };

console.log(link.text.match(/id=\d+?/)[0]);
```

**Output**

```text
id=4
```

**Fix**

```js
const link = { text: "page?id=4821" };

console.log(link.text.match(/id=\d«+»/)[0]);
```

Nothing comes after `\d+?`, so one digit is enough to finish the match. A lazy quantifier needs something after it to stop at.

<!-- task -->

## Backtracking

**Code**

```js
const file = "report.final.pdf";

console.log(file.match(/.+\./)[0]);
console.log("12345".match(/\d+5/)[0]);
console.log(/^\d+\d\d\d\d\d\d$/.test("12345"));
```

**Output**

```text
report.final.
12345
false
```

**Rule:** When the rest of the pattern fails, a greedy quantifier gives back one character and tries again. This is backtracking. In `/.+\./`, `.+` first takes the whole name, then gives back characters until a dot follows. If no amount works, the match fails.

`(\d+)*` repeats a repeat, so the same digits can be split in many ways. On a failed match the engine tries them all, and each extra digit doubles the work. This is catastrophic backtracking: 40 digits can freeze a program. Avoid quantifiers that compete for the same characters.

**Common mistake:** expecting a lazy quantifier to find the shortest match.

**Wrong**

```js
const file = { name: "archive.tar.gz" };

console.log(file.name.match(/\..+?$/)[0]);
```

**Output**

```text
.tar.gz
```

**Fix**

```js
const file = { name: "archive.tar.gz" };

console.log(file.name.match(/\.«[^.]+»$/)[0]);
```

The search tries start positions from the left, and the first that works wins. `[^.]+` cannot cross a dot, so only the last dot can start the match.

<!-- task -->

## Remember

- `+` is one or more, `*` zero or more, `?` zero or one, and `{n,m}` from `n` to `m`. Each repeats only the item before it.
- A limit such as `{3,8}` needs `^` and `$` to cover the whole string.
- Quantifiers are greedy and give characters back when the rest fails. `+?` and `*?` are lazy.
- The leftmost match wins. A negated set such as `[^>]+` often fixes what lazy does not.
