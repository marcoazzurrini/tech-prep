# Ask for Several Things at Once

You want the name and the email of a user. One path gives one of them. You could run jq twice. A comma lets one filter give both.

## A comma between two filters

Write two filters with a comma between them:

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

- `.name` runs on the input and gives the first output.
- `.email` runs on the same input and gives the second output.
- jq prints what the left filter gives first, then what the right filter gives.

Read `a, b` as "`a`, and then `b`".

The result is two outputs, each on its own line. It is not one array.

You can list more than two: `.name, .email, .age` gives three outputs.

<!-- task -->

## A comma after a pipe

A pipe cuts a filter into steps. A comma stays inside one step. So after a pipe, both sides of the comma work on what the step before gave:

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

`.user` gives the inner object. Then `.name` and `.email` both run on that inner object.

This is also a trap. Say you want the name and the plan:

```jq
.user | .name, .plan
```

```json
"Ada"
null
```

`.plan` ran on the inner object too, and the inner object has no `plan`. The plan is in the outer object. To fix it, drop the pipe and give each side its full path: `.user.name, .plan`.

<!-- task -->

## Several things from every item

`.[]` gives every item of an array as its own output. What follows the pipe runs once for each item. Put a comma there, and each item gives several outputs:

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

Look at the order. jq finishes the first item before it starts the second. You get the name and city of Ada, then the name and city of Bo. You do not get all the names first.

Two items with two values each give four outputs.

<!-- task -->

## Remember

- `a, b` gives the outputs of `a`, then the outputs of `b`.
- Both sides run on the same input.
- The result is several outputs, not one array.
- After a pipe, both sides of the comma work on what the step before gave. An unexpected `null`? One side may need a full path.
- `.[] | .name, .city` gives the values item by item.
