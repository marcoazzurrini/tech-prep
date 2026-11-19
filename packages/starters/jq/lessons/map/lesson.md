# Change Every Item with map

`map(f)` runs the filter `f` on every item of an array. It gives a new array with the results, in the same order. It is short for `[.[] | f]`.

## Worked example

Give the name of every city, as one array.

**Input**

```json
[
  {"city": "Oslo", "country": "NO"},
  {"city": "Lima", "country": "PE"},
  {"city": "Kyoto", "country": "JP"}
]
```

**Filter**

```jq
map(.city)
```

**Output**

```json
[
  "Oslo",
  "Lima",
  "Kyoto"
]
```

## Why it works

- `map` takes one city object at a time.
- Inside the brackets, `.` is that one item. So `.city` reads the name of one city.
- `map` collects every result into a new array. The array has as many items as the input.

## When to use it

- The task says "for every item" or "each item", and the answer is **one array**.
- You get the error `Cannot index array with string "city"`: you wrote `.city` on the whole array. Put it inside `map( )`.
- You get the error `Cannot iterate over`: the input of `map` is not an array. Go to the array first, as in `.items | map(.name)`.
