# Sort with sort and sort_by

`sort` puts the items of an array in order: numbers from low to high, strings from a to z. `sort_by(.field)` orders objects by one of their fields. `reverse` turns an array around, so the highest comes first.

## Worked example

Order the players by score, highest first.

**Input**

```json
[
  {"name": "Ana", "score": 40},
  {"name": "Ben", "score": 75},
  {"name": "Cho", "score": 62}
]
```

**Filter**

```jq
sort_by(.score) | reverse
```

**Output**

```json
[
  {
    "name": "Ben",
    "score": 75
  },
  {
    "name": "Cho",
    "score": 62
  },
  {
    "name": "Ana",
    "score": 40
  }
]
```

## Why it works

- `sort_by(.score)` reads the `score` of each player and orders the players by it, lowest first. It gives whole players back.
- `reverse` turns that array around. Now the highest score is first.
- Both take a whole array and give a whole array. Do not put `.[]` before them.

## When to use it

- The task says "in order", "lowest first", "newest", "top three" or "from a to z".
- For plain numbers or strings, write `sort`: `[3, 1, 2] | sort` gives `[1, 2, 3]`.
- You get the error `Cannot index number with string "score"`: `sort_by` got one item, not the array. Remove the `.[]` before it.
