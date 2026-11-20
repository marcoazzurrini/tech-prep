# Change Every Item with map

## map does the three steps in one

**Input**

```json
[{"name": "Ada", "city": "Oslo"}, {"name": "Bo", "city": "Bergen"}]
```

**Filter**

```jq
map(.name)
```

**Output**

```json
["Ada", "Bo"]
```

**Rule:** `map(f)` runs `f` on every item of an array. It gives an array of the results, in the same order.

`[.[] | .name]` gives the same result. `map(.name)` is the short way to take apart, change and collect.

`map(.)` changes nothing. The filter between the round brackets `(` and `)` says what to do with each item.

<!-- task -->

## Any filter fits inside

**Input**

```json
[{"name": "api", "tags": ["go", "http"]}, {"name": "web", "tags": ["ts"]}]
```

**Filter**

```jq
map(.tags | length)
```

**Output**

```json
[2, 1]
```

**Rule:** Any filter fits inside the round brackets. Inside them, `.` is one item, not the whole array.

`map(.tags[0])` gives `["go", "ts"]`. A path, a named filter or a chain with pipes all fit.

**Common mistake:** No dot before a key.

**Wrong**

```jq
map(name)
```

**Error**

```text
jq: error: name/0 is not defined at <top-level>, line 1:
```

**Fix**

```jq
map(«.»name)
```

Without the dot, jq looks for a named filter called `name`. There is none.

<!-- task -->

## map needs an array

**Input**

```json
{"repo": "api", "branches": [{"name": "main"}, {"name": "dev"}]}
```

**Filter**

```jq
.branches | map(.name)
```

**Output**

```json
["main", "dev"]
```

```steps
.branches => [{"name": "main"}, {"name": "dev"}]
.branches «| map(.name)» => ["main", "dev"]
```

**Rule:** `map` needs an array as its input. For an array inside an object, take it first and pipe it to `map`.

**Common mistake:** `map` on the whole object.

**Wrong**

```jq
map(.name)
```

**Error**

```text
jq: error: Cannot index string with string "name"
```

**Fix**

```jq
«.branches | »map(.name)
```

`map` got the whole object, not the list of branches. So it tried to take `name` from the string `"api"`.

<!-- task -->

## Remember

- `map(f)` runs `f` on every item of an array and gives a new array.
- `map(.name)` is short for `[.[] | .name]`.
- Inside the round brackets, `.` is one item. Any filter fits: `map(.tags | length)`.
- `map` needs an array as input: `.branches | map(.name)`.
