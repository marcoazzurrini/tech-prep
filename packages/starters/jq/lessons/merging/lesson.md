# Add and Merge with +

## Add numbers, join strings

**Input**

```json
{"first": "Ada", "last": "Berg", "price": 120, "tax": 30}
```

**Filter**

```jq
.price + .tax
```

**Output**

```json
150
```

**Filter**

```jq
.first + " " + .last
```

**Output**

```json
"Ada Berg"
```

**Rule:** `a + b` runs both filters on the same input and puts the two results together. Numbers are added. Strings are joined.

`" "` is a string you write in the filter yourself. It holds one space. Without it you get `"AdaBerg"`.

**Common mistake:** A string plus a number.

**Wrong**

```jq
.first + .price
```

**Error**

```text
jq: error: string ("Ada") and number (120) cannot be added
```

**Fix**

```jq
.first + «(.price | tostring)»
```

Both sides must be the same kind of value.

<!-- task -->

## Join two arrays

**Input**

```json
{"done": ["lint", "test"], "todo": ["build"]}
```

**Filter**

```jq
.done + .todo
```

**Output**

```json
["lint", "test", "build"]
```

**Rule:** Between two arrays, `+` makes one longer array. The items of the left array come first.

`.done + ["deploy"]` gives `["lint", "test", "deploy"]`. It adds one item at the end.

**Common mistake:** One item with no square brackets around it.

**Wrong**

```jq
.done + "deploy"
```

**Error**

```text
jq: error: array (["lint","te...) and string ("deploy") cannot be added
```

**Fix**

```jq
.done + «["deploy"]»
```

The left side is an array and the right side is a string. `["deploy"]` is an array with one item, so both sides are arrays. jq cuts long values short with `...` in an error.

<!-- task -->

## Merge two objects

**Input**

```json
{"title": "Fix login", "state": "open"}
```

**Filter**

```jq
. + {state: "closed", closed_by: "ada"}
```

**Output**

```json
{"title": "Fix login", "state": "closed", "closed_by": "ada"}
```

**Rule:** Between two objects, `+` merges them: one object with the keys of both. When both have the same key, the right side wins.

`. + {state: "closed"}` keeps the whole object and replaces one key. jq prints a changed copy. Your file stays as it is.

`{title} + {closed_by: "ada"}` gives `{"title": "Fix login", "closed_by": "ada"}`. Each side can be any object, also one from the input: `.defaults + .mine`.

<!-- task -->

## Remember

- `a + b` runs both filters on the same input and puts the results together.
- Numbers are added. Strings are joined. Arrays are joined, left items first.
- Objects are merged. When both have the same key, the right side wins.
- Both sides must be the same kind. To add one item to an array, wrap it: `+ ["item"]`.
