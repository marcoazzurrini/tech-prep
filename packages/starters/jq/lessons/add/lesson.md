# Totals with add, min and max

`add` adds up every item of an array and gives one value. `min` and `max` give the smallest and the largest item. `min_by(.field)` and `max_by(.field)` compare objects by a field and give the whole object.

## Worked example

Give the total length of the videos, in minutes.

**Input**

```json
[
  {"title": "Intro", "minutes": 4},
  {"title": "Setup", "minutes": 11},
  {"title": "Demo", "minutes": 7}
]
```

**Filter**

```jq
map(.minutes) | add
```

**Output**

```json
22
```

## Why it works

- `map(.minutes)` turns the videos into an array of numbers: `[4, 11, 7]`.
- `add` puts `+` between all the items: `4 + 11 + 7`. It gives one number, not an array.

With the same input, `max_by(.minutes)` gives the longest video as a whole object:

```json
{
  "title": "Setup",
  "minutes": 11
}
```

## When to use it

- The task says "total", "sum" or "in all": use `add`. It says "smallest", "largest", "cheapest" or "longest": use `min`, `max`, `min_by` or `max_by`.
- You get one merged object back, not a number: `add` got the objects. Pick the number first with `map(.field)`.
- `add` on an empty array gives `null`.
