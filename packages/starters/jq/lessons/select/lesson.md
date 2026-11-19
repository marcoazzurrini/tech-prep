# Keep Only Some Items

A list often holds more than you want. You want only the failed builds, or only the adults. A test answers yes or no for one item. Now you use a test to decide which items stay.

## select keeps or drops a value

`select` takes a test between round brackets. It runs the test on its input.

- When the test gives `true`, `select` passes the input on, unchanged.
- When the test gives `false`, `select` gives no output. The value is dropped.

Use it on each item, after `.[]`:

**Input**

```json
[
  {"name": "Ada", "age": 36},
  {"name": "Bo", "age": 15},
  {"name": "Cy", "age": 52}
]
```

**Filter**

```jq
.[] | select(.age >= 18)
```

**Output**

```json
{"name": "Ada", "age": 36}
{"name": "Cy", "age": 52}
```

`.[]` gives each person. `select` runs once for each. For Bo the test is false, so Bo is dropped.

The output is the whole item, not `true` or `false`. The test only decides.

<!-- task -->

## Keep an array with map

`.[] | select(...)` gives separate outputs. To get one array, put `select` inside `map`. The input is the same as above:

**Filter**

```jq
map(select(.age >= 18))
```

**Output**

```json
[
  {"name": "Ada", "age": 36},
  {"name": "Cy", "age": 52}
]
```

An array goes in. A shorter array comes out. `map` runs `select` on every item and collects the items that pass.

A common mistake is to use `select` on the whole array:

```jq
select(.age >= 18)
```

```text
jq: error: Cannot index array with string "age"
```

Here `select` got the array, not one item. An array has no `age`. The test must run on each item, so put `select` after `.[]` or inside `map`.

<!-- task -->

## Carry on after select

What `select` passes on goes to the next step, like any output. So you can keep some items and then take one field from each. The input is the same again:

**Filter**

```jq
.[] | select(.age >= 18) | .name
```

**Output**

```json
"Ada"
"Cy"
```

Square brackets around the whole chain collect the names into one array:

```jq
[.[] | select(.age >= 18) | .name]
```

```json
["Ada", "Cy"]
```

The order of the steps matters. `select` comes first, while the item still has its `age`. After `.name`, only a string is left, and the test would have nothing to look at.

<!-- task -->

## Remember

- `select(test)` passes a value on when the test is true, and drops it when the test is false.
- It works on one item: `.[] | select(.age >= 18)`.
- `map(select(...))` gives one array with the items that pass.
- After `select` you can carry on: `.[] | select(...) | .name`.
- `Cannot index array` means `select` got the whole array, not one item.
