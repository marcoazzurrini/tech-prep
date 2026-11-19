# Skip What Does Not Fit

Real lists are not tidy. Most items are objects, but one is a plain string, or a list is `null`. One bad item should not break the whole command.

## One bad item stops everything

This team list has a string where an object should be:

**Input**

```json
[{"name": "Ada"}, "vacant", {"name": "Bo"}]
```

**Filter**

```jq
.[] | .name
```

**Output**

```text
"Ada"
jq: error: Cannot index string with string "name"
```

jq prints `"Ada"`. Then it meets `"vacant"`. A string has no keys, so jq stops. Bo is never printed.

Put a `?` after the step that fails:

**Filter**

```jq
.[] | .name?
```

**Output**

```json
"Ada"
"Bo"
```

Read `.name?` as "take `name`, if you can". When the step would give an error, it gives **nothing** in its place: no output at all. jq then goes on with the next item.

<!-- task -->

## Nothing is not null

The `?` hides errors. It does not hide `null`.

An object that does not have the key is not an error. As always, it gives `null`:

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

Three items went in. Two outputs came out.

- `{"name": "Ada"}` is an object with the key. It gives `"Ada"`.
- `"vacant"` is not an object. The step fails, and `?` turns that into no output.
- `{"role": "dev"}` is an object without the key. It gives `null`.

So count the outputs with care. An item of the wrong kind gives no output. An object with a missing key still gives `null`.

<!-- task -->

## The same mark after other steps

The `?` works after any step that can fail: `.name?`, `.[0]?` and `.[]?`.

A common case is a list that is sometimes `null`. `.[]` cannot take `null` apart:

**Input**

```json
[{"name": "Ada", "langs": ["ts", "go"]}, {"name": "Bo", "langs": null}]
```

**Filter**

```jq
.[] | .langs[]
```

**Output**

```text
"ts"
"go"
jq: error: Cannot iterate over null (null)
```

"Iterate over" means "go through the items of". `null` has no items to go through.

**Filter**

```jq
.[] | .langs[]?
```

**Output**

```json
"ts"
"go"
```

The `?` covers only the step it follows. In `.langs[]?` it covers `[]`, not `.langs`. Put it where the error happens. The error text tells you which step that is.

<!-- task -->

## Remember

- `?` after a step hides its error. The step gives no output, and jq goes on.
- `.name?` skips a value that is not an object.
- `.[]?` skips a value that has no items to go through, such as `null` or a string.
- A missing key in an object still gives `null`. That is not an error.
- The `?` covers only the step right before it.
