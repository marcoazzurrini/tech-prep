# Go Deeper with a Path

## One step after another

**Input**

```json
{"name": "Ada", "address": {"city": "Oslo", "zip-code": "0150"}}
```

**Filter**

```jq
.address.city
```

**Output**

```json
"Oslo"
```

```steps
.address => {"city": "Oslo", "zip-code": "0150"}
.address«.city» => "Oslo"
```

**Rule:** A **path** joins steps with dots. Each step works on what the step before gave.

`.a.b.c` works the same way. A path can be as long as the data is deep.

`.address["zip-code"]` gives `"0150"`. A key with a dash is a step in brackets, right after the step before.

<!-- task -->

## Build a path step by step

**Input**

```json
{"order": {"id": 801, "customer": {"name": "Ada", "email": "ada@example.com"}}}
```

**Filter**

```jq
.order.customer.email
```

**Output**

```json
"ada@example.com"
```

```steps
.order => {"id": 801, "customer": {"name": "Ada", "email": "ada@example.com"}}
.order«.customer» => {"name": "Ada", "email": "ada@example.com"}
.order.customer«.email» => "ada@example.com"
```

**Rule:** Write one step, read the output, then add the next step.

`.order` shows that the order has a `customer`. The output is your map.

<!-- task -->

## When a step fails

**Input**

```json
{"user": {"name": "Ada"}}
```

**Filter**

```jq
.user.address.city
```

**Output**

```json
null
```

```steps
.user => {"name": "Ada"}
.user«.address» => null
.user.address«.city» => null
```

**Rule:** A missing key gives `null`. Every step after it gives `null` too.

**Common mistake:** One step too far.

**Wrong**

```jq
.user.name«.first»
```

**Error**

```text
jq: error: Cannot index string with string "first"
```

**Fix**

```jq
.user.name
```

`.user.name` is the string `"Ada"`. A string or a number has nothing inside it, so jq cannot take `first` from it.

<!-- task -->

## Remember

- A path joins steps with dots: `.a.b.c`. Each step works on what the step before gave.
- A key with a dash is a step in brackets: `.a["b-c"]`.
- Build a path one step at a time, and read the output after each step.
- A missing key gives `null` for the rest of the path. `Cannot index string` means you went one step too far.
