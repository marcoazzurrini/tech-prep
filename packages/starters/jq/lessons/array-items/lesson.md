# Pick an Item from a List

## Positions start at 0

**Input**

```json
["mon", "tue", "wed"]
```

**Filter**

```jq
.[0]
```

**Output**

```json
"mon"
```

**Filter**

```jq
.[1]
```

**Output**

```json
"tue"
```

**Rule:** `.[0]` is the first item. Positions start at 0. The position is called the **index**.

<!-- task -->

## Count from the end

**Input**

```json
["mon", "tue", "wed"]
```

**Filter**

```jq
.[-1]
```

**Output**

```json
"wed"
```

**Rule:** A negative index counts from the end. `.[-1]` is the last item, however long the array is.

`.[-2]` gives `"tue"`, the item before the last.

`.[5]` gives `null`. An index past the end is like a missing key.

<!-- task -->

## An index is one more step in a path

**Input**

```json
{"team": "core", "members": [{"name": "Ada", "role": "lead"}, {"name": "Bo", "role": "dev"}]}
```

**Filter**

```jq
.members[0].name
```

**Output**

```json
"Ada"
```

```steps
.members => [{"name": "Ada", "role": "lead"}, {"name": "Bo", "role": "dev"}]
.members«[0]» => {"name": "Ada", "role": "lead"}
.members[0]«.name» => "Ada"
```

**Rule:** An index is one more step in a path. Mix indexes and keys as the data needs.

`.members[-1].role` gives `"dev"`. A negative index works in a path too.

<!-- task -->

## A slice: several items at once

**Input**

```json
["a", "b", "c", "d", "e"]
```

**Filter**

```jq
.[1:3]
```

**Output**

```json
["b", "c"]
```

**Filter**

```jq
.[-2:]
```

**Output**

```json
["d", "e"]
```

**Rule:** `.[1:3]` is a **slice**. It gives a shorter array, from index 1 up to, but not with, index 3.

`.[:2]` gives `["a", "b"]`, the first two items. Leave one side out to go to the edge.

`.[1:2]` gives `["b"]`. A slice always gives an array, even when it holds one item.

<!-- task -->

## Remember

- `.[0]` is the first item. Positions start at 0. `.[-1]` is the last item.
- An index is one more step in a path: `.members[0].name`.
- `.[1:3]` is a slice: a shorter array, from index 1 up to, but not with, index 3.
- An index past the end gives `null`.
