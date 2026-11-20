# Split and Join Text

## Cut a string into parts

**Input**

```json
{"user": "ada", "langs": "ts, go, rust"}
```

**Filter**

```jq
.langs | split(", ")
```

**Output**

```json
["ts", "go", "rust"]
```

```steps
.langs => "ts, go, rust"
.langs «| split(", ")» => ["ts", "go", "rust"]
```

**Rule:** `split(", ")` cuts a string at every comma and space, and gives an array of the parts.

`split(", ")` holds the **separator**: the text that stands between two parts. Write it in double quotes. It is thrown away.

**Common mistake:** The separator does not match exactly.

**Wrong**

```jq
.langs | split(«","»)
```

**Output**

```json
["ts", " go", " rust"]
```

**Fix**

```jq
.langs | split(«", "»)
```

Two parts start with a space. The separator here is a comma and a space.

<!-- task -->

## Glue an array into one string

**Input**

```json
{"user": "ada", "langs": ["ts", "go", "rust"]}
```

**Filter**

```jq
.langs | join(" and ")
```

**Output**

```json
"ts and go and rust"
```

```steps
.langs => ["ts", "go", "rust"]
.langs «| join(" and ")» => "ts and go and rust"
```

**Rule:** `join(" and ")` glues an array of strings into one string, with the separator between the parts.

`["ts"] | join(" and ")` gives `"ts"`. The separator goes only between two parts, never at the start or the end.

`join("")` glues the parts with nothing between them.

<!-- task -->

## Split, then work on the parts

**Input**

```json
{"id": "eu-west-1"}
```

**Filter**

```jq
.id | split("-") | .[0]
```

**Output**

```json
"eu"
```

```steps
.id => "eu-west-1"
.id «| split("-")» => ["eu", "west", "1"]
.id | split("-") «| .[0]» => "eu"
```

**Filter**

```jq
.id | split("-") | join(" ")
```

**Output**

```json
"eu west 1"
```

**Rule:** After `split` you have an array. So `.[0]`, `.[-1]`, `length` and `map` work on it.

`split("-") | join(" ")` swaps one separator for another.

**Common mistake:** `join` on a string.

**Wrong**

```jq
.id | join(" ")
```

**Error**

```text
jq: error: Cannot iterate over string ("eu-west-1")
```

**Fix**

```jq
.id | «split("-") | »join(" ")
```

`split` needs a string. `join` needs an array. Split the string first.

<!-- task -->

## Remember

- `split(",")` cuts a string at every comma and gives an array of the parts.
- `join(", ")` glues an array of strings into one string, with the separator between the parts.
- The separator must match exactly, spaces included.
- After `split` you have an array. `split` then `join` swaps one separator for another.
