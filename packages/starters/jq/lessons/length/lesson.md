# Count with length

`length` gives the size of a value. For an array it is the number of items. For an object it is the number of keys. For a string it is the number of characters.

To count matches, keep them first, then take the length.

## Worked example

Count the tasks that are done.

**Input**

```json
[
  {"task": "Write tests", "done": true},
  {"task": "Fix bug", "done": false},
  {"task": "Ship", "done": true}
]
```

**Filter**

```jq
map(select(.done)) | length
```

**Output**

```json
2
```

## Why it works

- `map(select(.done))` gives a new array with only the tasks that are done.
- `length` then counts the items of that array.
- `length` takes no argument. It works on its input, so put it after a `|`.

## When to use it

- The task says "how many", "count" or "the number of".
- You need the size of each item: write `map(length)`, or `map(.name | length)` for one field.
- You get several numbers in place of one count: you wrote `.[] | select(...) | length`. That runs `length` once for each item. Keep the matches in one array with `map(select(...))`, then use `length`.
