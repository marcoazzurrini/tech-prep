# Plain Text with -r

jq prints a string with double quotes, because its output is JSON. Often you want the bare text: a name to paste, or a list of lines for another program. For that, you tell jq to print plain text.

## A flag changes how jq works

Until now your commands had three parts: `jq`, the filter and the file.

```sh
jq '.name' user.json
```

```text
"Ada"
```

A **flag** is an extra word between `jq` and the filter. It starts with a dash. It does not change the filter. It changes how jq works.

The flag `-r` stands for "raw output". With it, jq prints a string as plain text, without the quotes:

```sh
jq -r '.name' user.json
```

```text
Ada
```

In the tasks of this lesson you add the flag yourself. Type it after `jq` and before the filter.

One more thing is different. In these tasks the output must match exactly as text, quotes included. So a missing `-r` makes the task fail.

<!-- task -->

## Only strings change

`-r` changes one thing: how jq prints an output that is a string.

A number, `true`, `false` and `null` have no quotes, so they look the same with `-r`.

An array or an object is still printed as JSON, and the strings inside it keep their quotes. Take the input `{"name": "Ada", "langs": ["ts", "go"]}`:

```sh
jq -r '.langs' user.json
```

```text
[
  "ts",
  "go"
]
```

The output is an array, not a string. So `-r` did nothing.

To get plain text, each string must be its own output. `.[]` does that:

```sh
jq -r '.langs | .[]' user.json
```

```text
ts
go
```

<!-- task -->

## One line for each output

jq prints each output on its own line. With `-r` you get clean lines of text. Other terminal tools read lines like these. One example is `sort`, which puts lines in order. With the quotes left on, such a tool would get the quotes too.

Most of the time you start from an array of objects and want one field as lines. Take every item, then the field:

**Input**

```json
[
  {"name": "Ada", "city": "Oslo"},
  {"name": "Bo", "city": "Bergen"}
]
```

```sh
jq -r '.[] | .name' users.json
```

```text
Ada
Bo
```

`.[]` gives each user as its own output. `.name` takes the name of each one. Each name is a string, so `-r` prints it without quotes.

<!-- task -->

## Remember

- A flag goes between `jq` and the filter: `jq -r '.name' user.json`.
- `-r` prints a string output as plain text, without quotes.
- Numbers look the same. Arrays and objects are still printed as JSON.
- Make each string its own output, with `.[]`, to get one plain line for each.
- The order is: `jq`, the flags, the filter in single quotes, the file.
