# Build Text from Values

## A string with a gap in it

**Input**

```json
{"name": "Ada", "city": "Oslo"}
```

**Filter**

```jq
"\(.name) lives in \(.city)"
```

**Output**

```json
"Ada lives in Oslo"
```

**Rule:** Inside a string, `\(filter)` is a gap. jq runs the filter and puts the result there.

`"hello"` is a string: text in double quotes. As a filter it gives `"hello"`, whatever the input is.

`\` is called a backslash. All that is outside a gap stays as you typed it, spaces included. This is called **string interpolation**.

**Common mistake:** No backslash before the gap.

**Wrong**

```jq
"(.name) lives in (.city)"
```

**Output**

```json
"(.name) lives in (.city)"
```

**Fix**

```jq
"«\»(.name) lives in «\»(.city)"
```

There is no error. When your filter comes out as text, look for a missing backslash.

<!-- task -->

## Any filter fits in the gap

**Input**

```json
{"name": "Ada", "age": 36, "langs": ["ts", "go"]}
```

**Filter**

```jq
"\(.name) is \(.age) and knows \(.langs | length) languages"
```

**Output**

```json
"Ada is 36 and knows 2 languages"
```

**Rule:** The gap takes any filter: a key, a path, or a chain with a pipe.

`\(.age)` gives a number, not a string. The number goes into the text as it is.

**Common mistake:** A whole array in a gap.

**Wrong**

```jq
"knows \(.langs)"
```

**Output**

```json
"knows [\"ts\",\"go\"]"
```

**Fix**

```jq
"knows \(.langs« | length»)"
```

An array or an object goes into the text as JSON. `\"` is how JSON writes a double quote inside a string. Put one value or a count in the gap.

<!-- task -->

## One text for each item

**Input**

```json
[
  {"file": "app.js", "size": 120},
  {"file": "util.js", "size": 48}
]
```

**Filter**

```jq
.[] | "\(.file): \(.size) kB"
```

**Output**

```json
"app.js: 120 kB"
"util.js: 48 kB"
```

```steps
.[] => {"file": "app.js", "size": 120} ;; {"file": "util.js", "size": 48}
.[] «| "\(.file): \(.size) kB"» => "app.js: 120 kB" ;; "util.js: 48 kB"
```

**Filter**

```jq
.[0] | {file, label: "\(.size) kB"}
```

**Output**

```json
{"file": "app.js", "label": "120 kB"}
```

**Rule:** A string with gaps is a filter like any other. It works after `.[]`, and as a value in an object.

`.[] | "\(.file)"` runs the string once for each item. Inside the string, `.` is one item.

<!-- task -->

## Remember

- `\(filter)` inside a string is a gap. jq puts the filter's result there.
- The gap takes any filter, such as `.user.name` or `.tags | length`. Numbers go in as they are.
- No backslash, no gap: `"(.name)"` is plain text.
- A string with gaps works after `.[]` and as a value in an object.
