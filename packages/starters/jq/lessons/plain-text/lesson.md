# Plain Text with -r

## A flag changes how jq works

**Input**

```json
{"name": "Ada", "city": "Oslo"}
```

**Command**

```sh
jq '.name' data.json
```

**Output**

```text
"Ada"
```

**Command**

```sh
jq -r '.name' data.json
```

**Output**

```text
Ada
```

**Rule:** A flag is an extra word between `jq` and the filter. `-r` prints a string as plain text, without the quotes.

`-r` stands for "raw output". A flag starts with a dash. It does not change the filter. It changes how jq works.

`-r` is only for tasks that ask for plain text. There, the output must match as text, so a missing `-r` makes the task fail. In the other lessons the wanted output keeps its quotes, so an extra `-r` makes the task fail.

<!-- task -->

## Only strings change

**Input**

```json
{"name": "Ada", "age": 36, "langs": ["ts", "go"]}
```

**Command**

```sh
jq -r '.langs | .[]' data.json
```

**Output**

```text
ts
go
```

**Rule:** `-r` changes only an output that is a string. So make each string its own output.

`jq -r '.age' data.json` prints `36`. A number, `true`, `false` and `null` have no quotes, so they look the same with `-r`.

**Common mistake:** `-r` on a whole array.

**Wrong**

```sh
jq -r '.langs' data.json
```

**Output**

```text
[
  "ts",
  "go"
]
```

**Fix**

```sh
jq -r '.langs« | .[]»' data.json
```

The output is an array, not a string, so `-r` did nothing. An array or an object is still printed as JSON, and the strings inside it keep their quotes.

<!-- task -->

## One line for each output

**Input**

```json
[
  {"name": "Ada", "city": "Oslo"},
  {"name": "Bo", "city": "Bergen"}
]
```

**Command**

```sh
jq -r '.[] | .name' data.json
```

**Output**

```text
Ada
Bo
```

```steps
jq '.[]' data.json => {"name": "Ada", "city": "Oslo"} ;; {"name": "Bo", "city": "Bergen"}
jq '.[] «| .name»' data.json => "Ada" ;; "Bo"
jq «-r» '.[] | .name' data.json => Ada ;; Bo
```

**Rule:** jq prints each output on its own line. With `-r`, each string is a clean line of text.

`sort` and other terminal tools read lines like these. With the quotes left on, such a tool would get the quotes too.

<!-- task -->

## Remember

- A flag goes between `jq` and the filter: `jq -r '.name' data.json`.
- `-r` prints a string output as plain text, without quotes. Use it only when a task asks for plain text.
- Numbers look the same. Arrays and objects are still printed as JSON.
- Make each string its own output, with `.[]`, to get one plain line for each.
