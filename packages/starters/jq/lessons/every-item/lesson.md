# Work on Every Item

`.[0]` takes one item from an array. Often you want something from **every** item: every name, every status. You do not know how long the array is, so indexes cannot do this.

## Take an array apart

Write `.[]`, with nothing between the brackets:

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

Read `.[]` as "every item of the input". jq gives each item as its own output, one after another.

Look closely at the output. It has no square brackets and no commas. These are three separate values. They are **not** an array. The array was taken apart.

This is new. Until now, one value went in and one value came out. Here one value went in and three values came out. A filter can give several outputs. It can also give none: on the empty array `[]`, `.[]` prints nothing.

<!-- task -->

## The next step runs once for each item

Now put a pipe and a second step after `.[]`:

**Input**

```json
[
  {"name": "Ada", "city": "Oslo"},
  {"name": "Bo", "city": "Bergen"}
]
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

- `.[]` gives two outputs: Ada's object, then Bo's object.
- The pipe hands them on **one at a time**.
- `.name` runs on Ada's object and gives `"Ada"`. Then it runs again on Bo's object and gives `"Bo"`.

The step after the pipe never sees the whole array. It sees one item, then the next. It runs once for each.

This is true for any filter. Take the input `["go", "rust", "c"]`:

- `length` gives `3`, the number of items.
- `.[] | length` gives `2`, then `4`, then `1`: the length of each string.

Most of jq builds on this idea.

<!-- task -->

## An array inside an object

Most arrays sit inside an object. Add `[]` to the path that leads to the array:

**Input**

```json
{
  "team": "core",
  "members": [{"name": "Ada"}, {"name": "Bo"}]
}
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

`.members` takes the array. `[]` takes it apart. `.name` runs once for each member.

You can also write it as one path: `.members[].name`. It means the same.

A common mistake is to forget the `[]`:

```jq
.members | .name
```

```text
jq: error: Cannot index array with string "name"
```

Read the error like this: "the value here is an array, and I cannot take `name` from an array". An array has positions, not keys. Take it apart first, then ask each item for its `name`.

<!-- task -->

## Remember

- `.[]` takes an array apart. Every item becomes its own output.
- Several outputs are not an array. They have no brackets and no commas.
- What follows the pipe runs once for each output: `.[] | .name`.
- For an array inside an object, write `.members[]`.
- `Cannot index array with string "name"` means you forgot to take the array apart.
