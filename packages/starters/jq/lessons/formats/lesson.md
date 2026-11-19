# Rows with @csv and @tsv

`@csv` turns an array into one line of a CSV table. `@tsv` does the same with a tab between the values. Use them with the `-r` flag, so jq prints the line as plain text.

## Worked example

Print one CSV line for each user. jq runs with `-r`.

**Input**

```json
[
  {"name": "Ada", "age": 36},
  {"name": "Bo", "age": 41}
]
```

**Filter**

```jq
.[] | [.name, .age] | @csv
```

**Output**

```text
"Ada",36
"Bo",41
```

With `@tsv` in place of `@csv`, each line has a tab and no quotes: `Ada`, a tab, then `36`.

## Why it works

- `.[]` gives one user at a time.
- `[.name, .age]` builds the row: an array with the values in column order.
- `@csv` turns that array into one string. Strings get double quotes. Numbers do not.
- `-r` prints the string as plain text. Without it you get `"\"Ada\",36"`.

## When to use it

- The task says "CSV", "a tab between the values", "one line for each" or "for a sheet".
- You get the error `cannot be csv-formatted, only array`: `@csv` got an object. Build an array with `[ ]` first.
- You get the error `is not valid in a csv row`: `@csv` got an array of arrays. Put `.[]` before it.
