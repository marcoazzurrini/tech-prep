# Read a Value from an Object

Most JSON you meet is an object. The most common thing you do with jq is take one value out of it.

## A dot and a key

Write a dot, then the key:

**Input**

```json
{"name": "Ada", "email": "ada@example.com", "age": 36}
```

**Filter**

```jq
.email
```

**Output**

```json
"ada@example.com"
```

The dot stands for the input. The key says which value to take. jq gives back the value alone, without its key.

The key must match exactly. `.email` and `.Email` are two different keys.

<!-- task -->

## A key that is not there gives null

Ask for a key the object does not have, and jq does not complain. It prints `null`:

**Input**

```json
{"name": "Ada", "age": 36}
```

**Filter**

```jq
.phone
```

**Output**

```json
null
```

This is handy, because missing data does not stop your command.

It is also a trap. A spelling mistake gives `null` too. When you see `null` and did not expect it, check the spelling of the key first.

<!-- task -->

## Keys with spaces or dashes

`.name` works when the key is made of letters, digits and underscores. Some keys have other characters, such as `content-type` or `first name`. For those, put the key in double quotes inside square brackets:

**Input**

```json
{"content-type": "text/html", "status": 200}
```

**Filter**

```jq
.["content-type"]
```

**Output**

```json
"text/html"
```

`.["status"]` works too. It means the same as `.status`. The short form is easier to read, so use it when you can.

<!-- task -->

## Remember

- `.key` takes the value stored under `key`.
- The key must match exactly, capital letters included.
- A missing key gives `null`, not an error. An unexpected `null`? Check the spelling.
- For a key with spaces or dashes, write `.["the key"]`.
