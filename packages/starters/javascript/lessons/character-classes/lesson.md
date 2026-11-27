# Character Classes and Anchors

## Digits, words, spaces

**Code**

```js
const room = "Room B_12, floor 3";

console.log(room.match(/\d/g).join(""));
console.log(room.replace(/\D/g, ""));
console.log(room.match(/\w/g).length);
console.log(room.replace(/\s/g, "+"));
```

**Output**

```text
123
123
14
Room+B_12,+floor+3
```

```steps
/\w/.test("_") => true
/\w/.test(«"é"») => false
/\s/.test("\t") => true
/a.c/.test("a-c") => true
/./.test(«"\n"») => false
/./s.test("\n") => true
```

**Rule:** A character class matches one character of a kind. `\d` is a digit, `\w` is a word character (a letter, a digit or `_`), and `\s` is whitespace, such as a space, a tab or a line break. `\D`, `\W` and `\S` match any other character. `.` matches any one character except a line break.

`\w` knows only the letters `A` to `Z` and `a` to `z`. An accented letter such as `é` is not a word character.

`/./s` has the flag `s`. With it, `.` matches a line break too.

**Common mistake:** removing punctuation with `\W`.

**Wrong**

```js
const name = "Zoë B.";

console.log(name.replace(/\W/g, ""));
```

**Output**

```text
ZoB
```

**Fix**

```js
const name = "Zoë B.";

console.log(name.replace(«/[\s.]/g», ""));
```

`ë` is not a word character, so `\W` removed it along with the space and the dot. `[\s.]` matches only whitespace or a dot.

<!-- task -->

## Sets and ranges

**Code**

```js
const item = "Tea & cake: 4.50";

console.log(item.match(/[aeiou]/gi).length);
console.log(item.replace(/[^a-z]/gi, ""));
console.log(/[0-9]/.test(item));
console.log(item.match(/[.:&]/g).join(""));
```

**Output**

```text
4
Teacake
true
&:.
```

```steps
/[.]/.test(«"x"») => false
/[a-]/.test(«"-"») => true
/[a^]/.test(«"^"») => true
```

**Rule:** A set in square brackets matches one character from the set. `a-z` inside a set is a range. A `^` right after `[` turns the set around: `[^a-z]` matches one character that is not a small letter.

Inside a set, most special characters are plain. `[.]` matches only a dot. A `-` at the start or end is plain, and so is a `^` anywhere but first.

**Common mistake:** writing one range from `A` to `z`.

**Wrong**

```js
const symbol = { char: "_" };

console.log(/[A-z]/.test(symbol.char));
```

**Output**

```text
true
```

**Fix**

```js
const symbol = { char: "_" };

console.log(/[«A-Za-z»]/.test(symbol.char));
```

A range follows character codes. Six other characters sit between `Z` and `a`, and `_` is one of them. Write the capital and the small range apart.

<!-- task -->

## Start and end

**Code**

```js
const pin = /^\d\d\d\d$/;

console.log(pin.test("4821"));
console.log(pin.test("48210"));
console.log(pin.test("PIN 4821"));
console.log(/^\d/.test("4 apples"));
```

**Output**

```text
true
false
false
true
```

**Rule:** `^` matches the start of the string, and `$` matches the end. They are anchors: they match a position, not a character. With both, the whole string must fit the pattern.

`/^\d$/.test("7\n")` gives `false`. Without a flag, `$` matches only at the very end, not before a final line break.

**Common mistake:** expecting `^` to match at each line.

**Wrong**

```js
const list = "# Shop\nmilk\n# Bank\npay rent";

console.log(list.match(/^#/g).length);
```

**Output**

```text
1
```

**Fix**

```js
const list = "# Shop\nmilk\n# Bank\npay rent";

console.log(list.match(/^#/g«m»).length);
```

Without a flag, `^` matches only at the start of the whole string. The flag `m` makes `^` and `$` match at the start and end of every line too.

<!-- task -->

## Word boundaries

**Code**

```js
const text = "cat, catalog, bobcat, cat.";

console.log(text.match(/cat/g).length);
console.log(text.match(/\bcat\b/g).length);
console.log(/\bcat/.test("bobcat"));
console.log(/cat\b/.test("bobcat"));
```

**Output**

```text
4
2
false
true
```

**Rule:** `\b` is a word boundary. It matches the position between a word character and any other character, or the start or end of the string next to a word character. Like `^`, it takes up no character.

`\B` matches every position where `\b` does not.

`/\bZo\b/.test("Zoë")` gives `true`. `ë` is not a word character, so a boundary sits before it.

**Common mistake:** writing `\b` in a string for `new RegExp`.

**Wrong**

```js
const pattern = new RegExp("\bcat\b");

console.log(pattern.test("a cat here"));
```

**Output**

```text
false
```

**Fix**

```js
const pattern = new RegExp("«\\b»cat«\\b»");

console.log(pattern.test("a cat here"));
```

In a string, `\b` is the backspace character, so the pattern looked for backspaces. `"\\b"` gives the two characters `\b` that the regex needs.

<!-- task -->

## Remember

- `\d`, `\w` and `\s` match a digit, a word character and whitespace. The capital forms match the rest. `.` matches anything but a line break, unless the flag is `s`.
- `[abc]` matches one character of the set, `[a-z]` one of a range, and `[^abc]` one outside the set.
- `^` and `$` match the start and end of the string, or of each line with `m`.
- `\b` matches the edge of a word. Anchors and `\b` match a position, not a character.
