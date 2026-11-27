# String Methods

## slice and substring

**Code**

```js
const file = "summer-photo.jpeg";

console.log(file.slice(0, 6));
console.log(file.slice(-4));
console.log(file.slice(7, -5));
console.log(file.substring(7, 12));
console.log(file.substring(-4));
```

**Output**

```text
summer
jpeg
photo
photo
summer-photo.jpeg
```

```steps
"photo".slice(1, 3) => "ho"
"photo".slice(-2) => "to"
"photo".substring(«-2») => "photo"
"photo".substring(3, 1) => "ho"
"photo".slice(3, 1) => ""
```

**Rule:** `slice(start, end)` returns the characters from `start` up to, but not including, `end`. A negative index counts from the end. `substring` does the same with positive indexes, but treats a negative index as `0`.

`substring(3, 1)` swaps its arguments, so it gives the same as `substring(1, 3)`. `slice(3, 1)` gives `""`.

Leave out `end`, and both methods go to the end of the string.

**Common mistake:** passing a negative index to `substring`.

**Wrong**

```js
const code = "order-4471";

console.log(code.«substring»(-4));
```

**Output**

```text
order-4471
```

**Fix**

```js
const code = "order-4471";

console.log(code.«slice»(-4));
```

`substring` treated `-4` as `0`, so it returned the whole string. `slice` counts a negative index from the end, so `slice(-4)` gives the last four characters.

<!-- task -->

## Searching inside text

**Code**

```js
const subject = "Re: Invoice for March";

console.log(subject.indexOf("Invoice"));
console.log(subject.indexOf("invoice"));
console.log(subject.includes("March"));
console.log(subject.startsWith("Re:"));
console.log(subject.endsWith("march"));
```

**Output**

```text
4
-1
true
true
false
```

```steps
"banana".indexOf("an") => 1
"banana".indexOf("an", 2) => 3
"banana".lastIndexOf("an") => 3
"banana".indexOf("x") => -1
```

**Rule:** `indexOf` gives the index where the text is first found, or `-1` when it is not there. `includes`, `startsWith` and `endsWith` give `true` or `false`. All four are case sensitive.

`indexOf("an", 2)` starts the search at index 2. `lastIndexOf` searches from the end.

**Common mistake:** using the result of `indexOf` as a yes or no.

**Wrong**

```js
const tags = "sale,new,summer";

if («tags.indexOf("sale")») {
  console.log("on sale");
} else {
  console.log("full price");
}
```

**Output**

```text
full price
```

**Fix**

```js
const tags = "sale,new,summer";

if («tags.includes("sale")») {
  console.log("on sale");
} else {
  console.log("full price");
}
```

`"sale"` is found at index `0`, and `0` is falsy. Text that is not found gives `-1`, which is truthy. Use `includes` for a yes or no, or compare with `!== -1`.

<!-- task -->

## split and join

**Code**

```js
const line = " tea, milk ,eggs ";
const items = line.split(",");
const clean = items.map((item) => item.trim());

console.log(items.length);
console.log(clean.join(" | "));
console.log("2024-06-01".split("-").join("/"));
console.log("tea".split("").join(" "));
```

**Output**

```text
3
tea | milk | eggs
2024/06/01
t e a
```

```steps
"a,b,c".split(",") => ["a", "b", "c"]
"a,«,»b".split(",") => ["a", "", "b"]
"a-b-c".split("-", 2) => ["a", "b"]
["x", "y"].join() => "x,y"
```

**Rule:** `split(separator)` cuts a string at each separator and returns an array of the pieces. `join(separator)` does the opposite: it glues the items of an array into one string. `trim` removes spaces, tabs and line breaks at both ends of a string.

`split("")` gives one item per character. `join()` with no argument puts a comma between the items.

`trimStart` and `trimEnd` clean one end only.

**Common mistake:** splitting an empty string.

**Wrong**

```js
const input = "";
const tags = input.split(",");

console.log(tags.length);
```

**Output**

```text
1
```

**Fix**

```js
const input = "";
const tags = input.split(",")«.filter((tag) => tag !== "")»;

console.log(tags.length);
```

`split` always returns at least one piece. An empty string gives `[""]`: an array that holds one empty string. Filter out the empty pieces.

<!-- task -->

## Replace, pad and repeat

**Code**

```js
const phone = "555 123 456";

console.log(phone.replace(" ", "-"));
console.log(phone.replaceAll(" ", "-"));
console.log("7".padStart(3, "0"));
console.log("Total".padEnd(8, ".") + "12");
console.log("=".repeat(5));
```

**Output**

```text
555-123 456
555-123-456
007
Total...12
=====
```

```steps
"a.b.c".replace(".", "/") => "a/b.c"
"a.b.c".replaceAll(".", "/") => "a/b/c"
"42".padStart(5) => "   42"
"12345".padStart(«3», "0") => "12345"
```

**Rule:** With a string as the pattern, `replace` changes only the first match, and `replaceAll` changes every match. `padStart(length, fill)` adds `fill` at the front until the string is `length` long. `padEnd` adds it at the end. `repeat(n)` gives `n` copies of the string.

`padStart` never cuts. A string that is already long enough comes back as it was. With no `fill`, it pads with spaces.

`replace` and `replaceAll` also take a regular expression. That comes in the next chapter.

**Common mistake:** using `replace` to change every match.

**Wrong**

```js
const slug = "summer sale now".«replace»(" ", "-");

console.log(slug);
```

**Output**

```text
summer-sale now
```

**Fix**

```js
const slug = "summer sale now".«replaceAll»(" ", "-");

console.log(slug);
```

`replace` stopped after the first space. `replaceAll` changes every space.

<!-- task -->

## Remember

- `slice` counts a negative index from the end. `substring` treats it as `0`.
- `indexOf` gives `-1` when nothing is found, and `0` is a match. Use `includes` for a yes or no.
- `split` always gives at least one piece, so `"".split(",")` is `[""]`. `join` glues the pieces back.
- `replace` changes the first match and `replaceAll` every match. `padStart` and `padEnd` fill up to a length.
