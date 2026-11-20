# One Line per Value with -c

## The -c flag

**Input**

```json
{"host": "web-1", "ports": [80, 443], "up": true}
```

**Command**

```sh
jq '.' data.json
```

**Output**

```text
{
  "host": "web-1",
  "ports": [
    80,
    443
  ],
  "up": true
}
```

**Command**

```sh
jq -c '.' data.json
```

**Output**

```text
{"host":"web-1","ports":[80,443],"up":true}
```

**Rule:** `-c` prints the value on one line, with no spaces it does not need. Many terminal tools read line by line.

`-c` is short for **compact**: packed small. It does not change the value. It changes only how jq prints it.

`-c` goes between `jq` and the filter, outside the single quotes, like `-r`.

<!-- task -->

## One line for each output

**Input**

```json
[{"sha": "a1f", "author": "ada"}, {"sha": "c07", "author": "bo"}, {"sha": "e92", "author": "ada"}]
```

**Command**

```sh
jq -c '.[]' data.json
```

**Output**

```text
{"sha":"a1f","author":"ada"}
{"sha":"c07","author":"bo"}
{"sha":"e92","author":"ada"}
```

**Rule:** `-c` gives one line to each output. It does not join outputs, and it does not split one.

**Common mistake:** A filter that gives the whole array as one output.

**Wrong**

```sh
jq -c '«.»' data.json
```

**Output**

```text
[{"sha":"a1f","author":"ada"},{"sha":"c07","author":"bo"},{"sha":"e92","author":"ada"}]
```

**Fix**

```sh
jq -c '«.[]»' data.json
```

A tool that reads line by line sees one long line, not three commits. `.[]` makes every item its own output, so one line is one commit.

<!-- task -->

## Two flags in one command

**Input**

```json
[{"question": "name", "answer": "Ada"}, {"question": "langs", "answer": ["ts", "go"]}]
```

**Command**

```sh
jq -r '.[] | .answer' data.json
```

**Output**

```text
Ada
[
  "ts",
  "go"
]
```

**Command**

```sh
jq -c -r '.[] | .answer' data.json
```

**Output**

```text
Ada
["ts","go"]
```

**Rule:** `-c` packs arrays and objects onto one line. `-r` drops the quotes of a string. Use both flags to get both.

`-c` alone prints `"Ada"` with its quotes. It does not touch strings.

`-r -c` does the same as `-c -r`. Put a space between the two flags.

<!-- task -->

## Remember

- `-c` prints each output on one line, with no extra spaces.
- `-c` does not join outputs. `jq -c '.'` prints an array as one line. `jq -c '.[]'` prints one line for each item.
- `-c` does not change strings. Add `-r` to drop their quotes: `jq -c -r '...'`.
- A flag goes between `jq` and the filter, outside the single quotes.
