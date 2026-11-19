# What jq Does

## The problem

Programs send each other data as **JSON**. Ask a web service about a user, and the answer looks like this:

```json
{"name":"Ada","city":"Oslo","languages":["ts","go"],"active":true}
```

It is one long line. Real answers are hundreds of lines long. You usually want one small piece of it, such as the city.

**jq** is a small program for the terminal that does this job. It reads JSON, follows your instruction, and prints the result.

## Your first command

```sh
jq '.' user.json
```

The command has three parts:

- `jq` is the program.
- `'.'` is the **filter**. A filter is your instruction to jq. It goes inside single quotes.
- `user.json` is the file to read. Its content is the **input**.

The filter `.` means "the whole input". So jq prints everything it read. But it prints it in a tidy way, one value per line:

```json
{
  "name": "Ada",
  "city": "Oslo",
  "languages": [
    "ts",
    "go"
  ],
  "active": true
}
```

That is already useful. `jq '.'` turns dense JSON into something you can read.

## In this course

The app runs jq for you. You type only the filter. On the right you see the input, what your filter prints, and the output the task wants.

<!-- task -->

## A value goes in, a value comes out

Every filter works the same way. A value goes in. A value comes out.

- `.` gives back the value that went in.
- Most filters give back **a part** of it.

A dot followed by a name gives the value stored under that name:

**Input**

```json
{"name": "Ada", "city": "Oslo"}
```

**Filter**

```jq
.city
```

**Output**

```json
"Oslo"
```

Read `.city` as "from the input, take `city`". The next lessons teach this step by step. For now, change a filter and watch what happens.

<!-- task -->

## The output is JSON too

jq prints its result as JSON. That is why `"Oslo"` came out with double quotes. In JSON, text always has double quotes.

A number has no quotes. Neither do `true` and `false`.

**Input**

```json
{"name": "Ada", "age": 36, "active": true}
```

- `.name` prints `"Ada"`
- `.age` prints `36`
- `.active` prints `true`

This helps you check your work. If you expect a number and you see quotes, you took the wrong value.

In the next task nothing runs while you type. You read the input and the filter, and you type what jq will print.

<!-- task -->

## Remember

- jq reads JSON, runs your filter on it, and prints JSON.
- A filter takes a value in and gives a value out.
- `.` is the whole input. `jq '.'` makes dense JSON readable.
- `.name` takes the value stored under `name`.
- In a terminal the command is `jq 'filter' file.json`. The filter goes in single quotes.
