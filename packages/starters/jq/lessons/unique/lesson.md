# Unique Values with unique

`unique` sorts an array and removes repeats. Each value is left once. `unique_by(.field)` works on objects: it keeps one object for each value of the field.

## Worked example

Give every country the users come from, each one once.

**Input**

```json
[
  {"name": "Ana", "country": "PT"},
  {"name": "Ben", "country": "DE"},
  {"name": "Cho", "country": "PT"}
]
```

**Filter**

```jq
map(.country) | unique
```

**Output**

```json
[
  "DE",
  "PT"
]
```

## Why it works

- `map(.country)` gives an array of countries with a repeat: `["PT", "DE", "PT"]`.
- `unique` sorts that array and drops the second `"PT"`. The output is always sorted.

With the same input, `unique_by(.country)` gives whole users: Ben for `"DE"` and Ana for `"PT"`. It keeps the first user of each country. The output is sorted by country.

## When to use it

- The task says "each one once", "distinct", "different" or "without repeats".
- To count the different values, add `length`: `unique | length`.
- A value shows up twice in your output: you forgot `unique`.
- You get whole objects back but wanted one field: `unique` compares whole objects. Pick the field first with `map(.field)`.
