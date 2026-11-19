# One Line per Value with -c

jq prints its output in a tidy way, spread over many lines. That is good for your eyes. But many terminal tools read their input line by line. They need each value on one line.

## The -c flag

Here is a small file, `server.json`:

```json
{"host": "web-1", "ports": [80, 443], "up": true}
```

Run jq on it as you always did:

```sh
jq '.' server.json
```

```json
{
  "host": "web-1",
  "ports": [
    80,
    443
  ],
  "up": true
}
```

One value takes eight lines. Now add the flag `-c`:

```sh
jq -c '.' server.json
```

```json
{"host":"web-1","ports":[80,443],"up":true}
```

The same value takes one line. jq also leaves out every space it does not need.

The `c` stands for **compact**, which means "packed small". The flag does not change the value. It changes only how jq prints it.

Like `-r`, the flag goes between `jq` and the filter.

<!-- task -->

## One line for each output

`-c` gives one line to each **output**. It does not join outputs together.

Here is `commits.json`:

```json
[{"sha": "a1f", "author": "ada"}, {"sha": "c07", "author": "bo"}, {"sha": "e92", "author": "ada"}]
```

The filter `.` gives one output: the whole array. So `-c` prints one line:

```sh
jq -c '.' commits.json
```

```json
[{"sha":"a1f","author":"ada"},{"sha":"c07","author":"bo"},{"sha":"e92","author":"ada"}]
```

That is the common mistake. A tool that reads line by line sees one long line here, not three commits.

The filter `.[]` gives every item as its own output. Now `-c` prints one line for each commit:

```sh
jq -c '.[]' commits.json
```

```json
{"sha":"a1f","author":"ada"}
{"sha":"c07","author":"bo"}
{"sha":"e92","author":"ada"}
```

This is the shape that line tools want. One line is one commit. A tool that counts lines now counts commits. A tool that searches lines now finds whole commits.

<!-- task -->

## Two flags in one command

`-c` changes how jq prints arrays and objects. It does not touch strings. A string still comes out with its quotes. To drop the quotes you need `-r`, as before.

You can use both flags in one command. Here is `form.json`:

```json
[{"question": "name", "answer": "Ada"}, {"question": "langs", "answer": ["ts", "go"]}]
```

One answer is a string. The other is an array. With `-r` alone, the array spreads over several lines:

```sh
jq -r '.[] | .answer' form.json
```

```text
Ada
[
  "ts",
  "go"
]
```

With both flags, each answer takes one line, and the string has no quotes:

```sh
jq -c -r '.[] | .answer' form.json
```

```text
Ada
["ts","go"]
```

Put a space between the two flags. Their order does not matter: `-r -c` does the same.

<!-- task -->

## Remember

- By default jq spreads an array or an object over many lines.
- `-c` prints each output on one line, with no extra spaces.
- `-c` does not join outputs. `jq -c '.'` prints an array as one line. `jq -c '.[]'` prints one line for each item.
- `-c` does not change strings. Add `-r` to drop their quotes: `jq -c -r '...'`.
- A flag goes between `jq` and the filter, outside the single quotes.
