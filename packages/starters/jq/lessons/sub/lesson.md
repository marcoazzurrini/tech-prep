# Replace Text with sub and gsub

`sub("a"; "b")` replaces the first match of `a` with `b`. `gsub("a"; "b")` replaces every match. The first argument is a regex. `ascii_downcase` and `ascii_upcase` change the case of the letters.

## Worked example

Turn a title into a slug: lower case, with `-` in place of each space.

**Input**

```json
{"title": "Hello World Again"}
```

**Filter**

```jq
.title | ascii_downcase | gsub(" "; "-")
```

**Output**

```json
"hello-world-again"
```

## Why it works

- `ascii_downcase` gives the string with every letter in lower case.
- `gsub(" "; "-")` replaces every space with `-`. The two arguments have a `;` between them, not a comma.
- `sub(" "; "-")` would change only the first space. On the title above it gives `"Hello-World Again"`.

## When to use it

- The task says "replace", "remove", "in place of" or "clean": use `sub` or `gsub`. To remove text, replace it with `""`.
- The task says "every" or "all": use `gsub`. It says "the first" or "at the start": use `sub`. `^` in the regex means the start of the string.
- Only the first match changed: you wrote `sub` and you need `gsub`.
- You get the error `cannot be matched, as it is not a string`: the input is not a string. Read the field first.
