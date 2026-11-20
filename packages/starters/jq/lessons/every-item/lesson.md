# Work on Every Item

## Take an array apart

**Input**

```json
["mon", "tue", "wed"]
```

**Filter**

```jq
.[]
```

**Output**

```json
"mon"
"tue"
"wed"
```

**Rule:** `.[]` takes an array apart. Every item becomes its own output.

`.[]` gives three separate values here, not an array. The output has no square brackets and no commas.

`.[]` on the empty array `[]` prints nothing. A filter can give several outputs, or none.

<!-- task -->

## The next step runs once for each item

**Input**

```json
[{"name": "Ada", "langs": ["ts", "go", "c"]}, {"name": "Bo", "langs": ["go"]}]
```

**Filter**

```jq
.[] | .name
```

**Output**

```json
"Ada"
"Bo"
```

```steps
.[] => {"name": "Ada", "langs": ["ts", "go", "c"]} ;; {"name": "Bo", "langs": ["go"]}
.[] «| .name» => "Ada" ;; "Bo"
```

**Rule:** The step after the pipe runs once for each output. It sees one item at a time, never the whole array.

`.[] | .langs | length` gives `3`, then `1`. Every step after `.[]` runs once for each item.

`length` with no `.[]` before it gives `2`. It counts the items of the whole array.

<!-- task -->

## An array inside an object

**Input**

```json
{"team": "core", "members": [{"name": "Ada"}, {"name": "Bo"}]}
```

**Filter**

```jq
.members[] | .name
```

**Output**

```json
"Ada"
"Bo"
```

```steps
.members => [{"name": "Ada"}, {"name": "Bo"}]
.members«[]» => {"name": "Ada"} ;; {"name": "Bo"}
.members[] «| .name» => "Ada" ;; "Bo"
```

**Rule:** For an array inside an object, add `[]` to the path that leads to the array.

`.members[].name` gives the same result, as one path.

**Common mistake:** Forgetting the `[]`.

**Wrong**

```jq
.members | .name
```

**Error**

```text
jq: error: Cannot index array with string "name"
```

**Fix**

```jq
.members«[]» | .name
```

An array has positions, not keys. Take it apart first, then ask each item for its `name`.

<!-- task -->

## Remember

- `.[]` takes an array apart. Every item becomes its own output.
- Several outputs are not an array. They have no brackets and no commas.
- What follows the pipe runs once for each output: `.[] | .name`.
- For an array inside an object, write `.members[]`. `Cannot index array` means you forgot the `[]`.
