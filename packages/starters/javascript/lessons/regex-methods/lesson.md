# Using a Regex on a String

## One match or all

**Code**

```js
const log = "Order 12 shipped, order 7 lost";

const first = log.match(/order (\d+)/i);
console.log(first[0], first[1], first.index);

const all = log.match(/order (\d+)/gi);
console.log(all.join(" | "));

console.log(log.match(/refund/g));
```

**Output**

```text
Order 12 12 0
Order 12 | order 7
null
```

**Rule:** Without `g`, `match` gives the first match as an array: the whole match, then each group. Its `index` says where the match starts. With `g`, `match` gives the text of every match, and the groups are lost.

`match` gives `null` when nothing matches, with or without `g`. It never gives an empty array.

`re.exec(text)` is the same search, called on the regex. Without `g`, it gives what `text.match(re)` gives.

**Common mistake:** reading `length` of a match that can be `null`.

**Wrong**

```js
const post = { text: "Lovely day" };

const count = post.text.match(/#\w+/g).length;
console.log(count);
```

**Error**

```text
TypeError: null is not an object (evaluating 'post.text.match(/#\w+/g).length')
```

**Fix**

```js
const post = { text: "Lovely day" };

const count = «(post.text.match(/#\w+/g) ?? [])».length;
console.log(count);
```

The text has no hashtag, so `match` gave `null`. The `?? []` turns "no match" into an empty array.

<!-- task -->

## Every match with groups

**Code**

```js
const menu = "tea 3, cake 5, juice 4";
const item = /(?<name>[a-z]+) (?<price>\d+)/g;

for (const m of menu.matchAll(item)) {
  console.log(m.groups.name, m.groups.price, m.index);
}
```

**Output**

```text
tea 3 0
cake 5 7
juice 4 15
```

**Rule:** `matchAll` gives every match, and each one is a full match array with its groups and `index`. The regex must have `g`.

`matchAll` returns an iterator. That is an object that `for...of` and spread can walk, one match at a time. `[...text.matchAll(re)]` turns it into an array. With no match, it is empty, never `null`.

Use `matchAll` when you need the groups of every match. When the text of each match is enough, `match` with `g` is shorter.

**Common mistake:** calling `matchAll` with a regex that has no `g`.

**Wrong**

```js
const menu = "tea 3, cake 5";

for (const m of menu.matchAll(/(\w+) (\d+)/)) {
  console.log(m[1]);
}
```

**Error**

```text
TypeError: String.prototype.matchAll argument must not be a non-global regular expression
```

**Fix**

```js
const menu = "tea 3, cake 5";

for (const m of menu.matchAll(/(\w+) (\d+)/«g»)) {
  console.log(m[1]);
}
```

`matchAll` throws a `TypeError` for a regex without `g`, so it can never quietly give one match. Add the `g`.

<!-- task -->

## A function as replacement

**Code**

```js
const order = "2 apples at $3, 5 pears at $2";

const doubled = order.replace(/(\d+) ([a-z]+)/g, (match, count, fruit) => {
  return `${count * 2} ${fruit}`;
});

console.log(doubled);
```

**Output**

```text
4 apples at $3, 10 pears at $2
```

**Rule:** When the replacement is a function, `replace` calls it once for each match. It gets the whole match, then each group, then the index of the match and the whole string. Its return value takes the place of the match.

`replaceAll(re, fn)` does the same. It throws a `TypeError` when `re` has no `g`.

The return value is used as it is: `$1` in it is plain text, not a group.

**Common mistake:** reading the index as the second parameter when the regex has a group.

**Wrong**

```js
const note = "Pay $5 or $12";

const marked = note.replace(/\$(\d+)/g, (match, «offset») => `<${offset}>`);
console.log(marked);
```

**Output**

```text
Pay <5> or <12>
```

**Fix**

```js
const note = "Pay $5 or $12";

const marked = note.replace(/\$(\d+)/g, (match, «amount, offset») => `<${offset}>`);
console.log(marked);
```

Each group adds one parameter before the index. With one group, the second parameter is the group's text, so the index comes third.

<!-- task -->

## split and search

**Code**

```js
const colours = "red, green;blue  pink";
console.log(colours.split(/[,;\s]+/).join("|"));

const sum = "12+7-3";
console.log(JSON.stringify(sum.split(/([+-])/)));

console.log("Total: 40 EUR".search(/\d/));
console.log("Total: none".search(/\d/));
```

**Output**

```text
red|green|blue|pink
["12","+","7","-","3"]
7
-1
```

**Rule:** `split` with a regex cuts the string at every match, with or without `g`. When the regex has a group, the text each group captured goes into the result, between the pieces.

`search` gives the index of the first match, or `-1`. It ignores `g`.

**Common mistake:** a group that was only meant to hold an alternation.

**Wrong**

```js
const date = "2026-05/09";

console.log(JSON.stringify(date.split(/(-|\/)/)));
```

**Output**

```text
["2026","-","05","/","09"]
```

**Fix**

```js
const date = "2026-05/09";

console.log(JSON.stringify(date.split(/«(?:-|\/)»/)));
```

The group captured each separator, so `split` kept them. A non-capturing group, or the set `[-/]`, cuts without keeping them.

<!-- task -->

## Remember

- `match` without `g` gives the first match with its groups and `index`. With `g`, it gives the text of every match. No match gives `null`.
- `matchAll` needs `g`, and gives every match with its groups.
- A replacement function gets the match, then each group, then the index. Its return value replaces the match.
- `split` keeps what its groups capture. `search` gives the first index, or `-1`. `test` gives `true` or `false`.
