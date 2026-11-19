# Missing Data with ?

Real data is not always clean. A step like `.name` stops jq with an error when its input is not an object. A `?` after the step hides that error: the step gives nothing, and jq goes on.

## Worked example

Give the name of every guest that has one.

**Input**

```json
[
  {"name": "Ana"},
  "walk-in",
  {"name": "Bo"},
  7
]
```

**Filter**

```jq
.[] | .name?
```

**Output**

```json
"Ana"
"Bo"
```

## Why it works

- `.[]` gives four items. Two of them are not objects.
- `.name` on `"walk-in"` fails with `Cannot index string with string "name"`. jq would stop there.
- `.name?` gives no output for those two items. `.[]?` works the same way: it gives nothing when its input is not an array or an object.

## When to use it

- The task says "skip", "when there is one", or that some values have the wrong type.
- jq prints part of the output and then stops with `Cannot index string` or `Cannot iterate over null`.
- You do not need `?` for a field that is missing from an object. That gives `null`, with no error.
