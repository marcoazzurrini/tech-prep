# Build Text from Values

Sometimes you want a line of text, not JSON: `Ada lives in Oslo`. The pieces are in the input. You need a way to put values into a text.

## A string with a gap in it

A filter can contain a string: text in double quotes. The filter `"hello"` gives the text `"hello"`, whatever the input is.

Inside a string, `\(` opens a gap and `)` closes it. The `\` sign is called a backslash. Write a filter in the gap. jq runs it and puts the result into the text:

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

Read `\(.name)` as "put the name here". All that is outside a gap stays as you typed it, spaces included.

This is called **string interpolation**.

The backslash matters. Leave it out, and jq sees plain text:

```jq
"(.name) lives in (.city)"
```

```json
"(.name) lives in (.city)"
```

There is no error. When your filter comes out as text, look for a missing backslash.

<!-- task -->

## Any filter fits in the gap

The gap takes any filter: a key, a path, or a chain with a pipe. The result does not have to be a string. A number goes into the text as it is:

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

- `\(.age)` puts the number 36 into the text.
- `\(.langs | length)` takes the array, counts its items, and puts the count into the text.

Put a whole array or object in a gap, and it goes into the text as JSON. `"knows \(.langs)"` gives this:

```json
"knows [\"ts\",\"go\"]"
```

`\"` is how JSON writes a double quote inside a string. This is rarely what you want. Put one value or a count in the gap.

<!-- task -->

## One text for each item

A string with gaps is a filter like any other. So you can use it in the places you know.

After `.[]`, it runs once for each item:

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

Inside the string, the dot is one item.

It can also be a value in an object you build. On the input `{"id": 3, "first": "Ada", "last": "Lund"}`, the filter

```jq
{id, name: "\(.first) \(.last)"}
```

gives

```json
{"id": 3, "name": "Ada Lund"}
```

<!-- task -->

## Remember

- A string in a filter is text in double quotes.
- `\(filter)` inside a string is a gap. jq puts the filter's result there.
- The gap takes any filter, such as `.user.name` or `.tags | length`. Numbers go in as they are.
- No backslash, no gap: `"(.name)"` is plain text.
- A string with gaps works after `.[]` and as a value in an object.
