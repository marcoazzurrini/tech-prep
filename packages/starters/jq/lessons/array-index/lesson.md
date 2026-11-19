# Array Items by Index

`.[0]` is the first item of an array. Counting starts at 0, so `.[1]` is the second item. `.[-1]` is the last item. `.[1:3]` is a slice: a shorter array.

## Worked example

Give the second and the third day of the week.

**Input**

```json
["mon", "tue", "wed", "thu", "fri"]
```

**Filter**

```jq
.[1:3]
```

**Output**

```json
[
  "tue",
  "wed"
]
```

## Why it works

- `.[1:3]` starts at index 1 and stops before index 3. It gives an array.
- You can leave one side out. `.[:2]` is the first two items. `.[3:]` is every item from index 3 on. `.[-2:]` is the last two items.
- `.[0]` gives one item, not an array: here `"mon"`. `.[-1]` counts from the end: here `"fri"`.

## When to use it

- The task says "first", "last", "second" or "newest": use one index. It says "the first three" or "all but the first": use a slice.
- The array sits in a field: write `.days[0]`. To read a field of that item, go on with `.days[0].name`.
- You get the error `Cannot index array with string "name"`: you read a field from the array itself. Pick an item first. An index past the end gives `null`.
