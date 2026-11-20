# Ask for Several Things at Once

## A comma between two filters

**Input**

```json
{"name": "Ada", "email": "ada@example.com", "age": 36}
```

**Filter**

```jq
.name, .email
```

**Output**

```json
"Ada"
"ada@example.com"
```

**Rule:** `a, b` gives the outputs of `a`, then the outputs of `b`. Both run on the same input.

`.name, .email` gives two outputs, each on its own line. It is not one array.

`.name, .email, .age` gives three outputs. You can list as many as you need.

<!-- task -->

## A comma after a pipe

**Input**

```json
{"plan": "pro", "user": {"name": "Ada", "email": "ada@example.com"}}
```

**Filter**

```jq
.user | .name, .email
```

**Output**

```json
"Ada"
"ada@example.com"
```

```steps
.user => {"name": "Ada", "email": "ada@example.com"}
.user «| .name, .email» => "Ada" ;; "ada@example.com"
```

**Rule:** After a pipe, both sides of the comma run on what the step before gave.

**Common mistake:** One side needs the outer object.

**Wrong**

```jq
.user | .name, «.plan»
```

**Output**

```json
"Ada"
null
```

**Fix**

```jq
«.user.name», .plan
```

`.plan` ran on the inner object, and that object has no `plan`. Drop the pipe and give each side its full path.

<!-- task -->

## Several things from every item

**Input**

```json
[
  {"name": "Ada", "city": "Oslo"},
  {"name": "Bo", "city": "Bergen"}
]
```

**Filter**

```jq
.[] | .name, .city
```

**Output**

```json
"Ada"
"Oslo"
"Bo"
"Bergen"
```

```steps
.[] => {"name": "Ada", "city": "Oslo"} ;; {"name": "Bo", "city": "Bergen"}
.[] «| .name, .city» => "Ada" ;; "Oslo" ;; "Bo" ;; "Bergen"
```

**Rule:** What follows the pipe runs once for each item. jq finishes one item before it starts the next.

`.[] | .name, .city` does not give all the names first. Two items with two values each give four outputs.

<!-- task -->

## Remember

- `a, b` gives the outputs of `a`, then the outputs of `b`. Both run on the same input.
- The result is several outputs, not one array.
- After a pipe, both sides work on what the step before gave. An unexpected `null`? One side may need a full path.
- `.[] | .name, .city` gives the values item by item.
