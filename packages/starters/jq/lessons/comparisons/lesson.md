# Tests with ==, < and and

A comparison looks at two values and gives `true` or `false`. `==` means equal and `!=` means not equal. `<`, `<=`, `>` and `>=` compare by size. `and`, `or` and `not` join tests into one bigger test.

## Worked example

Say whether the fan must start. It starts when the room is hotter than the limit and the mode is `"auto"`.

**Input**

```json
{"temp": 31, "limit": 30, "mode": "auto"}
```

**Filter**

```jq
.temp > .limit and .mode == "auto"
```

**Output**

```json
true
```

## Why it works

- `.temp > .limit` compares two fields. 31 is more than 30, so it gives `true`.
- `.mode == "auto"` gives `true` when the two strings are the same.
- `and` gives `true` only when both sides are `true`. `or` needs one side only.
- `not` turns a test around. It comes after a pipe: `.done | not`.

## When to use it

- The task says "equal", "more than", "at least", "between", "both", "either" or "not".
- The task wants `true` or `false`, or a test inside `select`.
- `select` keeps every item: you wrote `=`. One `=` sets a value. A test needs `==`.
