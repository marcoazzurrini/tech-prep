# Split and Join Strings

`split(",")` cuts a string into an array of parts. It cuts at every place where the separator is. `join(",")` does the reverse: it glues an array of strings into one string.

## Worked example

Turn a list of tags in one string into an array.

**Input**

```json
{"tags": "red,green,blue"}
```

**Filter**

```jq
.tags | split(",")
```

**Output**

```json
[
  "red",
  "green",
  "blue"
]
```

`join` goes the other way. On that array, `join(" + ")` gives:

```json
"red + green + blue"
```

## Why it works

- `.tags` reads the string.
- `split(",")` cuts the string at each comma. The commas are gone. The parts come back as one array.
- `join(" + ")` puts the text ` + ` between the items and gives one string.

## When to use it

- The task says "the parts of", "separated by" or "the text after the last dot": use `split`, then pick a part with an index.
- The task says "as one string" or "with a comma between them": use `join`.
- You get the error `Cannot iterate over string`: `join` got a string. It needs an array.
- You get the error `split input and separator must be strings`: `split` got an array. Give it one string.
