# Fill Gaps with a Default

## Say what to use when a value is missing

**Input**

```json
{"name": "Bo", "city": "Bergen"}
```

**Filter**

```jq
.nickname // "none"
```

**Output**

```json
"none"
```

```steps
.nickname => null
.nickname «// "none"» => "none"
```

**Rule:** `a // b` gives `a`. When `a` is `null` or `false`, it gives `b`.

`"none"` is called the **default**. It is written as JSON: a string in double quotes. A missing key gives `null`, so it gets the default too.

`.city // "none"` gives `"Bergen"`. Every value other than `null` and `false` is kept, also `0` and the empty string `""`.

<!-- task -->

## The default can be another path

**Input**

```json
{"nickname": null, "name": "Bo Lind"}
```

**Filter**

```jq
.nickname // .name // "no name"
```

**Output**

```json
"Bo Lind"
```

```steps
.nickname => null
.nickname «// .name» => "Bo Lind"
.nickname // .name «// "no name"» => "Bo Lind"
```

**Rule:** The default can be any filter, such as a second place to look. jq goes from left to right and gives the first value that is not `null` or `false`.

`.nickname // .name` has one default. It reads "take `nickname`, or else take `name`".

`"no name"` is used only when the nickname and the name are both `null` or missing.

<!-- task -->

## A default inside a chain

**Input**

```json
{"name": "web", "labels": null}
```

**Filter**

```jq
.labels // {} | keys
```

**Output**

```json
[]
```

```steps
.labels => null
.labels «// {}» => {}
.labels // {} «| keys» => []
```

**Rule:** Fill the gap before the pipe. jq works out `.labels // {}` first, as one step.

`{}` is an empty object. For a missing array the default is `[]`. For a missing number it is often `0`.

**Common mistake:** No default before a filter that cannot take `null`.

**Wrong**

```jq
.labels | keys
```

**Error**

```text
jq: error: null (null) has no keys
```

**Fix**

```jq
.labels «// {} »| keys
```

The error says that the value is `null`, and that `null` has no keys.

<!-- task -->

## Remember

- `a // b` gives `a`. When `a` is `null` or `false`, it gives `b`.
- A missing key gives `null`, so it gets the default. `0` and `""` are real values, and they are kept.
- The default can be a value, such as `"none"`, `0`, `[]` or `{}`, or another path: `.nickname // .name`.
- Fill the gap before the pipe: `.labels // {} | keys`.
