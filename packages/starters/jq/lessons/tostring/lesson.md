# Convert with tostring and tonumber

`tonumber` turns a string such as `"41"` into the number `41`. `tostring` turns any value into a string. jq never converts by itself, so you must do it before you do maths or join text.

## Worked example

Add two numbers that are stored as strings.

**Input**

```json
{"score": "41", "bonus": "9"}
```

**Filter**

```jq
(.score | tonumber) + (.bonus | tonumber)
```

**Output**

```json
50
```

`tostring` goes the other way. With the input `{"n": 5}`, the filter `"Level " + (.n | tostring)` gives:

```json
"Level 5"
```

## Why it works

- `.score | tonumber` reads the string `"41"` and gives the number `41`.
- The brackets make each side a number before `+` runs.
- Without `tonumber`, `+` joins the two strings and gives `"419"`.

## When to use it

- The task says a number is "stored as a string", or the input shows a number in quotes: use `tonumber` before maths or `<` and `>`.
- You join a number to text with `+`: use `tostring` on the number.
- You get the error `string ("41") and number (9) cannot be added`: one side is a string. Convert one of them.
- The sum looks like text glued together, such as `"419"`: both sides are strings.
