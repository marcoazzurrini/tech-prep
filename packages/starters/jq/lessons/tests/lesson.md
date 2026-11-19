# Ask Yes-or-No Questions

Sometimes you do not want a value from the data. You want an answer about it. Is this ticket open? Is this user old enough? The answer is `true` or `false`. A filter that gives `true` or `false` is called a **test**.

## Equal or not equal

Write `==` between two values. Read it as "is equal to":

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

jq takes `.status` and compares it with `"open"`. Text in a filter needs double quotes, as in JSON.

`!=` is the opposite. Read it as "is not equal to". Here `.status != "open"` gives `false`.

Watch out for one trap. A single `=` does something else: it changes the value.

```jq
.status = "done"
```

```json
{"id": 7, "status": "done"}
```

You expect `true` or `false` and you see the whole object? Check for a single `=`.

<!-- task -->

## Larger or smaller

Four more signs compare sizes:

- `<` is "smaller than".
- `>` is "larger than".
- `<=` is "smaller than or equal to".
- `>=` is "larger than or equal to".

**Input**

```json
{"user": "ada", "age": 36, "tags": ["dev", "lead"]}
```

- `.age >= 18` gives `true`.
- `.age < 30` gives `false`.

Both sides can come from the input. `.used > .limit` is true when `used` is larger than `limit`.

A test also works after a pipe. `.tags | length > 2` gives `false`: `.tags` takes the array, then `length > 2` runs on it.

Compare numbers with numbers. A number in quotes is text, so `.age == "36"` gives `false` here.

<!-- task -->

## Join tests with and, or, not

One question is often not enough. Three words join tests:

- `a and b` is true when **both** tests are true.
- `a or b` is true when **at least one** test is true.
- `not` turns the answer around: `true` becomes `false`, and `false` becomes `true`. It is a named filter, so it comes after a pipe.

**Input**

```json
{"name": "Ada", "age": 36, "active": true}
```

- `.active and .age >= 18` gives `true`. Both are true.
- `.age < 18 or .age > 65` gives `false`. Neither is true.
- `.active | not` gives `false`.

Look at `.active` in the first line. It already holds `true` or `false`, so it is a test by itself. You do not need `.active == true`.

<!-- task -->

## Remember

- A test is a filter that gives `true` or `false`.
- `==` is "is equal to" and `!=` is "is not equal to". A single `=` changes the value.
- `<`, `>`, `<=` and `>=` compare sizes.
- `and` needs both tests true. `or` needs at least one.
- `| not` turns the answer around.
