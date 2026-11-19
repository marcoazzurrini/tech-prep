# Totals, Smallest and Largest

You have a list of numbers: prices, sizes or times. Often you want one number that says something about all of them: the total, the smallest or the largest.

## Add up an array

`add` is a named filter, like `length`. Give it an array of numbers. It gives back their sum.

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

`.sales` takes the array. Then `add` adds up its items: 120 plus 80 plus 45.

An empty array has nothing to add. For `[]`, `add` gives `null`.

<!-- task -->

## The total of a field

The numbers are often inside objects. Then you need two steps. First make an array of the numbers with `map`. Then add them up.

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

- `map(.price)` gives `[3, 2, 4]`.
- `add` gives `9`.

A common mistake is to leave out the `map` step. On the same input, `add` alone prints this:

```json
{"item": "bread", "price": 4}
```

jq tried to add the objects themselves. The result is one object, not a total. When you see an object where you expect a number, the `map` step is missing.

<!-- task -->

## Smallest and largest

`min` gives the smallest item of an array of numbers. `max` gives the largest. For `[14, 9, 21]`, `min` gives `9` and `max` gives `21`.

For objects, use `min_by` and `max_by`. Put a field in round brackets, as with `map`. jq runs it on each item and compares what it gives.

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

Read `max_by(.price)` as "the item with the largest price". You get the whole object, not only the price. To take one field from it, add a step: `max_by(.price) | .item` gives `"bread"`.

`min_by(.price)` works the same way. Here it gives the milk object.

<!-- task -->

## Remember

- `add` gives the sum of an array of numbers. For an empty array it gives `null`.
- For a field inside objects, take the numbers first: `map(.price) | add`.
- `min` and `max` give the smallest and the largest number of an array.
- `min_by(.field)` and `max_by(.field)` give the whole object with the smallest or largest field.
- An object where you expect a number? The `map` step is missing.
