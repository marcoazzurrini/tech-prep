# Change a Value in Place

## Update a value with |=

**Input**

```json
{"name": "lamp", "price": 20, "stock": 7}
```

**Filter**

```jq
.stock |= . + 1
```

**Output**

```json
{"name": "lamp", "price": 20, "stock": 8}
```

**Rule:** `path |= filter` changes the value at the path and keeps everything else. The filter gets the old value.

`. + 1` gets `7` here and gives `8`. In the same way, `. - 1` takes 1 away and `. * 2` doubles.

jq never changes your file. It prints a changed copy.

**Common mistake:** `|` in place of `|=`.

**Wrong**

```jq
.stock «|» . + 1
```

**Output**

```json
8
```

**Fix**

```jq
.stock «|=» . + 1
```

The plain pipe keeps only the part. The rest of the document is lost.

<!-- task -->

## Set a new value with =

**Input**

```json
{"id": 12, "state": "open", "owner": {"name": "Ada", "team": "core"}}
```

**Filter**

```jq
.state = "closed"
```

**Output**

```json
{"id": 12, "state": "closed", "owner": {"name": "Ada", "team": "core"}}
```

**Filter**

```jq
.owner.team = "infra"
```

**Output**

```json
{"id": 12, "state": "open", "owner": {"name": "Ada", "team": "infra"}}
```

**Rule:** `path = value` sets a fixed new value. The path can be long, also with `|=`.

`.priority = 2` adds a `priority` key at the end, because the key is not there yet. Write the new value as JSON: text in double quotes, a number, `true` or `false`.

`=` is for a fixed new value. `|=` is for a new value made from the old one.

<!-- task -->

## Update a list inside the document

**Input**

```json
{"player": "Ada", "scores": [3, 5, 8]}
```

**Filter**

```jq
.scores |= map(. * 10)
```

**Output**

```json
{"player": "Ada", "scores": [30, 50, 80]}
```

**Rule:** The right side of `|=` can be any filter. It gets the old value, here the array `[3, 5, 8]`.

`.scores |= .[:2]` gives `{"player": "Ada", "scores": [3, 5]}`. A slice is a filter too.

`.scores | map(. * 10)` gives only `[30, 50, 80]`. With a plain pipe the player's name is lost.

<!-- task -->

## Remember

- `path |= f` changes the value at the path and keeps everything else.
- On the right side of `|=`, the dot is the old value: `.stock |= . + 1`.
- `path = value` sets a fixed new value. It adds the key if it is missing.
- `|` keeps only the part. `|=` keeps the whole document. Your file stays the same.
