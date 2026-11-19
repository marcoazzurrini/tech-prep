# String Encoding

To pack many pieces into one string, write the length of each piece in front of it. The reader takes the length, then reads exactly that many characters. A separator alone is not safe, because a piece may contain the separator.

## Worked example

Pack two words into one string. Then read the first word back.

```ts
const first = "a#b";
const second = "c";
const packed = first.length + "#" + first + second.length + "#" + second;
// packed: "3#a#b1#c"

const mark = packed.indexOf("#");
const length = Number(packed.slice(0, mark));
const start = mark + 1;
const word = packed.slice(start, start + length);

// word: "a#b". The next piece starts at index start + length.
```

## Why it works

- The first `#` ends the length. The digits of a length never contain `#`, so this mark is always clear.
- The reader counts characters. It never searches inside a piece, so a `#` inside a piece does no harm.
- After one piece, the reader stands exactly at the length of the next piece.

## When to use it

- The task asks you to turn a list into one string, and to get the same list back.
- The pieces may hold any character, so no separator is safe.
- Empty pieces must survive. A length of 0 is clear, and a bare separator is not.
