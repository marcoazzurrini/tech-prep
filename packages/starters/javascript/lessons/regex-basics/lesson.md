# Patterns and Flags

## A pattern and test

**Code**

```js
const note = "Pack the Blue mug";

console.log(/blue/.test(note));
console.log(/blue/i.test(note));
console.log(note.match(/blue/i)[0]);
console.log(note.replace(/blue/i, "red"));
```

**Output**

```text
false
true
Blue
Pack the red mug
```

**Rule:** A regular expression, or regex, is a pattern for text. In `/blue/i` the pattern sits between the slashes. The flags come after, and each one changes how the search works. `test` returns `true` when the pattern appears anywhere in the string.

`/blue/i` has the flag `i`, which ignores case. Without it, `blue` does not match `Blue`.

`note.match(/blue/i)` returns an array with the matched text at index `0`. `replace` with a regex works like `replace` with a string.

**Common mistake:** passing a regex to `includes`.

**Wrong**

```js
const note = { text: "Pack the Blue mug" };

console.log(note.text.includes(/blue/i));
```

**Error**

```text
TypeError: Argument to String.prototype.includes cannot be a RegExp
```

**Fix**

```js
const note = { text: "Pack the Blue mug" };

console.log(«/blue/i.test(note.text)»);
```

`includes`, `startsWith` and `endsWith` throw when they get a regex. Call `test` on the regex and pass it the string.

<!-- task -->

## The g flag

**Code**

```js
const log = "error, ok, error, Error";

console.log(log.replace(/error/, "E"));
console.log(log.replace(/error/g, "E"));
console.log(log.replace(/error/gi, "E"));
console.log(log.match(/error/gi).length);
console.log(log.match(/fatal/gi));
```

**Output**

```text
E, ok, error, Error
E, ok, E, Error
E, ok, E, E
3
null
```

**Rule:** Without the flag `g`, `match` and `replace` stop at the first match. With `g`, `replace` changes every match, and `match` returns an array of every matched text. When nothing matches, `match` returns `null`.

`/error/gi` has two flags. Their order does not matter.

`"tea".replace(/tea/, "[$&]")` gives `"[tea]"`. In the replacement, `$&` stands for the matched text.

**Common mistake:** reading `length` when `match` may find nothing.

**Wrong**

```js
const review = { text: "Great tea, great mug" };
const bad = review.text.match(/bad/gi).length;

console.log(bad);
```

**Error**

```text
TypeError: null is not an object (evaluating 'review.text.match(/bad/gi).length')
```

**Fix**

```js
const review = { text: "Great tea, great mug" };
const bad = «(review.text.match(/bad/gi) ?? [])».length;

console.log(bad);
```

No match gives `null`, not an empty array. `?? []` turns `null` into an empty array, so the count is `0`.

<!-- task -->

## Special characters

**Code**

```js
console.log(/\$4\.99/.test("Total: $4.99"));
console.log(/\(beta\)/.test("App (beta)"));
console.log(/1\+1/.test("1+1=2"));
console.log("10/05/2025".replace(/\//g, "-"));
```

**Output**

```text
true
true
true
10-05-2025
```

**Rule:** These characters have a special meaning in a pattern: `\ ^ $ . * + ? ( ) [ ] { } |`. To match one as plain text, put a backslash before it. This is called escaping.

`/\//` matches a slash. In a regex literal a plain `/` would end the pattern, so it needs a backslash too.

**Common mistake:** leaving a dot unescaped.

**Wrong**

```js
const email = "ada@shopXcom";

console.log(/@shop.com/.test(email));
```

**Output**

```text
true
```

**Fix**

```js
const email = "ada@shopXcom";

console.log(/@shop«\.»com/.test(email));
```

A plain `.` matches any one character, so it matched the `X`. `\.` matches only a dot.

<!-- task -->

## new RegExp

**Code**

```js
const word = "tea";
const pattern = new RegExp(word, "gi");

console.log("Tea or tea?".replace(pattern, "coffee"));
console.log(pattern.source, pattern.flags);
console.log(new RegExp("4\.99").source);
console.log(new RegExp("4\\.99").source);
```

**Output**

```text
coffee or coffee?
tea gi
4.99
4\.99
```

**Rule:** `new RegExp(text, flags)` builds a regex from a string while the program runs. A string reads `\` as its own escape first, so write `\\` for each backslash the pattern needs.

`pattern.source` gives the pattern as text, and `pattern.flags` gives the flags.

`RegExp.escape(text)` escapes every special character in `text`. Use it when the text comes from a user.

**Common mistake:** building a regex from text that holds special characters.

**Wrong**

```js
const search = { query: "c++" };
const pattern = new RegExp(search.query, "i");

console.log(pattern.test("I write C++"));
```

**Error**

```text
SyntaxError: Invalid regular expression: nothing to repeat
```

**Fix**

```js
const search = { query: "c++" };
const pattern = new RegExp(«RegExp.escape(search.query)», "i");

console.log(pattern.test("I write C++"));
```

`+` is a special character, so `c++` is not a valid pattern. `RegExp.escape` turns it into a pattern that matches the text `c++`.

<!-- task -->

## Remember

- `/pattern/flags` makes a regex. `test` says whether the pattern appears in a string.
- `i` ignores case. `g` makes `match` and `replace` handle every match. `match` gives `null` when nothing matches.
- Escape `\ ^ $ . * + ? ( ) [ ] { } |` with a backslash to match them as text. In a literal, escape `/` too.
- `new RegExp(text, flags)` builds a regex from a string. Double each backslash, and escape user text with `RegExp.escape`.
