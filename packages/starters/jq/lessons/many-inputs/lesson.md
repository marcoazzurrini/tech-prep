# Many Inputs in One File

So far an input was one JSON value. A log file is different. A program adds one line to it for each event, and each line is a whole JSON value. There is no array around them.

## The filter runs once for each value

Here is `app.log`. It holds three values, one per line:

```json
{"level": "info", "msg": "started"}
{"level": "error", "msg": "disk full"}
{"level": "info", "msg": "stopped"}
```

jq needs no flag to read it:

```sh
jq '.level' app.log
```

```json
"info"
"error"
"info"
```

This is what jq does:

- It reads the first value and runs the filter on it. It prints the result.
- It reads the second value and runs the filter again.
- It goes on until the file ends.

So the filter runs three times here, once for each value. In each run, `.` is one line of the file. The filter never sees the other lines.

You write the filter for **one** value. jq repeats it for you.

In the next task nothing runs while you type. You read the input and the filter, and you type what jq will print.

<!-- task -->

## One line in, one line out

Often you want a smaller log: the same lines, with only the part you care about. The result should be a file of the same kind, with one value per line.

Here is `events.log`:

```json
{"event": "login", "user": {"id": 7, "name": "ada"}}
{"event": "upload", "user": {"id": 9, "name": "bo"}}
```

Without a flag, jq spreads each output over several lines:

```sh
jq '.user' events.log
```

```json
{
  "id": 7,
  "name": "ada"
}
{
  "id": 9,
  "name": "bo"
}
```

Two lines went in and eight came out. Add `-c`, and each output takes one line again:

```sh
jq -c '.user' events.log
```

```json
{"id":7,"name":"ada"}
{"id":9,"name":"bo"}
```

`-r` works the same way here. `jq -r '.msg' app.log` prints each message as plain text, one per line.

<!-- task -->

## All the values as one array

Some questions are about all the lines together. How many lines are there? Which line is the last?

A filter that sees one line cannot answer. Try to count the lines of `app.log`:

```sh
jq 'length' app.log
```

```json
2
2
2
```

That is wrong. `length` ran three times. Each time it counted the keys of one object.

The flag `-s` changes how jq reads. It first puts every value of the file into one array. Then it runs the filter **once**, on that array.

```sh
jq -s 'length' app.log
```

```json
3
```

With `-s` the input is an ordinary array. All you know about arrays works: `.[0]`, `.[-1]`, `length` and `map`.

```sh
jq -s '.[-1].msg' app.log
```

```json
"stopped"
```

Without `-s`, that filter stops with `Cannot index object with number`. Each line is an object, not an array.

You can add `-c` or `-r` next to `-s`, with a space between the flags.

<!-- task -->

## Remember

- A file may hold many JSON values, one per line. jq reads them with no flag.
- jq runs the filter once for each value. In each run, `.` is one value.
- Add `-c` to get one line out for each line in.
- `-s` puts all the values into one array and runs the filter once on it.
- Use `-s` when the question is about all the lines together, such as how many there are.
