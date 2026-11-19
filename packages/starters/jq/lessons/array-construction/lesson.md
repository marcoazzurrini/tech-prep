# Collect into an Array with [ ]

`[ ... ]` collects every output of the filter inside it into one array. `.[]` splits an array into many outputs. `[ ]` puts many outputs back into one value.

## Worked example

Give one array with the title of every song.

**Input**

```json
[
  {"title": "Blue", "seconds": 201},
  {"title": "Home", "seconds": 187},
  {"title": "Rain", "seconds": 240}
]
```

**Filter**

```jq
[.[] | .title]
```

**Output**

```json
[
  "Blue",
  "Home",
  "Rain"
]
```

## Why it works

- `.[]` gives one song at a time.
- `.title` runs once for each song. That makes three outputs.
- `[ ]` goes around the whole filter. It collects the three outputs into one array.

## When to use it

- The task says "an array of", "a list of" or "one array".
- You see many outputs, but the task wants one value. Put `[ ]` around the whole filter.
- The filter inside gives no output at all. Then the result is the empty array `[]`.
