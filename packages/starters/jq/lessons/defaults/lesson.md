# Fill Gaps with a Default

Real data has gaps. One user has a nickname, the next has none. A missing key gives `null`, and `null` is rarely what you want to print. You want to say what to use in its place.

## Say what to use when a value is missing

Write `//` after a filter, then the value to use when there is nothing:

**Input**

```json
{"name": "Bo", "city": "Bergen"}
```

**Filter**

```jq
.nickname // "none"
```

**Output**

```json
"none"
```

Read `.nickname // "none"` as "take `nickname`, or else `"none"`". The value after `//` is called the **default**. Here it is written as JSON: a string in double quotes.

When the user does have a nickname, jq prints the nickname. The default is not used.

The default is used in two cases: the left side gives `null`, or it gives `false`. A key that is missing gives `null`, so it gets the default too. Every other value is kept, also `0` and the empty string `""`.

<!-- task -->

## The default can be another path

The default does not have to be a fixed value. It can be any filter. Often it is a second place to look:

**Input**

```json
{"name": "Bo Lind", "nickname": null}
```

**Filter**

```jq
.nickname // .name
```

**Output**

```json
"Bo Lind"
```

Read it as "take `nickname`, or else take `name`".

You can write several in a row. jq goes from left to right and gives the first one that is not `null` or `false`:

```jq
.nickname // .name // "no name"
```

- A user with a nickname: jq prints the nickname.
- No nickname, but a name: jq prints the name.
- Neither: jq prints `"no name"`.

<!-- task -->

## A default inside a chain

Some filters stop with an error when they get `null`. `keys` is one of them:

**Input**

```json
{"name": "web", "labels": null}
```

**Filter**

```jq
.labels | keys
```

```text
jq: error: null (null) has no keys
```

Read the error as "the value here is `null`, and `null` has no keys". The fix is to fill the gap before the pipe. An empty object is written `{}`:

**Filter**

```jq
.labels // {} | keys
```

**Output**

```json
[]
```

jq works out `.labels // {}` first, as one step. Then the pipe hands the result to `keys`. An empty object has no keys, so you get an empty array and no error.

For a missing array, the default is `[]`. For a missing number, it is often `0`.

<!-- task -->

## Remember

- `a // b` gives `a`. When `a` is `null` or `false`, it gives `b`.
- A missing key gives `null`, so it gets the default too.
- `0` and `""` are real values. They are kept.
- The default can be a value, such as `"none"`, `0`, `[]` or `{}`, or another path: `.nickname // .name`.
- Fill the gap before the pipe: `.labels // {} | keys`.
