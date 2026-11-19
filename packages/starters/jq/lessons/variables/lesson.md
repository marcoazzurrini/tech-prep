# Name a Value with as $x

`value as $x | ...` gives a value a name. After the pipe, `$x` holds that value everywhere. Use it to keep something from the outer input while you work on an inner part.

## Worked example

Say which team each member is in.

**Input**

```json
{
  "team": "core",
  "members": ["Ada", "Bo"]
}
```

**Filter**

```jq
.team as $team | .members[] | "\(.) is in \($team)"
```

**Output**

```json
"Ada is in core"
"Bo is in core"
```

## Why it works

- `.team as $team` saves `"core"` under the name `$team`. It does not change `.`: the input is still the whole object.
- `.members[]` gives one member at a time. Now `.` is a name, and `.team` is out of reach.
- `$team` still holds `"core"`, so the string can use both values.

## When to use it

- The task joins an outer value with every inner item: a limit, a version or an owner next to a list.
- You get the error `Cannot index string with string "team"`: you moved into the inner part and then asked for an outer field. Save it with `as` first.
- You get `$team is not defined`: the name is used before the `as`, or outside its pipe.
