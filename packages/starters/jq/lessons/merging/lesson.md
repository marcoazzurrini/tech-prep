# Add and Merge with +

So far your filters took values out of the input. Sometimes you need to put two values together: a price and its tax, a first name and a last name, two lists, two objects. One symbol does all of this: `+`.

## Add numbers, join strings

Write `+` between two filters. Both filters get the same input. jq puts their two results together.

**Input**

```json
{"item": "desk", "price": 120, "tax": 30}
```

**Filter**

```jq
.price + .tax
```

**Output**

```json
150
```

Two numbers are added. Two strings are joined into one string:

**Input**

```json
{"first": "Ada", "last": "Berg"}
```

**Filter**

```jq
.first + " " + .last
```

**Output**

```json
"Ada Berg"
```

The middle part, `" "`, is a string you write in the filter yourself. It holds one space. Without it you get `"AdaBerg"`.

Both sides must be the same kind of value. A string plus a number stops with an error. `.item + .price` gives:

```text
jq: error: string ("desk") and number (120) cannot be added
```

<!-- task -->

## Join two arrays

Between two arrays, `+` makes one longer array. The items of the left array come first.

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

You can also add one item to the end of an array. Here is the common mistake: `.done + "deploy"` stops with an error.

```text
jq: error: array (["lint","te...) and string ("deploy") cannot be added
```

Read it like this: "the left side is an array and the right side is a string, and I cannot add those". jq cuts long values short with `...` in an error.

The fix: put square brackets around the item. Then it is an array with one item, and both sides are arrays. `.done + ["deploy"]` gives `["lint", "test", "deploy"]`.

<!-- task -->

## Merge two objects

Between two objects, `+` **merges** them. To merge means: make one object with the keys of both.

This lets you keep a whole object and change a part of it. The dot is the whole input. Add a small object that you build with `{ }`. You can write its values in the filter yourself, such as `"closed"`:

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
{
  "title": "Fix login",
  "state": "closed",
  "closed_by": "ada"
}
```

- `title` is only in the left object. It stays.
- `closed_by` is only in the right object. It is added.
- `state` is in both. **The right side wins**, so it is now `"closed"`.

jq does not change your file. It prints a changed copy.

Both sides can also come from the input. `.defaults + .mine` takes the default settings and lays your own settings over them.

<!-- task -->

## Remember

- `a + b` runs both filters on the same input and puts the results together.
- Numbers are added. Strings are joined. Arrays are joined, left items first.
- Objects are merged. When both have the same key, the right side wins.
- `. + {key: value}` keeps the whole object and adds or replaces one key.
- Both sides must be the same kind. To add one item to an array, wrap it: `+ ["item"]`.
