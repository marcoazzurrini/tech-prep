# What jq Does

## The problem

```json
{"name":"Ada","city":"Oslo","languages":["ts","go"],"active":true}
```

Programs send each other data as **JSON**, often as one long line like this. You usually want one small piece of it, such as the city.

**jq** is a small program for the terminal. It reads JSON, follows your instruction, and prints the result.

## Your first command

**Input**

```json
{"name":"Ada","city":"Oslo","active":true}
```

**Command**

```sh
jq '.' data.json
```

**Output**

```json
{
  "name": "Ada",
  "city": "Oslo",
  "active": true
}
```

**Rule:** The whole command is `jq`, then the **filter** in single quotes, then the file.

`.` is the filter here. A filter is your instruction to jq. `.` means "the whole input", so jq prints everything, in a tidy way.

`data.json` is the file to read. Its content is the **input**.

## In this course

- You type the whole command: `jq`, then the filter in single quotes, then the name of the file.
- The input of a task is in a file. Its name is shown above the input. In most tasks it is `data.json`.
- On the right you see the input, what your command prints, and the output the task wants.

<!-- task -->

## A value goes in, a value comes out

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

**Rule:** A filter takes a value in and gives a value out. `.city` gives the value stored under `city`.

`.` gives back the whole value that went in. Most filters give back a part of it.

`jq '.city' data.json` is the whole command. From here on, a lesson shows the filter alone. In your command it still goes in single quotes.

<!-- task -->

## The output is JSON too

**Input**

```json
{"name": "Ada", "age": 36, "active": true}
```

**Filter**

```jq
.name
```

**Output**

```json
"Ada"
```

**Filter**

```jq
.age
```

**Output**

```json
36
```

**Rule:** jq prints its result as JSON. Text has double quotes. A number has none.

`.active` prints `true`. `true` and `false` have no quotes either.

`"36"` with quotes would be text. If you expect a number and you see quotes, you took the wrong value.

<!-- task -->

## Remember

- The command is `jq 'filter' file.json`. The filter goes in single quotes.
- A filter takes a value in and gives a value out.
- `.` is the whole input. `.name` is the value stored under `name`.
- jq prints JSON. Text has double quotes. Numbers, `true` and `false` have none.
