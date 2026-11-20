# Match Text

## Does it start or end with this text?

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

```steps
.file => "report.json"
.file «| endswith(".json")» => true
```

**Rule:** `endswith(".json")` gives `true` when the string ends with `.json`, and `false` when it does not.

`.file | startswith("report")` gives `true`. It asks the same about the start of the string.

`.file | endswith(".JSON")` gives `false`. Capital letters count. Check them first when you get a `false` you did not expect.

<!-- task -->

## Is this text anywhere inside?

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

**Rule:** `contains("disk")` gives `true` when `disk` is anywhere in the string: at the start, in the middle or at the end.

`select(.msg | contains("disk"))` keeps an item when its `msg` has `disk` in it. `startswith`, `endswith` and `contains` are tests, so they all fit inside `select`.

**Common mistake:** A misspelled key.

**Wrong**

```jq
map(select(.«mgs» | contains("disk")))
```

**Error**

```text
jq: error: null (null) and string ("disk") cannot have their containment checked
```

**Fix**

```jq
map(select(.«msg» | contains("disk")))
```

These filters work on strings only. A misspelled key gives `null`, and jq cannot look for text inside `null`. A number stops jq too.

<!-- task -->

## Match a pattern with test

**Input**

```json
["release-1.2", "pre-release", "main"]
```

**Filter**

```jq
map(select(test("release")))
```

**Output**

```json
["release-1.2", "pre-release"]
```

**Filter**

```jq
map(select(test("^release")))
```

**Output**

```json
["release-1.2"]
```

**Rule:** `test("^release")` matches a **pattern**. In a pattern, `^` is the start of the string and `$` is the end.

`test("ase$")` gives `true` when the string ends with `ase`. Letters and digits stand for themselves. Such a pattern is called a **regular expression**, or **regex**.

`test(".")` does not look for a dot. In a pattern, `.`, `*`, `+`, `?`, `(` and `[` have a special meaning. For text with those marks, use `startswith`, `endswith` or `contains`.

<!-- task -->

## Remember

- `startswith("a")`, `endswith("a")` and `contains("a")` give `true` or `false`. Capital letters count.
- Put them inside `select` to keep the items that match.
- `test("pattern")` matches a regular expression. `^` is the start of the string and `$` is the end.
- These filters need a string. On `null` or a number, jq stops with an error.
