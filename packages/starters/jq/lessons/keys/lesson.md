# Object Keys with keys and has

`keys` gives the keys of an object as an array, in sorted order. `has("k")` tests whether the object has the key `k`. It gives `true` even when the value of that key is `null`.

## Worked example

List the names of the settings.

**Input**

```json
{"port": 8080, "host": "localhost", "debug": null}
```

**Filter**

```jq
keys
```

**Output**

```json
[
  "debug",
  "host",
  "port"
]
```

On the same input, `has("debug")` gives `true` and `has("user")` gives `false`.

## Why it works

- `keys` reads the names only, not the values. It sorts them from a to z.
- `has("debug")` looks for the key itself. The value `null` does not matter.
- `.debug` gives `null` here, and `.user` gives `null` too. Only `has` can tell them apart.

## When to use it

- The task asks for the "names", "fields" or "keys" of an object, and the names are not known before.
- The task says "has a field", "is present" or "is missing", and a value may be `null` or `false`.
- You get `Cannot check whether array has a string key`: `has` got the whole array. Put `.[]` or `map` before it.
