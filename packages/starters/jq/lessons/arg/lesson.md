# Pass Values with --arg

`--arg name value` gives the filter a variable `$name`. Its value is always a string. `--argjson name value` passes a JSON value, such as a number. With `-n`, jq runs with no input.

## Worked example

Give the name of every person who lives in the city you pass in.

**Input**

```json
[
  {"name": "Ada", "city": "Oslo"},
  {"name": "Bo", "city": "Rome"},
  {"name": "Cy", "city": "Oslo"}
]
```

**Command**

```sh
jq --arg city Oslo '.[] | select(.city == $city) | .name' people.json
```

**Output**

```json
"Ada"
"Cy"
```

## Why it works

- `--arg city Oslo` makes the variable `$city`. It holds the string `"Oslo"`.
- `select(.city == $city)` keeps a person when their city equals that string.
- The value is outside the filter. To ask for Rome, change one word.

A number needs `--argjson`. With `-n`, you can build JSON from arguments alone:

```sh
jq -n --argjson port 8080 '{port: $port}'
```

## When to use it

- The task says "pass", "given" or "from a shell variable".
- The value is a number, `true` or other JSON: use `--argjson`.
- You get no output where you expect some: you passed a number with `--arg`. The string `"20"` is not the number `20`.
- You get the error `$city is not defined`: the flag is missing.
