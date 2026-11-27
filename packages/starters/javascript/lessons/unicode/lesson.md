# Unicode

## Units and code points

**Code**

```js
const pizza = "🍕";

console.log(pizza.length);
console.log(pizza.charCodeAt(0));
console.log(pizza.charCodeAt(1));
console.log(pizza.codePointAt(0));
console.log(String.fromCodePoint(127829) === pizza);
```

**Output**

```text
2
55356
57173
127829
true
```

```steps
"a".length => 1
"€".length => 1
"🍕".length => 2
"é" === "é" => true
"\u{1F355}" === "🍕" => true
"🍕".codePointAt(0).toString(16) => "1f355"
```

**Rule:** Unicode gives every character a number, its **code point**. A string stores 16-bit **code units**, and one unit holds a number up to 65535. A larger code point, such as most emoji, takes two units, called a **surrogate pair**. `length` and `[i]` count code units.

`codePointAt(i)` reads the whole code point that starts at unit `i`. `charCodeAt(i)` reads one unit only. At the second unit of a pair, both give that one unit.

`"\u{1F355}"` writes a code point in hexadecimal, and `"é"` writes one of exactly four hex digits.

**Common mistake:** making an emoji with `fromCharCode`.

**Wrong**

```js
const heart = String.«fromCharCode»(0x1f49a);

console.log(heart === "💚");
```

**Output**

```text
false
```

**Fix**

```js
const heart = String.«fromCodePoint»(0x1f49a);

console.log(heart === "💚");
```

`fromCharCode` takes code units, and keeps only the lowest 16 bits of the number. So it made a different character. `fromCodePoint` takes a whole code point.

<!-- task -->

## Walk by code point

**Code**

```js
const order = "2🍕1🥤";

for (const item of order) {
  console.log(item);
}

console.log(order.length);
console.log([...order].length);
console.log(order.split("").length);
```

**Output**

```text
2
🍕
1
🥤
6
4
6
```

**Rule:** `for...of` and spread walk a string by code point, so a surrogate pair stays whole. `split("")`, `[i]` and a loop over the indexes work by code unit, and cut each pair in two.

`Array.from(text)` gives the same array as `[...text]`.

**Common mistake:** reversing a string with `split("")`.

**Wrong**

```js
const word = "ok🍕";
const backwards = «word.split("")».reverse().join("");

console.log(JSON.stringify(backwards));
```

**Output**

```text
"\udf55\ud83cko"
```

**Fix**

```js
const word = "ok🍕";
const backwards = «[...word]».reverse().join("");

console.log(JSON.stringify(backwards));
```

`split("")` made the two halves of the pizza two items, and `reverse` swapped them. Two halves in the wrong order are not a character. `JSON.stringify` writes each lone half as an escape such as `\ud83c`. Spread keeps the pair together.

<!-- task -->

## Same look, different code

**Code**

```js
const typed = "café";
const pasted = "café";

console.log(typed, pasted);
console.log(typed === pasted);
console.log(typed.length, pasted.length);
console.log(typed.normalize() === pasted.normalize());
console.log(pasted.normalize().length);
```

**Output**

```text
café café
false
4 5
true
4
```

**Rule:** Some characters can be written two ways: as one code point, or as a letter and a **combining mark**. A combining mark is a code point that adds an accent to the letter before it. The two look the same, but `===` compares code units, so they are not equal. `normalize()` turns both into one standard form.

`normalize()` uses the form `"NFC"`, which joins a letter and its mark where it can. `normalize("NFD")` splits them apart.

**Common mistake:** comparing text from users without normalizing it.

**Wrong**

```js
const saved = "Zoë";
const typed = "Zoë";

console.log(«saved === typed»);
```

**Output**

```text
false
```

**Fix**

```js
const saved = "Zoë";
const typed = "Zoë";

console.log(«saved.normalize() === typed.normalize()»);
```

Both strings show `Zoë`, but one wrote `ë` as a letter and a mark. Normalize both sides before you compare them.

<!-- task -->

## What a reader sees

**Code**

```js
const like = "👍🏽";
const family = "👨‍👩‍👧";
const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const count = (text) => [...segmenter.segment(text)].length;

console.log(like.length, [...like].length, count(like));
console.log(family.length, [...family].length, count(family));
```

**Output**

```text
4 2 1
8 5 1
```

**Rule:** A **grapheme** is what a reader sees as one character. It can be several code points. `👍🏽` is a hand and a skin tone. The family is three people joined by two invisible code points. `Intl.Segmenter` with `granularity: "grapheme"` splits a text into graphemes.

`segmenter.segment(text)` gives one object per grapheme. The grapheme itself is in its `segment` property.

**Common mistake:** reversing by code point when a grapheme has several.

**Wrong**

```js
const reaction = "nice👍🏽";
const backwards = «[...reaction]».reverse().join("");

console.log(backwards);
```

**Output**

```text
🏽👍ecin
```

**Fix**

```js
const reaction = "nice👍🏽";
const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const pieces = «[...segmenter.segment(reaction)].map((part) => part.segment)»;
const backwards = pieces.reverse().join("");

console.log(backwards);
```

Spread split the hand from its skin tone, and `reverse` put the skin tone first. Split into graphemes, and each one stays whole.

<!-- task -->

## Remember

- `length` and `[i]` count 16-bit code units. Most emoji take two.
- `for...of`, spread and `codePointAt` work with whole code points. `split("")` cuts them in half.
- The same text can be written with different code points. `normalize()` both sides before you compare.
- What a reader sees as one character can be several code points. `Intl.Segmenter` splits by grapheme.
