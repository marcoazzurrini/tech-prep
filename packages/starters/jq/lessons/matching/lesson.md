# Match Text

`==` tells you if two strings are exactly the same. Often you want to know less than that. Does the file name end with `.json`? Does the message talk about a timeout? For that you need filters that look at a part of a string.

## Does it start or end with this text?

`startswith` and `endswith` look at one end of a string. They give `true` or `false`:

**Input**

```json
{"file": "report.json", "size": 2048}
```

**Filter**

```jq
.file | endswith(".json")
```

**Output**

```json
true
```

- `.file` takes the string.
- `endswith(".json")` asks: are the last characters of this string `.json`?

Write the text you look for in double quotes, inside the parentheses. `startswith("report")` asks the same question about the start of the string. Here it gives `true` too.

Capital letters count. `endswith(".JSON")` gives `false` here, because `.JSON` and `.json` are not the same text. When you get `false` and did not expect it, check the capital letters first.

<!-- task -->

## Is this text anywhere inside?

`contains` gives `true` when the text is anywhere in the string: at the start, in the middle or at the end.

All three filters are tests, so they fit inside `select`. This keeps the messages that talk about a disk:

**Input**

```json
[
  {"id": 1, "msg": "disk almost full"},
  {"id": 2, "msg": "user signed in"},
  {"id": 3, "msg": "new disk added"}
]
```

**Filter**

```jq
map(select(.msg | contains("disk")))
```

**Output**

```json
[
  {"id": 1, "msg": "disk almost full"},
  {"id": 3, "msg": "new disk added"}
]
```

Inside `select`, `.msg` takes the string of one item. Then `contains("disk")` gives `true` or `false` for it.

These filters work on strings only. Give one a number or `null`, and jq stops. With a misspelled key, `.mgs | contains("disk")`, you get:

```text
jq: error: null (null) and string ("disk") cannot have their containment checked
```

Read it as "I cannot look for text inside `null`". Check the spelling of the key.

<!-- task -->

## Match a pattern with test

`test` is a fourth filter of this kind. It takes a **pattern**: a short text that describes what a string must look like. Such a pattern is called a **regular expression**, or **regex** for short. Regex is a big subject. Three pieces take you far:

- Letters and digits stand for themselves. `test("rel")` is true when `rel` is anywhere in the string.
- `^` stands for the start of the string. `test("^rel")` is true when the string starts with `rel`.
- `$` stands for the end of the string. `test("ase$")` is true when the string ends with `ase`.

**Input**

```json
["release-1.2", "pre-release", "main"]
```

**Filter**

```jq
map(select(test("^release")))
```

**Output**

```json
["release-1.2"]
```

`"pre-release"` has `release` in it, but not at the start. So `^release` does not match it.

Take care: in a pattern, marks such as `.`, `*`, `+`, `?`, `(` and `[` have a special meaning. When your text has them, use `startswith`, `endswith` or `contains`. They take the text as it is.

<!-- task -->

## Remember

- `startswith("a")`, `endswith("a")` and `contains("a")` give `true` or `false`.
- Capital letters count: `"Error"` does not match `"error"`.
- Put them inside `select` to keep the items that match.
- `test("pattern")` matches a regular expression. `^` is the start of the string and `$` is the end.
- These filters need a string. On `null` or a number, jq stops with an error.
