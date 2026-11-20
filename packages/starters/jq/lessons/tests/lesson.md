# Ask Yes-or-No Questions

## Equal or not equal

**Input**

```json
{"id": 7, "status": "open"}
```

**Filter**

```jq
.status == "open"
```

**Output**

```json
true
```

**Filter**

```jq
.status != "open"
```

**Output**

```json
false
```

**Rule:** `==` asks "is equal to". `!=` asks "is not equal to". A filter that gives `true` or `false` is called a **test**.

`"open"` has double quotes. Text in a filter needs them, as in JSON.

**Common mistake:** A single `=`.

**Wrong**

```jq
.status «=» "done"
```

**Output**

```json
{"id": 7, "status": "done"}
```

**Fix**

```jq
.status «==» "done"
```

A single `=` changes the value. You expect `true` or `false` and you see the whole object? Check for a single `=`.

<!-- task -->

## Larger or smaller

**Input**

```json
{"user": "ada", "age": 36, "tags": ["dev", "lead"]}
```

**Filter**

```jq
.age >= 18
```

**Output**

```json
true
```

**Filter**

```jq
.tags | length > 2
```

**Output**

```json
false
```

```steps
.tags => ["dev", "lead"]
.tags «| length» => 2
.tags | length «> 2» => false
```

**Rule:** `<` is "smaller than" and `>` is "larger than". `<=` and `>=` are also true when both sides are equal.

`.used > .limit` is true when `used` is larger than `limit`. Both sides of a test can come from the input.

`.age == "36"` gives `false`. A number in quotes is text, so compare numbers with numbers.

<!-- task -->

## Join tests with and, or, not

**Input**

```json
{"name": "Ada", "age": 36, "active": true}
```

**Filter**

```jq
.active and .age >= 18
```

**Output**

```json
true
```

**Filter**

```jq
.age < 18 or .age > 65
```

**Output**

```json
false
```

**Rule:** `a and b` is true when both tests are true. `a or b` is true when at least one is true.

`.active | not` gives `false`. `not` turns the answer around. It is a named filter, so it comes after a pipe.

`.active` already holds `true` or `false`, so it is a test by itself. You do not need `.active == true`.

<!-- task -->

## Remember

- A test is a filter that gives `true` or `false`.
- `==` is "is equal to" and `!=` is "is not equal to". A single `=` changes the value.
- `<`, `>`, `<=` and `>=` compare sizes.
- `and` needs both tests true. `or` needs at least one. `| not` turns the answer around.
