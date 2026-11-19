# Pick an Item from a List

An array holds values in order. Each item has a position. You take an item by its position.

## Positions start at 0

Put the position in square brackets after the dot:

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

The first item is at position 0, the second at 1, and so on. Most programming tools count this way. The position is called the **index**.

<!-- task -->

## Count from the end

A negative index counts from the end. `.[-1]` is the last item, and `.[-2]` is the one before it.

Use this when you want the last item and do not know how long the array is.

An index past the end gives `null`, like a missing key.

<!-- task -->

## An index is one more step in a path

Arrays sit inside objects, and objects sit inside arrays. Mix indexes and keys in one path:

**Input**

```json
{
  "team": "core",
  "members": [
    {"name": "Ada", "role": "lead"},
    {"name": "Bo", "role": "dev"}
  ]
}
```

**Filter**

```jq
.members[0].name
```

**Output**

```json
"Ada"
```

- `.members` takes the array.
- `[0]` takes its first item, an object.
- `.name` takes the name from that object.

<!-- task -->

## A slice: several items at once

`.[1:3]` gives a shorter array. It starts at index 1 and stops **before** index 3.

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

Leave one side out to go to the edge. `.[:2]` is the first two items. `.[-2:]` is the last two.

A slice always gives an array, even when it holds one item.

<!-- task -->

## Remember

- `.[0]` is the first item. Positions start at 0.
- `.[-1]` is the last item.
- An index is one more step in a path: `.members[0].name`.
- `.[1:3]` is a slice: a shorter array, from index 1 up to, but not with, index 3.
- An index past the end gives `null`.
