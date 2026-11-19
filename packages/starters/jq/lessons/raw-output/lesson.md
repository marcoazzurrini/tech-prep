# Plain Text with -r

jq prints every value as JSON. So a string comes out with quotes around it. The `-r` flag prints strings as plain text, with no quotes. That is the form the shell and other tools need.

## Worked example

Print the host name of every server as plain text.

**Input**

```json
[
  {"host": "web-1", "port": 443},
  {"host": "db-1", "port": 5432}
]
```

**Command**

```sh
jq -r '.[] | .host' servers.json
```

**Output**

```text
web-1
db-1
```

## Why it works

- `.[] | .host` gives one string for each server.
- `-r` prints each string as it is, on its own line. Without `-r`, jq prints `"web-1"` and `"db-1"`.
- The flag goes before the filter. The filter stays inside single quotes.

## When to use it

- The task says "plain text", "no quotes" or "one per line".
- You pass the output to the shell: to a loop, to `grep` or into a variable.
- Your output has quotes that you do not want: you forgot `-r`.
- `-r` only changes strings. Numbers, arrays and objects print the same as before.
