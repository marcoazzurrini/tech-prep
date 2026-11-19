# Match Text with test

`test("regex")` looks at a string. It gives `true` when the string matches the regex and `false` when it does not. For simple cases you need no regex: `startswith`, `endswith` and `contains` each take plain text.

## Worked example

Give the strings that are made of digits only.

**Input**

```json
["42", "7a", "300", "x9"]
```

**Filter**

```jq
.[] | select(test("^[0-9]+$"))
```

**Output**

```json
"42"
"300"
```

## Why it works

- `test` gives `true` or `false`, so it fits inside `select`.
- `[0-9]+` means one or more digits.
- `^` is the start of the string and `$` is the end. With both, the whole string must match. Without them, `"7a"` would pass, because it has a digit somewhere.

The simple forms work the same way:

```jq
startswith("v")
endswith(".log")
contains("error")
```

## When to use it

- The task says "starts with", "ends with", "has the text" or "looks like": you need a test on text.
- The test is on a field: write `select(.name | test("..."))`.
- You get the error `cannot be matched, as it is not a string`: `test` got an object or an array. Pipe the string field into it first.
