# Find a Value at Any Depth

A path works when you know where a value is. Sometimes you do not know. The value can sit two levels down, or five, or in several places at once. You need a way to look everywhere.

## Two dots give every value

The filter `..` gives the input, and then every value inside it, at any depth. Each value is its own output.

**Input**

```json
{"name": "Ada", "tags": ["a", 7]}
```

**Filter**

```jq
..
```

**Output**

```json
{"name": "Ada", "tags": ["a", 7]}
"Ada"
["a", 7]
"a"
7
```

There are five outputs:

- First the whole input.
- Then `"Ada"`, the value of `name`.
- Then the array, the value of `tags`.
- Then each item of that array: `"a"` and `7`.

Read `..` as "this value and everything inside it". jq walks down the document from top to bottom and goes into every object and every array.

Square brackets collect the outputs into one array, as always. So `[..] | length` counts every value in the document. Here it gives `5`.

<!-- task -->

## Keep one kind of value

On its own, `..` gives too much. Its use is as a first step: get every value, then keep the ones you want with `select`.

You know that `type` gives the kind of a value as a string. So this keeps the numbers and drops the rest:

**Input**

```json
{"shop": "north", "stock": {"pens": 40, "boxes": [12, "none"]}}
```

**Filter**

```jq
.. | select(type == "number")
```

**Output**

```json
40
12
```

- `..` gives every value: the objects, the array, the strings and the numbers.
- `select(type == "number")` runs once for each of them. It passes a value on only when it is a number.

You did not write a path to `pens` or to `boxes`. jq found the numbers wherever they were.

Put square brackets around the whole filter to get one array: `[.. | select(type == "number")]` gives `[40, 12]`.

<!-- task -->

## Find a key anywhere

The other common job: get the value of one key, wherever that key is.

**Input**

```json
{"id": 1, "owner": {"id": 7, "name": "Ada"}, "files": [{"id": 30}, {"name": "b.txt"}]}
```

A first try is `.. | .id`. It stops with an error:

```text
jq: error: Cannot index number with string "id"
```

`..` also gives numbers, strings and arrays, and you cannot take a key from those. Add `?` to hide that error: `.. | .id?`. Now jq prints `1`, `7`, `30` and `null`.

The `null` comes from `{"name": "b.txt"}`. It is an object, but it has no `id`. Drop the `null` with `select`:

**Filter**

```jq
.. | .id? | select(. != null)
```

**Output**

```json
1
7
30
```

<!-- task -->

## Remember

- `..` gives the input and every value inside it, at any depth.
- Use it as a first step, then keep what you want.
- `.. | select(type == "number")` keeps every number in the document.
- `.. | .id? | select(. != null)` gives every `id`, wherever it is.
- Without `?`, `.. | .id` stops with an error at the first value that is not an object.
