# One Line per Value with -c

jq pretty-prints by default. An object or an array is spread over many lines. The `-c` flag prints each output value on one line, with no spaces. Tools that read line by line need this.

## Worked example

Print every event on its own line.

**Input**

```json
[
  {"id": 1, "type": "click"},
  {"id": 2, "type": "view"}
]
```

**Command**

```sh
jq -c '.[]' events.json
```

**Output**

```json
{"id":1,"type":"click"}
{"id":2,"type":"view"}
```

## Why it works

- `.[]` gives each event as its own output.
- `-c` prints each output on one line. Without `-c`, each event takes four lines.
- jq also removes the spaces after `:` and `,`.

## When to use it

- The task says "one per line", "on one line" or "with no spaces".
- Another tool reads your output line by line, such as `grep`, `wc -l` or a shell loop.
- Your output is spread over many lines and you wanted one: you forgot `-c`.
- You can join flags: `-r -c` and `-rc` mean the same.
