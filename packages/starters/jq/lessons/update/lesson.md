# Change a Value in Place

Until now every filter took data **out**. You asked for one part and got that part alone. Now you want the opposite: keep the whole document, and change one value in it.

jq never changes your file. It prints a changed copy.

## Update a value with |=

First, a little arithmetic. `. + 1` is a filter. It takes a number and gives that number plus 1. In the same way, `. - 1` takes 1 away and `. * 2` doubles.

Now write a path, then `|=`, then a filter:

**Input**

```json
{"name": "lamp", "price": 20, "stock": 7}
```

**Filter**

```jq
.stock |= . + 1
```

**Output**

```json
{
  "name": "lamp",
  "price": 20,
  "stock": 8
}
```

Read `.stock |= . + 1` as "update `stock`: take the old value and add 1".

- The left side is a path. It says **which** value to change.
- The right side is a filter. It gets the **old value** as its input. So here the dot is `7`.
- Everything else stays as it was.

Do not mix up `|=` and `|`. The plain pipe keeps only the part: `.stock | . + 1` prints `8` and nothing else.

<!-- task -->

## Set a new value with =

Sometimes the new value does not depend on the old one. An issue is open, and you want it closed. For that, write a path, then `=`, then the new value:

**Input**

```json
{"id": 12, "state": "open", "owner": {"name": "Ada", "team": "core"}}
```

**Filter**

```jq
.state = "closed"
```

**Output**

```json
{
  "id": 12,
  "state": "closed",
  "owner": {
    "name": "Ada",
    "team": "core"
  }
}
```

Read it as "set `state` to `"closed"`". You write the new value as JSON: text in double quotes, a number such as `2`, or `true` and `false`.

Two more things to know:

- The path can be long. `.owner.team = "infra"` changes the team inside `owner`.
- If the key is not there yet, jq adds it. `.priority = 2` adds a `priority` key at the end.

Use `=` for a fixed new value. Use `|=` when the new value is made from the old one.

<!-- task -->

## Update a list inside the document

The right side of `|=` can be any filter. So it can be `map(f)`, which runs `f` on every item of an array.

**Input**

```json
{"player": "Ada", "scores": [3, 5, 8]}
```

**Filter**

```jq
.scores |= map(. * 10)
```

**Output**

```json
{
  "player": "Ada",
  "scores": [
    30,
    50,
    80
  ]
}
```

Read it in two steps:

- `.scores |=` says: change the value of `scores`. That value is the array `[3, 5, 8]`.
- `map(. * 10)` gets that array and multiplies every item by 10.

The player's name is still there. That is the whole point of `|=`. With a plain pipe, `.scores | map(. * 10)` prints only `[30, 50, 80]`, and the rest of the document is lost.

<!-- task -->

## Remember

- `path |= f` changes the value at the path and keeps everything else.
- On the right side of `|=`, the dot is the old value: `.stock |= . + 1`.
- `path = value` sets a fixed new value. It adds the key if it is missing.
- `|` keeps only the part. `|=` keeps the whole document.
- jq prints a changed copy. Your file stays the same.
