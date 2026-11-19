# Change in Place with |=

`path |= f` changes one value and keeps everything else. It runs `f` on the old value at the path and puts the result back. `=` sets a fixed value, and `+=` adds to the old value.

## Worked example

Change three fields of a user and keep the whole user.

**Input**

```json
{
  "name": "ada",
  "visits": 4,
  "plan": "free"
}
```

**Filter**

```jq
.name |= ascii_upcase | .visits += 1 | .plan = "pro"
```

**Output**

```json
{
  "name": "ADA",
  "visits": 5,
  "plan": "pro"
}
```

## Why it works

- `.name |= ascii_upcase` runs `ascii_upcase` on the old name. On the right of `|=`, `.` is the old value at the path.
- `.visits += 1` adds 1 to the old number. It is short for `.visits |= . + 1`.
- `.plan = "pro"` sets a fixed value. The old value does not matter.
- Each step gives the whole object back, so `|` can chain them.

## When to use it

- The task says "change", "set", "add to" or "replace", and wants the rest of the data back.
- You get only one value, such as `5`, and not the whole object: you wrote `.visits + 1`. Write `.visits += 1`.
- The path can reach many values: `.[].price |= . * 2` changes every price in an array.
