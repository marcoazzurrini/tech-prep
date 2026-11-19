# Remove with del

`del(path)` gives the input back without the value at that path. It removes a key from an object, or an item from an array. Everything else stays.

## Worked example

Remove the `private` key and the first entry of `files` from a package file.

**Input**

```json
{
  "name": "app",
  "private": true,
  "files": ["dist", "src", "docs"]
}
```

**Filter**

```jq
del(.private, .files[0])
```

**Output**

```json
{
  "name": "app",
  "files": [
    "src",
    "docs"
  ]
}
```

## Why it works

- `del` takes a path, the same kind you use to read a value. It gives back the input, not the removed value.
- `.private` points at a key, so the key and its value go.
- `.files[0]` points at an array item. The items after it move up.
- The comma gives `del` two paths in one go.

## When to use it

- The task says "remove", "without", "drop" or "hide", and wants the rest of the data back.
- To remove a key from every item of an array, write `map(del(.key))` or `del(.[].key)`.
- You get the error `Invalid path expression`: you gave `del` a value, as in `del("private")`. Give it a path: `del(.private)`.
