# Totals, Smallest and Largest

## Add up an array

**Input**

```json
{"shop": "north", "sales": [120, 80, 45]}
```

**Filter**

```jq
.sales | add
```

**Output**

```json
245
```

```steps
.sales => [120, 80, 45]
.sales «| add» => 245
```

**Rule:** `add` gives the sum of an array of numbers.

`[] | add` gives `null`. An empty array has nothing to add.

<!-- task -->

## The total of a field

**Input**

```json
[
  {"item": "tea", "price": 3},
  {"item": "milk", "price": 2},
  {"item": "bread", "price": 4}
]
```

**Filter**

```jq
map(.price) | add
```

**Output**

```json
9
```

```steps
map(.price) => [3, 2, 4]
map(.price) «| add» => 9
```

**Rule:** For numbers inside objects, make an array of the numbers with `map`. Then add them up.

**Common mistake:** The `map` step is left out.

**Wrong**

```jq
add
```

**Output**

```json
{"item": "bread", "price": 4}
```

**Fix**

```jq
«map(.price) | »add
```

jq tried to add the objects themselves. An object where you expect a number means the `map` step is missing.

<!-- task -->

## Smallest and largest

**Input**

```json
[
  {"item": "tea", "price": 3},
  {"item": "milk", "price": 2},
  {"item": "bread", "price": 4}
]
```

**Filter**

```jq
max_by(.price)
```

**Output**

```json
{"item": "bread", "price": 4}
```

**Filter**

```jq
max_by(.price) | .item
```

**Output**

```json
"bread"
```

**Rule:** `max_by(.price)` gives the whole object with the largest price. `min_by(.price)` gives the one with the smallest.

`[14, 9, 21] | min` gives `9`, and `[14, 9, 21] | max` gives `21`. Use `min` and `max` on an array of numbers.

`min_by(.price)` gives the milk object here.

<!-- task -->

## Remember

- `add` gives the sum of an array of numbers. For an empty array it gives `null`.
- For a field inside objects, take the numbers first: `map(.price) | add`.
- `min` and `max` give the smallest and the largest number of an array.
- `min_by(.field)` and `max_by(.field)` give the whole object with the smallest or largest field.
