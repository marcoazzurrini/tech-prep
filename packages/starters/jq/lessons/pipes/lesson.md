# Chain Steps with a Pipe

## The output of one step is the input of the next

**Input**

```json
{"user": {"name": "Ada", "langs": ["ts", "go"]}}
```

**Filter**

```jq
.user | .langs
```

**Output**

```json
["ts", "go"]
```

```steps
.user => {"name": "Ada", "langs": ["ts", "go"]}
.user «| .langs» => ["ts", "go"]
```

**Rule:** `a | b` runs `a`, then runs `b` on what `a` gave.

`.user.langs` gives the same result. For paths, the dot does the job of the pipe.

`.user | .user` gives `null`. After a pipe, the dot is the inner object, and it has no `user`.

**Common mistake:** No single quotes around the filter.

**Wrong**

```sh
jq .user | .langs data.json
```

**Error**

```text
jq: error: Could not open file |: No such file or directory
```

**Fix**

```sh
jq «'».user | .langs«'» data.json
```

The filter has spaces. Without the quotes, the terminal cuts it into pieces, and jq takes the pieces for file names.

<!-- task -->

## Filters with names

**Input**

```json
{"user": "ada", "repos": ["api", "web", "docs"]}
```

**Filter**

```jq
.repos | length
```

**Output**

```json
3
```

```steps
.repos => ["api", "web", "docs"]
.repos «| length» => 3
```

**Rule:** A filter with a name, such as `length`, works on its input. A pipe hands it the value.

`length` counts the items of an array, the keys of an object, or the characters of a string.

`keys` gives the keys of an object, as an array in alphabetical order.

**Common mistake:** A dot before the name.

**Wrong**

```sh
jq '.repos.length' data.json
```

**Error**

```text
jq: error: Cannot index array with string "length"
```

**Fix**

```sh
jq '.repos« | »length' data.json
```

`.length` asks for a key called `length`. An array has no keys.

<!-- task -->

## Build a chain step by step

**Input**

```json
{"servers": [{"host": "web-1", "port": 443, "tls": true}, {"host": "db-1", "port": 5432}]}
```

**Filter**

```jq
.servers | .[0] | keys | length
```

**Output**

```json
3
```

```steps
.servers => [{"host": "web-1", "port": 443, "tls": true}, {"host": "db-1", "port": 5432}]
.servers «| .[0]» => {"host": "web-1", "port": 443, "tls": true}
.servers | .[0] «| keys» => ["host", "port", "tls"]
.servers | .[0] | keys «| length» => 3
```

**Rule:** Write one step, read the output, then add the next step.

`.servers[0] | keys | length` is a shorter way to write the same chain. Short steps are easier to check.

<!-- task -->

## Remember

- `a | b` runs `a`, then runs `b` on what `a` gave.
- After a pipe, `.` is the output of the step before.
- `length` counts items, keys or characters. `keys` lists the keys of an object.
- A filter with spaces needs its single quotes.
