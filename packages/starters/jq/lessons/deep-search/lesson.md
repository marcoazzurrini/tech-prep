# Find a Value at Any Depth

## Two dots give every value

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

**Filter**

```jq
[..] | length
```

**Output**

```json
5
```

**Rule:** `..` gives the input, then every value inside it, at any depth. Each value is its own output.

`..` goes from top to bottom, into every object and every array. First comes the whole input, then `"Ada"`, then the array, then each item of the array.

`[..]` collects the outputs into one array, so `[..] | length` counts every value in the document.

<!-- task -->

## Keep one kind of value

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

```steps
.. => {"shop": "north", "stock": {"pens": 40, "boxes": [12, "none"]}} ;; "north" ;; {"pens": 40, "boxes": [12, "none"]} ;; 40 ;; [12, "none"] ;; 12 ;; "none"
.. «| select(type == "number")» => 40 ;; 12
```

**Rule:** Use `..` as a first step: get every value, then keep the ones you want with `select`.

`type` gives the kind of a value as a string, such as `"number"`, `"string"` or `"object"`. No path to `pens` or `boxes` is needed.

`[.. | select(type == "number") | select(. > 20)]` gives `[40]`. More steps can follow, and square brackets around the whole filter collect the outputs.

<!-- task -->

## Find a key anywhere

**Input**

```json
{"id": 1, "owner": {"id": 7, "name": "Ada"}, "files": [{"id": 30}, {"name": "b.txt"}]}
```

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

```steps
.. | .id? => 1 ;; 7 ;; 30 ;; null
.. | .id? «| select(. != null)» => 1 ;; 7 ;; 30
```

**Rule:** `.. | .id?` gives the `id` of every object, wherever it is. `select(. != null)` drops the objects with no `id`.

`null` comes from `{"name": "b.txt"}`. It is an object, but it has no `id`.

**Common mistake:** No `?` after the key.

**Wrong**

```jq
.. | .id
```

**Error**

```text
jq: error: Cannot index number with string "id"
```

**Fix**

```jq
.. | .id«?»
```

`..` also gives numbers, strings and arrays. You cannot take a key from those. `?` hides that error.

<!-- task -->

## Remember

- `..` gives the input and every value inside it, at any depth.
- Use it as a first step, then keep what you want.
- `.. | select(type == "number")` keeps every number in the document.
- `.. | .id? | select(. != null)` gives every `id`, wherever it is.
