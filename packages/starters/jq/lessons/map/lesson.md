# Change Every Item with map

`[.[] | .name]` has three steps: take the array apart, do something with each item, collect the results. You need this very often. jq has a shorter way to write it.

## map does the three steps in one

**Input**

```json
[
  {"name": "Ada", "city": "Oslo"},
  {"name": "Bo", "city": "Bergen"}
]
```

**Filter**

```jq
map(.name)
```

**Output**

```json
["Ada", "Bo"]
```

`map(.name)` is short for `[.[] | .name]`. Read it as "run `.name` on every item, and give an array of the results".

`map` is a named filter, like `length`. But it needs to know what to do with each item. You tell it with a filter between round brackets `(` and `)`.

- An array goes in.
- The filter in the round brackets runs once for each item.
- An array comes out. It has the same number of items, in the same order.

<!-- task -->

## Any filter fits inside

The round brackets can hold any filter: a path, a named filter, or a chain with pipes.

**Input**

```json
[
  {"name": "api", "tags": ["go", "http"]},
  {"name": "web", "tags": ["ts"]}
]
```

- `map(.tags)` gives `[["go", "http"], ["ts"]]`.
- `map(.tags[0])` gives `["go", "ts"]`.
- `map(.tags | length)` gives `[2, 1]`.

Inside the round brackets, `.` is one item. It is not the whole array.

A common mistake is to forget the dot before a key:

```jq
map(name)
```

```text
jq: error: name/0 is not defined
```

Without the dot, jq looks for a named filter called `name`. There is none. A key always needs its dot: `map(.name)`.

<!-- task -->

## map needs an array

`map` works on the input it gets, and that input must be the array. When the array is inside an object, take it first and pipe it to `map`:

**Input**

```json
{
  "repo": "api",
  "branches": [{"name": "main"}, {"name": "dev"}]
}
```

**Filter**

```jq
.branches | map(.name)
```

**Output**

```json
["main", "dev"]
```

A common mistake is to leave out the first step:

```jq
map(.name)
```

```text
jq: error: Cannot index string with string "name"
```

Here `map` got the whole object, not the list of branches. So it tried to take `name` from the string `"api"`. When you see this error, check what `map` gets as input.

<!-- task -->

## Remember

- `map(f)` runs `f` on every item of an array and gives a new array.
- `map(.name)` is short for `[.[] | .name]`.
- Inside the round brackets, `.` is one item.
- Any filter fits inside: `map(.tags | length)`.
- `map` needs an array as input: `.branches | map(.name)`.
