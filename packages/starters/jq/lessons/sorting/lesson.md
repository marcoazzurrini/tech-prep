# Sort a List

Data often comes in no useful order. You want the smallest number first, or names from A to Z. Until now you could not change the order of an array.

## Put an array in order

`sort` is a named filter, like `length`. Give it an array. It gives back a new array with the same items, in order.

**Input**

```json
{"city": "Oslo", "temps": [14, 9, 21, 17]}
```

**Filter**

```jq
.temps | sort
```

**Output**

```json
[9, 14, 17, 21]
```

`.temps` takes the array. Then `sort` puts its items in order.

- Numbers go from the smallest to the largest.
- Strings go in alphabetical order: `["pear", "apple", "fig"]` becomes `["apple", "fig", "pear"]`.

Be careful with capital letters. They come before all small letters, so `"Zed"` comes before `"amy"`.

<!-- task -->

## Sort objects by a field

Most arrays hold objects, not plain numbers. Then you must say which field decides the order. Use `sort_by` and put the field in round brackets:

**Input**

```json
[
  {"name": "Ada", "age": 36},
  {"name": "Bo", "age": 29},
  {"name": "Cy", "age": 41}
]
```

**Filter**

```jq
sort_by(.age)
```

**Output**

```json
[
  {"name": "Bo", "age": 29},
  {"name": "Ada", "age": 36},
  {"name": "Cy", "age": 41}
]
```

Read `sort_by(.age)` as "sort by age". jq runs `.age` on each item and orders the items by what it gives. The objects stay whole. Only their order changes.

Do not forget the dot. `sort_by(age)` stops with an error:

```text
jq: error: age/0 is not defined at <top-level>, line 1:
```

Read it like this: "I do not know a filter named `age`". Without the dot, jq looks for a named filter such as `length`. Write `.age`.

<!-- task -->

## Largest first

`sort` and `sort_by` always go from the smallest to the largest. To get the largest first, sort and then turn the array around. The filter `reverse` does that: the last item becomes the first.

**Input**

```json
[
  {"name": "api", "stars": 12},
  {"name": "web", "stars": 40},
  {"name": "docs", "stars": 3}
]
```

**Filter**

```jq
sort_by(.stars) | reverse | map(.name)
```

**Output**

```json
["web", "api", "docs"]
```

Follow the value through the chain:

- `sort_by(.stars)` gives the repos in the order docs, api, web.
- `reverse` turns that around: web, api, docs.
- `map(.name)` keeps only the name of each repo.

Sort first and take the names last. If you take the names first, the stars are gone, and jq has nothing to sort by.

<!-- task -->

## Remember

- `sort` puts an array of numbers or strings in order, smallest first.
- `sort_by(.field)` orders objects by one field. The field needs its dot.
- `reverse` turns an array around. Sort, then `reverse`, to get the largest first.
- Sort while the field is still there. Take single fields with `map` after sorting.
- Capital letters sort before small letters.
