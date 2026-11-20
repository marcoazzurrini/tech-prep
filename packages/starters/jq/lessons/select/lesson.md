# Keep Only Some Items

## select keeps or drops a value

**Input**

```json
[{"name": "Ada", "age": 36}, {"name": "Bo", "age": 15}, {"name": "Cy", "age": 52}]
```

**Filter**

```jq
.[] | select(.age >= 18)
```

**Output**

```json
{"name": "Ada", "age": 36}
{"name": "Cy", "age": 52}
```

```steps
.[] => {"name": "Ada", "age": 36} ;; {"name": "Bo", "age": 15} ;; {"name": "Cy", "age": 52}
.[] «| select(.age >= 18)» => {"name": "Ada", "age": 36} ;; {"name": "Cy", "age": 52}
```

**Rule:** `select(test)` passes its input on when the test is true. Otherwise it gives no output.

`select` gives the whole item, not `true` or `false`. The test only decides.

<!-- task -->

## Keep an array with map

**Input**

```json
[{"name": "Ada", "age": 36}, {"name": "Bo", "age": 15}, {"name": "Cy", "age": 52}]
```

**Filter**

```jq
map(select(.age >= 18))
```

**Output**

```json
[{"name": "Ada", "age": 36}, {"name": "Cy", "age": 52}]
```

**Rule:** `map(select(test))` gives one array with the items that pass.

**Common mistake:** `select` on the whole array.

**Wrong**

```jq
select(.age >= 18)
```

**Error**

```text
jq: error: Cannot index array with string "age"
```

**Fix**

```jq
«map(»select(.age >= 18))
```

`select` got the array, and an array has no `age`. Put `select` after `.[]` or inside `map`, so the test runs on each item.

<!-- task -->

## Carry on after select

**Input**

```json
[{"name": "Ada", "age": 36}, {"name": "Bo", "age": 15}, {"name": "Cy", "age": 52}]
```

**Filter**

```jq
.[] | select(.age >= 18) | .name
```

**Output**

```json
"Ada"
"Cy"
```

```steps
.[] => {"name": "Ada", "age": 36} ;; {"name": "Bo", "age": 15} ;; {"name": "Cy", "age": 52}
.[] «| select(.age >= 18)» => {"name": "Ada", "age": 36} ;; {"name": "Cy", "age": 52}
.[] | select(.age >= 18) «| .name» => "Ada" ;; "Cy"
```

**Rule:** What `select` passes on goes to the next step.

`[.[] | select(.age >= 18) | .name]` gives `["Ada", "Cy"]`. Square brackets around the whole chain collect the names.

**Common mistake:** `select` after `.name`.

**Wrong**

```jq
.[] | .name | select(.age >= 18)
```

**Error**

```text
jq: error: Cannot index string with string "age"
```

**Fix**

```jq
.[] | select(.age >= 18) | .name
```

After `.name` only a string is left. Put `select` first, while the item still has its `age`.

<!-- task -->

## Remember

- `.[] | select(test)` keeps the items where the test is true.
- `map(select(test))` gives them as one array.
- You can carry on after it: `.[] | select(test) | .name`.
- `Cannot index array` means `select` got the whole array, not one item.
