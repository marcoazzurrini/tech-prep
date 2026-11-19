# Find Anything with ..

`..` gives the input, and then every value inside it, at any depth. Each value is its own output. Follow it with `.key?` or `select` to pick the values you want, wherever they are.

## Worked example

Give every `url` in a site map, at any depth.

**Input**

```json
{
  "site": "docs",
  "home": {"label": "Home", "url": "/"},
  "menu": [
    {"label": "Guide", "url": "/guide", "items": [
      {"label": "Install", "url": "/guide/install"}]}
  ]
}
```

**Filter**

```jq
.. | .url? | select(. != null)
```

**Output**

```json
"/"
"/guide"
"/guide/install"
```

## Why it works

- `..` gives the top object, then each object, array, string and number inside it, from top to bottom.
- `.url?` reads `url` from each object. The `?` hides the error for strings and arrays.
- An object with no `url` gives `null`. Here that is the top object. `select(. != null)` drops it.

## When to use it

- The task says "at any depth", "anywhere" or "nested", or the data is a tree.
- To pick values by kind, test the type: `.. | select(type == "number")` gives every number.
- You get the error `Cannot index string with string "url"`: you forgot the `?`.
- You get `null` in the output: add `select(. != null)`.
