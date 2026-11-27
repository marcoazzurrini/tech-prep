# lastIndex and the g Flag

## exec walks with lastIndex

**Code**

```js
const seat = /\d+/g;
const ticket = "row 12 seat 7";

console.log(seat.lastIndex);
console.log(seat.exec(ticket)[0], seat.lastIndex);
console.log(seat.exec(ticket)[0], seat.lastIndex);
console.log(seat.exec(ticket), seat.lastIndex);
```

**Output**

```text
0
12 6
7 13
null 0
```

**Rule:** Every regex has a number, `lastIndex`. With `g`, `exec` starts its search at `lastIndex` and moves it to the end of the match. When `exec` finds nothing, it gives `null` and sets `lastIndex` back to `0`.

`lastIndex` can be set by hand. After `seat.lastIndex = 7`, the next `exec` searches from index 7.

Without `g` or `y`, `exec` ignores `lastIndex` and never changes it. Every call starts at index 0.

<!-- task -->

## test moves lastIndex too

**Code**

```js
const cat = /cat/g;

console.log(cat.test("cat"), cat.lastIndex);
console.log(cat.test("cat"), cat.lastIndex);
console.log(cat.test("cat"), cat.lastIndex);
```

**Output**

```text
true 3
false 0
true 3
```

**Rule:** On a regex with `g` or `y`, `test` reads and moves `lastIndex`, just like `exec`. So the same call on the same string can give a different answer.

The regex keeps `lastIndex` between calls, even when each call gets a different string.

**Common mistake:** a regex with `g`, reused with `test` in a callback.

**Wrong**

```js
const hasDigit = «/\d/g»;
const codes = ["a1", "b2", "c3", "d4"];

console.log(codes.filter((code) => hasDigit.test(code)).join(","));
```

**Output**

```text
a1,c3
```

**Fix**

```js
const hasDigit = «/\d/»;
const codes = ["a1", "b2", "c3", "d4"];

console.log(codes.filter((code) => hasDigit.test(code)).join(","));
```

After `"a1"`, `lastIndex` was 2. The search in `"b2"` started at index 2 and found nothing, which set it back to 0. A yes or no question never needs `g`.

<!-- task -->

## The sticky flag y

**Code**

```js
const word = /\w+/y;
const source = "let total";

word.lastIndex = 3;
console.log(word.exec(source));

word.lastIndex = 4;
console.log(word.exec(source)[0], word.lastIndex);
```

**Output**

```text
null
total 9
```

**Rule:** With `y`, the regex matches only at `lastIndex` exactly. It never searches further on. A regex with `g` would skip the space at index 3 and find `total`.

`y` is the flag for a tokenizer. A tokenizer cuts source text into tokens, such as numbers, names and signs. Each token must start where the last one ended.

`^` with `y` still means the start of the string, not `lastIndex`.

**Common mistake:** a tokenizer built with `g`.

**Wrong**

```js
function tokens(source) {
  const token = /\s*(\d+|[a-z]+|[=+*])/«g»;
  const found = [];
  let match;

  while ((match = token.exec(source)) !== null) {
    found.push(match[1]);
  }

  return found;
}

console.log(tokens("x = 4 $ y").join(" "));
```

**Output**

```text
x = 4 y
```

**Fix**

```js
function tokens(source) {
  const token = /\s*(\d+|[a-z]+|[=+*])/«y»;
  const found = [];
  let match;

  while ((match = token.exec(source)) !== null) {
    found.push(match[1]);
  }

  return found;
}

console.log(tokens("x = 4 $ y").join(" "));
```

With `g`, `exec` jumped over the `$` and went on to `y`, so the bad input passed. With `y`, `exec` fails at the `$` and the loop stops there, at `x = 4`.

<!-- task -->

## Remember

- With `g` or `y`, `exec` and `test` start at `lastIndex` and move it to the end of the match.
- A failed match sets `lastIndex` back to 0.
- Never use `g` for a yes or no `test`, above all with one regex reused across strings.
- `y` matches only at `lastIndex`, which makes it the flag for tokenizers.
