# Objects as Lists with to_entries

`to_entries` turns an object into an array. Each key becomes one `{key, value}` pair. Now you can use `map`, `select` and `sort_by` on the keys and values. `from_entries` turns such an array back into an object. `with_entries(f)` does all three steps: `to_entries | map(f) | from_entries`.

## Worked example

Turn a settings object into `name=value` lines.

**Input**

```json
{"host": "db1", "port": 5432, "debug": false}
```

**Filter**

```jq
to_entries | map("\(.key)=\(.value)")
```

**Output**

```json
[
  "host=db1",
  "port=5432",
  "debug=false"
]
```

## Why it works

- `to_entries` gives three pairs. The first is `{"key": "host", "value": "db1"}`.
- `map(...)` runs once for each pair. `.key` is the name and `.value` is what it holds.

To keep an object, use `with_entries`. With the same input, `with_entries(select(.value != false))` gives the object without `debug`.

## When to use it

- The data you need is in the **keys** of an object: names, ids or dates used as keys.
- The task says "for each key", or asks you to keep, drop or rename keys.
- You wrote `.[]` on an object and lost the keys: `.[]` gives only the values. Use `to_entries`.
