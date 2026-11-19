# Tell Value Kinds Apart

Real data is not always the kind you expect. One service sends an id as the number `42`. Another sends the string `"42"`. They look alike, but jq treats them in different ways. You need to ask what kind a value is.

## Ask for the kind of a value

JSON has six kinds of value. The named filter `type` tells you which kind its input is:

**Input**

```json
{"id": "1042", "qty": 3}
```

**Filter**

```jq
.id | type
```

**Output**

```json
"string"
```

Read `.id | type` as "take `id`, then name its kind". `.id` gives `"1042"`. It has quotes, so it is a string, not a number.

`type` gives one of six strings:

- `"string"`
- `"number"`
- `"boolean"`, for `true` and `false`
- `"null"`
- `"array"`
- `"object"`

A missing key gives `null`. So for this input, `.price | type` gives `"null"`.

<!-- task -->

## Test for one kind

Often you do not want the name of the kind. You want a yes or a no: is this a number? Compare the output of `type` with the name you expect:

**Input**

```json
{"id": "1042", "qty": 3}
```

**Filter**

```jq
.qty | type == "number"
```

**Output**

```json
true
```

The pipe hands `3` to the test. `type` gives `"number"`. Then `==` compares it with `"number"`, and the answer is `true`.

The name of a kind is a string, so it needs double quotes. Leave them out, and jq stops:

```jq
.qty | type == number
```

```text
jq: error: number/0 is not defined at <top-level>, line 1:
```

Read it as "I do not know a filter called `number`". Without quotes, jq takes the word for the name of a filter. Add the quotes to fix it.

<!-- task -->

## Join a kind test with other tests

After the pipe, you can ask more than one question about the same value. Join the questions with `or` or `and`.

Two kinds are fine:

```jq
.zip | type == "string" or type == "number"
```

This gives `true` for `"0150"` and for `150`. It gives `false` for `null`.

You can also test the kind first and the value second. After the pipe, `.` is the value itself:

**Input**

```json
{"id": "1042", "qty": "3"}
```

**Filter**

```jq
.qty | type == "number" and . > 0
```

**Output**

```json
false
```

Why test the kind first? jq compares a string with a number without an error. For jq, every string is greater than every number. So `.qty > 0` alone gives `true` here, and that hides the bad data.

<!-- task -->

## Remember

- `type` gives the kind of its input as a string.
- The six names are `"string"`, `"number"`, `"boolean"`, `"null"`, `"array"` and `"object"`.
- A missing key gives `null`, so its kind is `"null"`.
- Test a kind with `==`, and put the name in quotes: `.qty | type == "number"`.
- Test the kind before you compare the value: `type == "number" and . > 0`.
