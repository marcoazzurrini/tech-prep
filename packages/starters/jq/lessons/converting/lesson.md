# Convert Text and Numbers

`8080` is a number. `"8080"` is a string that looks like a number. For jq these are two different values. Many APIs and files send numbers as strings. To **convert** a value means to change it from one kind into the other.

## From a string to a number

`tonumber` takes a string that looks like a number and gives the number:

**Input**

```json
{"name": "Ada", "age": "36"}
```

**Filter**

```jq
.age | tonumber
```

**Output**

```json
36
```

Look at the quotes. `.age` alone prints `"36"`, with quotes: a string. After `tonumber` the quotes are gone: a number.

`tonumber` takes nothing in parentheses. A number that goes in comes out the same.

You can convert anywhere a value goes, also in an object you build: `{name: .name, age: .age | tonumber}` gives `{"name": "Ada", "age": 36}`.

The string must hold a number and nothing else. With an age of `"n/a"`, jq stops:

```text
jq: error: Invalid numeric literal at EOF at line 1, column 3 (while parsing 'n/a')
```

The useful part is at the end: jq could not read `n/a` as a number.

<!-- task -->

## From a number to a string

`tostring` goes the other way. It turns its input into a string:

**Input**

```json
{"id": 42, "title": "Login fails"}
```

**Filter**

```jq
.id | tostring
```

**Output**

```json
"42"
```

The quotes are back. The value is now text.

You need this when ids must all be of one kind. Some systems send the id `42` and others send `"42"`. Run `tostring` on each one, and all of them are strings: on `[42, "43"]`, the filter `[.[] | tostring]` gives `["42", "43"]`.

`tostring` works on every kind of value:

- A string stays as it is. `"42"` gives `"42"`. No extra quotes are added.
- `true` gives `"true"`, and `null` gives `"null"`.

<!-- task -->

## jq never converts by itself

Some tools turn `"3"` into `3` for you when it looks right. jq never does. You see this as soon as you do sums.

`+` adds two numbers: `2 + 3` gives `5`. Now try it on a string:

**Input**

```json
{"page": "3", "per_page": 20}
```

**Filter**

```jq
.page + 1
```

jq stops with an error:

```text
jq: error: string ("3") and number (1) cannot be added
```

Read it as "one side is a string and the other is a number, and I cannot add those". The fix is to convert first:

**Filter**

```jq
.page | tonumber | . + 1
```

**Output**

```json
4
```

- `.page` gives `"3"`.
- `tonumber` gives `3`.
- `. + 1` adds 1 to the value from the step before. It gives `4`.

When you see "cannot be added" in an error, look at the kinds of your values.

<!-- task -->

## Remember

- `"36"` is a string and `36` is a number. The quotes tell you which one you have.
- `tonumber` turns a string that holds a number into that number.
- `tostring` turns any value into a string. A string stays as it is.
- jq never converts by itself. `"3" + 1` is an error.
- Convert first, then do the sum: `.page | tonumber | . + 1`.
