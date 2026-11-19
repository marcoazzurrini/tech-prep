# Text with \( )

Inside a string, `\(filter)` is replaced by the output of the filter. The rest of the string stays as it is. Use it to build text from fields.

## Worked example

Build a short weather line from three fields.

**Input**

```json
{
  "city": "Oslo",
  "temp": 4,
  "unit": "C"
}
```

**Filter**

```jq
"\(.city): \(.temp) \(.unit)"
```

**Output**

```json
"Oslo: 4 C"
```

## Why it works

- The quotes start a string. Plain characters, like `: ` and the space, are kept.
- `\(.city)` runs `.city` on the input and puts `Oslo` in its place.
- `\(.temp)` gives a number. jq turns it into text for you.

## When to use it

- The task asks for a line, a sentence or a label: fixed text with values in it. The form may look like `name@version`.
- The output shows `(.city)` as plain text. You forgot the `\` before the `(`.
- The output has quotes around it. That is normal: jq prints a string as JSON.
