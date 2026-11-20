# Read a Value from an Object

## A dot and a key

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

**Rule:** `.key` gives the value stored under `key`. The value comes alone, without its key.

`.Email` is a different key from `.email`. The key must match exactly, capital letters included.

<!-- task -->

## A key that is not there gives null

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

**Rule:** A key that is not there gives `null`, not an error. Missing data does not stop your command.

**Common mistake:** A spelling mistake in the key.

**Wrong**

```jq
.«N»ame
```

**Output**

```json
null
```

**Fix**

```jq
.«n»ame
```

A wrong spelling is a key that is not there. When you see `null` and did not expect it, check the spelling first.

<!-- task -->

## Keys with spaces or dashes

**Input**

```json
{"first-name": "Ada", "status": 200}
```

**Filter**

```jq
.["first-name"]
```

**Output**

```json
"Ada"
```

**Rule:** For a key with a space or a dash, write `.["the key"]`: double quotes inside square brackets.

`.["status"]` means the same as `.status`. The short form is easier to read, so use it when you can.

`jq .["first-name"] data.json`, without the single quotes, fails too. The terminal removes the double quotes, and jq stops with the same error as below.

**Common mistake:** The dot form for a key with a dash.

**Wrong**

```sh
jq '.first-name' data.json
```

**Error**

```text
jq: error: name/0 is not defined at <top-level>, line 1:
```

**Fix**

```sh
jq '.«["first-name"]»' data.json
```

jq reads the dash as a minus sign. Then it looks for a filter called `name`, and there is none.

<!-- task -->

## Remember

- `.key` takes the value stored under `key`. The key must match exactly, capital letters included.
- A missing key gives `null`, not an error. An unexpected `null`? Check the spelling.
- For a key with spaces or dashes, write `.["the key"]`.
- Keep the single quotes around the filter. Without them, the terminal removes the double quotes inside it.
