# Many Inputs with -s

A file may hold many JSON values, one per line. jq runs the filter once for each value. The `-s` flag reads all the values into one array first. Then the filter runs once, on that array.

## Worked example

Give one array with the user of every visit.

**Input**

```json
{"user": "ada", "page": "/home"}
{"user": "bo", "page": "/docs"}
{"user": "cy", "page": "/home"}
```

**Command**

```sh
jq -s 'map(.user)' visits.jsonl
```

**Output**

```json
[
  "ada",
  "bo",
  "cy"
]
```

## Why it works

- The input is three values, not one array.
- `-s` puts them in one array: `[{...}, {...}, {...}]`.
- `map(.user)` then runs on that array and gives one array back.

## When to use it

- The task says "one JSON object per line", and asks for a count, one array, or the first or last value.
- You need to look at all the values together.
- You get one answer per line where you wanted one answer: you forgot `-s`. For example, `length` gives the number of keys of each object.
- You get the error `Cannot index object with number`: the filter got one object, not the array.
