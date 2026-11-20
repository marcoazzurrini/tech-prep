# Skip What Does Not Fit

## One bad item stops everything

**Input**

```json
[{"name": "Ada"}, "vacant", {"name": "Bo"}]
```

**Filter**

```jq
.[] | .name?
```

**Output**

```json
"Ada"
"Bo"
```

```steps
.[] => {"name": "Ada"} ;; "vacant" ;; {"name": "Bo"}
.[] «| .name?» => "Ada" ;; "Bo"
```

**Rule:** A `?` after a step hides its error. The step gives **nothing**, and jq goes on with the next item.

`.name?` reads "take `name`, if you can". Nothing means no output at all.

**Common mistake:** No `?` on a list with a bad item.

**Wrong**

```jq
.[] | .name
```

**Error**

```text
jq: error: Cannot index string with string "name"
```

**Fix**

```jq
.[] | .name«?»
```

jq prints `"Ada"`, then meets `"vacant"`. A string has no keys, so jq stops. Bo is never printed.

<!-- task -->

## Nothing is not null

**Input**

```json
[{"name": "Ada"}, "vacant", {"role": "dev"}]
```

**Filter**

```jq
.[] | .name?
```

**Output**

```json
"Ada"
null
```

```steps
.[] => {"name": "Ada"} ;; "vacant" ;; {"role": "dev"}
.[] «| .name?» => "Ada" ;; null
```

**Rule:** The `?` hides errors. It does not hide `null`.

`"vacant"` is not an object. The step fails, and `?` turns that into no output.

`{"role": "dev"}` is an object without the key. That is not an error, so it gives `null`.

<!-- task -->

## The same mark after other steps

**Input**

```json
[{"name": "Ada", "langs": ["ts", "go"]}, {"name": "Bo", "langs": null}]
```

**Filter**

```jq
.[] | .langs[]?
```

**Output**

```json
"ts"
"go"
```

```steps
.[] => {"name": "Ada", "langs": ["ts", "go"]} ;; {"name": "Bo", "langs": null}
.[] «| .langs[]?» => "ts" ;; "go"
```

**Rule:** The `?` works after any step that can fail: `.name?`, `.[0]?` and `.[]?`.

`.[]?` skips a value that has no items to go through, such as `null` or a string.

`.langs[]?` covers only `[]`, not `.langs`. The `?` covers the step right before it, so put it where the error happens. The error text tells you which step that is.

**Common mistake:** A list that is sometimes `null`.

**Wrong**

```jq
.[] | .langs[]
```

**Error**

```text
jq: error: Cannot iterate over null (null)
```

**Fix**

```jq
.[] | .langs[]«?»
```

"Iterate over" means "go through the items of". `null` has no items to go through.

<!-- task -->

## Remember

- `?` after a step hides its error. The step gives no output, and jq goes on.
- `.name?` skips a value that is not an object. `.[]?` skips a value with no items, such as `null` or a string.
- A missing key in an object still gives `null`. That is not an error.
- The `?` covers only the step right before it.
