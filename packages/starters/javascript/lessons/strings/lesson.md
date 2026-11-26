# Strings Are Immutable

## Read by index

**Code**

```js
const word = "planet";

console.log(word.length);
console.log(word[0]);
console.log(word[5]);
console.log(word.at(-1));
console.log(word[6]);
```

**Output**

```text
6
p
t
t
undefined
```

```steps
"planet"[0] => "p"
"planet".at(-1) => "t"
"planet".at(-2) => "e"
"planet"«[6]» => undefined
```

**Rule:** A string is a row of characters, counted from index 0. `word[i]` and `word.at(i)` read one character, and `length` says how many there are. An index out of range gives `undefined`.

`word.at(-1)` gives the last character. `at` counts a negative index from the end.

`typeof word[0]` gives `"string"`. One character is a string of length 1.

**Common mistake:** reading the last character with `[-1]`.

**Wrong**

```js
const file = "report.pdf";

console.log(file«[-1]»);
```

**Output**

```text
undefined
```

**Fix**

```js
const file = "report.pdf";

console.log(file«.at(-1)»);
```

Square brackets do not count from the end, so `[-1]` is out of range. `at(-1)` reads the last character, and so does `file[file.length - 1]`.

<!-- task -->

## Methods return new strings

**Code**

```js
const title = "  Dune  ";
const trimmed = title.trim();
const loud = trimmed.toUpperCase();

console.log(trimmed);
console.log(loud);
console.log(trimmed.length);
console.log(title.length);
```

**Output**

```text
Dune
DUNE
4
8
```

```steps
"Dune".toUpperCase() => "DUNE"
"Dune".replace("D", "T") => "Tune"
"Dune".slice(1) => "une"
"  Dune ".trim().toLowerCase() => "dune"
```

**Rule:** No method changes the string it is called on. Each method returns a new string, and the first string stays as it was.

`title.length` is still `8` at the end. `trim` did not touch `title`.

**Common mistake:** calling a method and not keeping what it returns.

**Wrong**

```js
let email = " ada@mail.com ";

email.trim();

console.log("[" + email + "]");
```

**Output**

```text
[ ada@mail.com ]
```

**Fix**

```js
let email = " ada@mail.com ";

«email = »email.trim();

console.log("[" + email + "]");
```

`trim` returned a new string, and nothing kept it. Put the result back in the variable, or in a new one.

<!-- task -->

## No writing by index

**Code**

```js
const word = "cat";
const changed = "b" + word.slice(1);

console.log(changed);
console.log(word);
```

**Output**

```text
bat
cat
```

**Rule:** A string is immutable: once it is made, it can never be changed. To get a different text, build a new string from pieces of the old one.

`word = "bat"` is allowed when `word` is declared with `let`. It puts a new string in the variable. The string `"cat"` is not changed.

**Common mistake:** assigning to an index.

**Wrong**

```js
let word = "cat";

word«[0] = "b"»;

console.log(word);
```

**Error**

```text
TypeError: Attempted to assign to readonly property.
```

**Fix**

```js
let word = "cat";

word = «"b" + word.slice(1)»;

console.log(word);
```

An index of a string can be read, not written. Chrome and Node say `Cannot assign to read only property '0' of string 'cat'`. Old code that is not in strict mode gives no error: the line does nothing.

<!-- task -->

## Equal by characters

**Code**

```js
const typed = "it's";
const escaped = 'it\'s';
const built = "it" + "'" + "s";

console.log(typed === escaped);
console.log(typed === built);
console.log(escaped.length);
console.log("Tea" === "tea");
```

**Output**

```text
true
true
4
false
```

```steps
"a\nb".length => 3
"a\\b".length => 3
"ab" + "c" === "abc" => true
"abc" === "abc " => false
```

**Rule:** Two strings are equal with `===` when they hold the same characters in the same order. An escape is a backslash and the character after it. It writes one character.

`"a\nb"` holds a line break between `a` and `b`. `\t` is a tab, and `\\` is one backslash.

`["tea"] === ["tea"]` gives `false`. Only primitives are compared by what they hold.

**Common mistake:** writing a backslash without doubling it.

**Wrong**

```js
const folder = "C:«\»notes«\»new";

console.log(folder);
```

**Output**

```text
C:
otes
ew
```

**Fix**

```js
const folder = "C:«\\»notes«\\»new";

console.log(folder);
```

`\n` is the escape for a line break, so both `n` letters were lost. `\\` is the escape for one backslash.

<!-- task -->

## Remember

- `text[i]` and `text.at(i)` read a character. Out of range gives `undefined`. Only `at` takes a negative index.
- A string never changes. Every method returns a new string, so keep the result.
- Writing to an index throws. Build a new string.
- `===` compares strings by their characters. An escape such as `\n` is one character.
