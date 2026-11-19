# Defaults with //

`a // b` gives `a` when `a` has a real value. When `a` is `null` or `false`, it gives `b`. Use it to give a default value.

A missing field gives `null`, so `//` also covers fields that are not there.

## Worked example

Give the city of every user, or `"unknown"` when there is none.

**Input**

```json
[
  {"name": "Ada", "city": "Rome"},
  {"name": "Bo"},
  {"name": "Cy", "city": null}
]
```

**Filter**

```jq
.[] | .city // "unknown"
```

**Output**

```json
"Rome"
"unknown"
"unknown"
```

## Why it works

- `.city` gives `"Rome"` for Ada. That is a real value, so `//` passes it on.
- Bo has no `city`, so `.city` gives `null`. Cy's `city` is `null`. For both, `//` gives the right side.
- Only `null` and `false` count as empty. `0` and `""` are real values, so they stay.

## When to use it

- The task says "or", "when missing", "if there is none" or "default".
- You can chain it: `.nickname // .name // "nobody"` gives the first one that has a value.
- You see `null` in the output where a default should be: add `// default` after the field. Inside `{ }` or after another operator, put it in round brackets: `{port: (.port // 80)}`.
