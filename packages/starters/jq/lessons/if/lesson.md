# Choose with if

`if test then a else b end` gives `a` when the test is true. It gives `b` when the test is false. Use it when the output depends on a value.

## Worked example

Give `"pass"` when the score is 50 or more, and `"fail"` when it is less.

**Input**

```json
{"name": "Ada", "score": 72}
```

**Filter**

```jq
if .score >= 50 then "pass" else "fail" end
```

**Output**

```json
"pass"
```

## Why it works

- `.score >= 50` is the test. 72 is at least 50, so it is true.
- `then "pass"` is the answer for a true test. `else "fail"` is the answer for a false test.
- `end` closes the `if`. Every `if` needs one.
- For more than two cases, add `elif`: `if . < 0 then "low" elif . < 10 then "mid" else "high" end`. jq takes the first test that is true.

## When to use it

- The task says "when ... otherwise", "depending on", "or else", or gives a label for each range of values.
- You get `syntax error, unexpected end of file`: the `end` is missing.
- `//` is not enough: it only replaces `null` and `false`. An empty string or a 0 needs `if`.
