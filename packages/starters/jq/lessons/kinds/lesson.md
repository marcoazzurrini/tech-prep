# Tell Value Kinds Apart

## Ask for the kind of a value

**Input**

```json
{"id": "1042", "qty": 3}
```

**Filter**

```jq
.id | type
```

**Output**

```json
"string"
```

```steps
.id => "1042"
.id «| type» => "string"
```

**Filter**

```jq
.qty | type
```

**Output**

```json
"number"
```

**Rule:** `type` gives the kind of its input, as a string. `"1042"` has quotes, so it is a string, not a number.

`type` gives one of six names: `"string"`, `"number"`, `"boolean"`, `"null"`, `"array"` or `"object"`. `"boolean"` is for `true` and `false`.

`.price | type` gives `"null"` here. A missing key gives `null`.

<!-- task -->

## Test for one kind

**Input**

```json
{"id": "1042", "qty": 3}
```

**Filter**

```jq
.qty | type == "number"
```

**Output**

```json
true
```

```steps
.qty => 3
.qty «| type == "number"» => true
```

**Rule:** For a yes or a no, compare `type` with the name of the kind you expect.

**Common mistake:** No quotes around the name of the kind.

**Wrong**

```jq
.qty | type == «number»
```

**Error**

```text
jq: error: number/0 is not defined at <top-level>, line 1:
```

**Fix**

```jq
.qty | type == «"number"»
```

The name of a kind is a string, so it needs double quotes. Without them, jq takes the word for a filter, and it knows no filter called `number`.

<!-- task -->

## Join a kind test with other tests

**Input**

```json
{"id": "1042", "qty": "3"}
```

**Filter**

```jq
.qty | type == "number" and . > 0
```

**Output**

```json
false
```

**Filter**

```jq
.id | type == "string" or type == "number"
```

**Output**

```json
true
```

**Rule:** After the pipe, join tests about the same value with `and` or `or`. There, `.` is the value itself.

`type == "string" or type == "number"` gives `true` for `"0150"` and for `150`. It gives `false` for `null`.

**Common mistake:** Comparing the value with no kind test first.

**Wrong**

```jq
.qty > 0
```

**Output**

```json
true
```

**Fix**

```jq
.qty | «type == "number" and» . > 0
```

jq compares a string with a number without an error. For jq, every string is greater than every number. So `"3" > 0` is `true`, and that hides the bad data.

<!-- task -->

## Remember

- `type` gives the kind of its input as a string: `"string"`, `"number"`, `"boolean"`, `"null"`, `"array"` or `"object"`.
- A missing key gives `null`, so its kind is `"null"`.
- Test a kind with `==`, and put the name in quotes: `.qty | type == "number"`.
- Test the kind before you compare the value: `type == "number" and . > 0`.
