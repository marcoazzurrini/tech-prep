# Comparing and Sorting Text

## Ignoring case

**Code**

```js
const names = ["bea", "Zoe", "adam", "Carl"];

console.log(names.toSorted().join(" "));

const byLower = names.toSorted((a, b) => {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return x < y ? -1 : x > y ? 1 : 0;
});

console.log(byLower.join(" "));
console.log("ADA".toLowerCase() === "ada");
```

**Output**

```text
Carl Zoe adam bea
adam bea Carl Zoe
true
```

```steps
"Zoe" < "adam" => true
"Z".charCodeAt(0) < "a".charCodeAt(0) => true
"zoe" < "adam" => false
"émile" > "zoe" => true
```

**Rule:** `<` and the default `sort` compare strings by character code, so every capital letter comes before every small one. To ignore case, compare the `toLowerCase()` of both sides.

`"émile" > "zoe"` gives `true`. The code of `é` is 233, above every letter from `a` to `z`. So `<` puts accented letters after `z`.

**Common mistake:** changing the case of one side only.

**Wrong**

```js
const saved = "Ada@Mail.com";
const typed = "ada@mail.com";

console.log(typed.toLowerCase() === saved);
```

**Output**

```text
false
```

**Fix**

```js
const saved = "Ada@Mail.com";
const typed = "ada@mail.com";

console.log(typed.toLowerCase() === saved«.toLowerCase()»);
```

`saved` still held capital letters. Change both sides to the same case before you compare.

<!-- task -->

## localeCompare

**Code**

```js
const people = ["Zoë", "émile", "Adam", "eva"];

console.log(people.toSorted().join(" "));
console.log(people.toSorted((a, b) => a.localeCompare(b, "en")).join(" "));
console.log("apple".localeCompare("banana", "en"));
console.log("pear".localeCompare("pear", "en"));
```

**Output**

```text
Adam Zoë eva émile
Adam émile eva Zoë
-1
0
```

```steps
Math.sign("apple".localeCompare("banana", "en")) => -1
Math.sign("banana".localeCompare("apple", "en")) => 1
Math.sign("a".localeCompare("A", "en")) => -1
```

**Rule:** `a.localeCompare(b, "en")` compares two strings the way a dictionary in that language does: letters first, then accents, then case. It returns a negative number when `a` comes first, a positive number when `b` comes first, and `0` when they are equal. So it works as a compare function as it is.

`"en"` is a **locale**: a code that names a language and its rules. Always pass one. Without it, the order depends on the settings of the computer.

Test the result with `< 0` or `> 0`, never with `=== -1`. The standard only promises a negative or a positive number.

<!-- task -->

## Numbers and accents

**Code**

```js
const files = ["page10.txt", "page9.txt", "page1.txt"];
const natural = files.toSorted((a, b) =>
  a.localeCompare(b, "en", { numeric: true })
);

console.log(natural.join(" "));
console.log("Ana".localeCompare("ana", "en", { sensitivity: "base" }));
console.log("Ana".localeCompare("Āna", "en", { sensitivity: "base" }));
console.log("Ana".localeCompare("Āna", "en", { sensitivity: "accent" }));
```

**Output**

```text
page1.txt page9.txt page10.txt
0
0
-1
```

**Rule:** The third argument of `localeCompare` holds options. `numeric: true` compares a run of digits as one number, so `9` comes before `10`. `sensitivity` says which differences count: `"base"` ignores case and accents, and `"accent"` ignores case only.

`a.localeCompare(b, "en", { sensitivity: "base" }) === 0` tests that two strings are equal when case and accents are ignored.

`new Intl.Collator("en", { numeric: true })` takes the same locale and options. Its `compare` method is a ready compare function, and it is faster for a long list.

**Common mistake:** sorting version names without `numeric`.

**Wrong**

```js
const versions = ["v2", "v10", "v1"];
const sorted = versions.toSorted((a, b) => a.localeCompare(b, "en"));

console.log(sorted.join(" "));
```

**Output**

```text
v1 v10 v2
```

**Fix**

```js
const versions = ["v2", "v10", "v1"];
const sorted = versions.toSorted((a, b) => a.localeCompare(b, "en"«, { numeric: true }»));

console.log(sorted.join(" "));
```

Without the option, digits are compared one at a time, and `"1"` comes before `"2"`. With `numeric: true`, `10` is read as ten.

<!-- task -->

## Remember

- `<` compares character codes. Capitals come before small letters, and accented letters come after `z`.
- `a.localeCompare(b, "en")` gives a negative number, `0` or a positive number, by the rules of a language. Pass it to `toSorted` as it is.
- `{ numeric: true }` puts `"9"` before `"10"`. `{ sensitivity: "base" }` ignores case and accents.
- Always pass a locale such as `"en"`, so the result is the same on every computer.
