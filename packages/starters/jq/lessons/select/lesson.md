# Keep Items with select

`select(test)` passes a value on when the test is true. It drops the value when the test is false. Use it on a stream of items, after `.[]` or inside `map`.

## Worked example

Give the titles of the books that cost less than 10.

**Input**

```json
[
  {"title": "Dune", "price": 9},
  {"title": "Emma", "price": 12},
  {"title": "Ulysses", "price": 7}
]
```

**Filter**

```jq
.[] | select(.price < 10) | .title
```

**Output**

```json
"Dune"
"Ulysses"
```

## Why it works

- `.[]` gives one book at a time.
- `select(.price < 10)` keeps a book only when its price is under 10. It passes the whole book on, not `true`.
- `.title` then runs once for each book that is left.

## When to use it

- The task says "only", "every ... that", "where" or "with": you need some items, not all.
- You want to keep the array: write `map(select(test))`.
- You get the error `Cannot index array with string "price"`: `select` got the whole array. Put `.[]` before it.
