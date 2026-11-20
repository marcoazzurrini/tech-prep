# Sort a List

## Put an array in order

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

```steps
.temps => [14, 9, 21, 17]
.temps «| sort» => [9, 14, 17, 21]
```

**Rule:** `sort` gives a new array with the same items in order, the smallest first.

`["pear", "apple", "fig"] | sort` gives `["apple", "fig", "pear"]`. Strings go in alphabetical order.

`["amy", "Zed"] | sort` gives `["Zed", "amy"]`. Capital letters come before all small letters.

<!-- task -->

## Sort objects by a field

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

**Rule:** `sort_by(.age)` orders objects by their `age`. The objects stay whole. Only their order changes.

**Common mistake:** No dot before the field.

**Wrong**

```jq
sort_by(«age»)
```

**Error**

```text
jq: error: age/0 is not defined at <top-level>, line 1:
```

**Fix**

```jq
sort_by(«.»age)
```

Without the dot, jq looks for a filter named `age`, as it would for `length`. It does not know one.

<!-- task -->

## Largest first

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

```steps
sort_by(.stars) => [{"name": "docs", "stars": 3}, {"name": "api", "stars": 12}, {"name": "web", "stars": 40}]
sort_by(.stars) «| reverse» => [{"name": "web", "stars": 40}, {"name": "api", "stars": 12}, {"name": "docs", "stars": 3}]
sort_by(.stars) | reverse «| map(.name)» => ["web", "api", "docs"]
```

**Rule:** `reverse` turns an array around. Sort, then `reverse`, to get the largest first.

`sort_by(.stars) | reverse | .[:2]` gives the two repos with the most stars. After sorting, `.[0]` is the smallest item.

**Common mistake:** The names are taken before sorting.

**Wrong**

```jq
«map(.name)» | sort_by(.stars) | reverse
```

**Error**

```text
jq: error: Cannot index string with string "stars"
```

**Fix**

```jq
sort_by(.stars) | reverse «| map(.name)»
```

After `map(.name)` the stars are gone, and jq has nothing to sort by. Sort first and take the names last.

<!-- task -->

## Remember

- `sort` puts an array of numbers or strings in order, smallest first. Capital letters sort before small letters.
- `sort_by(.field)` orders objects by one field. The field needs its dot.
- `reverse` turns an array around. Sort, then `reverse`, to get the largest first.
- Sort while the field is still there. Take single fields with `map` after sorting.
