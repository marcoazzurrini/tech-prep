# Check Types with type

`type` gives the kind of a value as a string. There are six answers: `"number"`, `"string"`, `"array"`, `"object"`, `"boolean"` and `"null"`. Compare the answer with `==` to test what kind of value you have.

## Worked example

Keep the sensor readings that are numbers.

**Input**

```json
[21.5, "error", 19, null]
```

**Filter**

```jq
map(select(type == "number"))
```

**Output**

```json
[
  21.5,
  19
]
```

## Why it works

- `map` runs the test on one reading at a time.
- `type` gives `"number"` for 21.5 and 19. It gives `"string"` for `"error"` and `"null"` for `null`.
- `type == "number"` is then `true` or `false`, and `select` keeps the readings where it is `true`.
- For a field, pipe into it: `.id | type`.

## When to use it

- The task says "only the numbers", "is a string", "is a list", or "sometimes ... and sometimes ...": one field holds values of more than one kind.
- You get `Cannot index string with string "message"` or `Cannot iterate over number`: a value is not the kind you thought. Test its `type` first.
- A size test keeps text by mistake: jq sorts every string above every number, so `"abc" > 5` is `true`. Check the type as well.
