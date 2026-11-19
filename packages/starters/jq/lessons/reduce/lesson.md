# Fold with reduce

`reduce .[] as $x (start; update)` walks the items and carries one result along. The result begins as `start`. For each item, the result becomes `update`, where `.` is the result so far and `$x` is the item.

## Worked example

Count how many times each answer was given.

**Input**

```json
["yes", "no", "yes", "yes"]
```

**Filter**

```jq
reduce .[] as $vote ({}; .[$vote] += 1)
```

**Output**

```json
{
  "yes": 3,
  "no": 1
}
```

## Why it works

- `.[] as $vote` gives the answers one at a time, each under the name `$vote`.
- `{}` is the start: an empty object.
- `.[$vote] += 1` adds 1 to the key named by the answer. A key that is missing counts as 0. Inside the brackets, `.` is the object built so far, not the input.

## When to use it

- The task asks for one result built step by step: a count for each key, a lookup object, a balance, a running total.
- The start must fit the result: `0` for a number, `{}` for an object, `[]` for an array.
- You get the error `Cannot index number with string "yes"`: the start is a number, but the update treats it as an object.
