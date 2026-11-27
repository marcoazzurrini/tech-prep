# Regex and Unicode

## The u flag

**Code**

```js
const order = "a🍕b";

console.log(order.match(/./g).length);
console.log(order.match(/./gu).length);
console.log(/^.$/.test("🍕"), /^.$/u.test("🍕"));
```

**Output**

```text
4
3
false true
```

```steps
/\u{1F355}/u.test("🍕") => true
/\u{61}/u.test("a") => true
/«\u{61}»/.test("a") => false
```

**Rule:** Without `u`, a regex reads the string as code units, so `.` matches half of `🍕`. With `u`, it reads code points, and `🍕` is one character.

`\u{...}` names a code point by its hex number. It works only with `u`. Without `u`, `/\u{61}/` means the letter `u`, 61 times.

`u` also makes the syntax strict. An escape with no meaning, such as `\a`, or a lone `{` is a `SyntaxError`. Without `u`, they quietly match themselves.

**Common mistake:** an emoji in a set, without `u`.

**Wrong**

```js
const mood = "😎";

console.log(mood.replace(/[😀😎]/g, "?"));
```

**Output**

```text
??
```

**Fix**

```js
const mood = "😎";

console.log(mood.replace(/[😀😎]/g«u», "?"));
```

Without `u`, the set holds four code units. Each half of `😎` matched on its own, so it became two `?`. With `u`, the set holds two characters.

<!-- task -->

## Match by property

**Code**

```js
const guests = "Zoë, Łukasz, 李, Ana";

console.log(guests.match(/\p{L}+/gu).join("|"));
console.log(guests.match(/\w+/g).join("|"));
```

**Output**

```text
Zoë|Łukasz|李|Ana
Zo|ukasz|Ana
```

**Rule:** `\p{...}` matches a character by its Unicode property. `\p{L}` is any letter, in any script. `\P{L}`, with a capital `P`, is any character that is not a letter. Both need the `u` or the `v` flag.

Other useful ones: `\p{Lu}` is a capital letter, `\p{N}` any number, and `\p{Script=Greek}` a Greek character.

`\w` and `\d` do not grow with `u`. `/\w/u` still does not match `ë`.

**Common mistake:** `\p{L}` without `u`.

**Wrong**

```js
const word = "café";

console.log(/^\p{L}+$/.test(word));
```

**Output**

```text
false
```

**Fix**

```js
const word = "café";

console.log(/^\p{L}+$/«u».test(word));
```

Without `u`, `\p{L}` is not a property. It is the plain text `p{L}`, so the regex could never match a word.

<!-- task -->

## Emoji properties

**Code**

```js
const note = "Table 4 🎉 for 2 👍🏽";

console.log(note.match(/\p{Emoji}/gu).join(" "));
console.log(note.match(/\p{Extended_Pictographic}/gu).join(" "));
```

**Output**

```text
4 🎉 2 👍 🏽
🎉 👍
```

**Rule:** `\p{Emoji}` matches more than pictures. The digits, `#` and `*` have it too, because they can start a keycap emoji such as 1️⃣. For picture characters, use `\p{Extended_Pictographic}`.

`👍🏽` is two code points: the thumb, then a skin tone. With `u`, the regex sees two characters. The `v` flag can match the pair as one emoji.

**Common mistake:** testing for an emoji with `\p{Emoji}`.

**Wrong**

```js
const hasEmoji = (text) => /«\p{Emoji}»/u.test(text);

console.log(hasEmoji("Room 12"));
```

**Output**

```text
true
```

**Fix**

```js
const hasEmoji = (text) => /«\p{Extended_Pictographic}»/u.test(text);

console.log(hasEmoji("Room 12"));
```

The digit `1` has the `Emoji` property, so a plain room number passed. `Extended_Pictographic` is only on picture characters.

<!-- task -->

## The v flag

**Code**

```js
const chat = "Hi 👍🏽 from 🇮🇹 at 7";
console.log(chat.match(/\p{RGI_Emoji}/gv).join(","));

const letters = "Ä b γ";
console.log(letters.match(/[\p{L}--[a-z]]/gv).join(""));
console.log(letters.match(/[\p{L}&&\p{Script=Greek}]/gv).join(""));
```

**Output**

```text
👍🏽,🇮🇹
Äγ
γ
```

**Rule:** `v` is an upgrade of `u`. It adds properties of strings, such as `\p{RGI_Emoji}`, which match a whole emoji even when it is several code points. In a set, `--` takes characters away and `&&` keeps only the characters in both.

A regex cannot have both `u` and `v`. That is a `SyntaxError`.

With `v`, a set must escape more characters, such as `(`, `)`, `{`, `}`, `|` and `-`. `/[(]/u` is fine, but with `v` it must be `/[\(]/v`.

**Common mistake:** a property of strings with `u`.

**Wrong**

```js
const chat = "Hi 👍🏽";

console.log(chat.match(/\p{RGI_Emoji}/g«u»).length);
```

**Error**

```text
SyntaxError: Invalid regular expression: invalid property expression
```

**Fix**

```js
const chat = "Hi 👍🏽";

console.log(chat.match(/\p{RGI_Emoji}/g«v»).length);
```

`\p{RGI_Emoji}` matches a run of code points, and only `v` allows that. With `u`, the whole file fails to load.

<!-- task -->

## Remember

- With `u` or `v`, a regex works on code points, so an emoji is one character.
- `\p{L}` matches any letter and `\P{L}` anything else. `\w` stays ASCII.
- `\p{Emoji}` includes digits, `#` and `*`. Use `\p{Extended_Pictographic}` for pictures.
- `v` adds `\p{RGI_Emoji}` for whole emoji, and `--` and `&&` in sets.
