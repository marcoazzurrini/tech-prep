# Many Inputs in One File

## The filter runs once for each value

**Input**

```json
{"level": "info", "msg": "started"}
{"level": "error", "msg": "disk full"}
{"level": "info", "msg": "stopped"}
```

**Command**

```sh
jq '.level' data.jsonl
```

**Output**

```json
"info"
"error"
"info"
```

**Rule:** A file may hold many JSON values, one per line, with no array around them. jq runs the filter once for each value.

`.` is one line of the file in each run. The filter never sees the other lines, and jq needs no flag to read them.

`data.jsonl` is the name of the file in the tasks of this lesson, not `data.json`. The `l` stands for "lines".

<!-- task -->

## One line in, one line out

**Input**

```json
{"event": "login", "user": {"id": 7, "name": "ada"}}
{"event": "upload", "user": {"id": 9, "name": "bo"}}
```

**Command**

```sh
jq '.user' data.jsonl
```

**Output**

```text
{
  "id": 7,
  "name": "ada"
}
{
  "id": 9,
  "name": "bo"
}
```

**Command**

```sh
jq -c '.user' data.jsonl
```

**Output**

```text
{"id":7,"name":"ada"}
{"id":9,"name":"bo"}
```

**Rule:** Add `-c` to get one line out for each line in. The result is a file of the same kind.

`jq -r '.event' data.jsonl` prints `login` and `upload` as plain text, one per line. `-r` works the same way here.

<!-- task -->

## All the values as one array

**Input**

```json
{"level": "info", "msg": "started"}
{"level": "error", "msg": "disk full"}
{"level": "info", "msg": "stopped"}
```

**Command**

```sh
jq -s -c '.' data.jsonl
```

**Output**

```text
[{"level":"info","msg":"started"},{"level":"error","msg":"disk full"},{"level":"info","msg":"stopped"}]
```

**Command**

```sh
jq -s '.[-1].msg' data.jsonl
```

**Output**

```json
"stopped"
```

**Rule:** `-s` puts every value of the file into one array. Then it runs the filter **once**, on that array.

`.[0]`, `.[-1]`, `length` and `map` all work with `-s`, because the input is an ordinary array. Use it for a question about all the lines together.

`-c` or `-r` can sit next to `-s`, with a space between the flags.

**Common mistake:** No `-s` for a question about all the lines.

**Wrong**

```sh
jq 'length' data.jsonl
```

**Output**

```json
2
2
2
```

**Fix**

```sh
jq «-s» 'length' data.jsonl
```

Without `-s`, `length` runs three times and counts the keys of one object each time. With `-s` it prints `3`. Without `-s`, `.[-1].msg` stops with `Cannot index object with number`.

<!-- task -->

## Remember

- A file may hold many JSON values, one per line. jq reads them with no flag.
- jq runs the filter once for each value. In each run, `.` is one value.
- Add `-c` to get one line out for each line in.
- `-s` puts all the values into one array and runs the filter once on it.
