# Convert Text and Numbers

## From a string to a number

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

```steps
.age => "36"
.age «| tonumber» => 36
```

**Rule:** `tonumber` turns a string that holds a number into that number. The quotes are gone.

`{name: .name, age: .age | tonumber}` gives `{"name": "Ada", "age": 36}`. You can convert anywhere a value goes.

`"n/a" | tonumber` stops with an error that ends with `while parsing 'n/a'`. The string must hold a number and nothing else. A number that goes in comes out the same.

<!-- task -->

## From a number to a string

**Input**

```json
{"id": 42, "others": ["43", true, null]}
```

**Filter**

```jq
.id | tostring
```

**Output**

```json
"42"
```

**Filter**

```jq
[.others[] | tostring]
```

**Output**

```json
["43", "true", "null"]
```

**Rule:** `tostring` turns any value into a string. The quotes tell you it is text now.

`"43" | tostring` gives `"43"`. A string stays as it is. No extra quotes are added.

<!-- task -->

## jq never converts by itself

**Input**

```json
{"page": "3", "per_page": 20}
```

**Filter**

```jq
.page | tonumber | . + 1
```

**Output**

```json
4
```

```steps
.page => "3"
.page «| tonumber» => 3
.page | tonumber «| . + 1» => 4
```

**Rule:** jq never turns `"3"` into `3` for you. Convert first, then do the sum.

`2 + 3` gives `5`. `+` adds two numbers. `. + 1` adds 1 to the value from the step before.

**Common mistake:** A sum with a string.

**Wrong**

```jq
.page + 1
```

**Error**

```text
jq: error: string ("3") and number (1) cannot be added
```

**Fix**

```jq
.page« | tonumber | .» + 1
```

One side is a string and the other is a number. When you see "cannot be added", look at the kinds of your values.

<!-- task -->

## Remember

- `"36"` is a string and `36` is a number. The quotes tell you which one you have.
- `tonumber` turns a string that holds a number into that number.
- `tostring` turns any value into a string. A string stays as it is.
- jq never converts by itself. Convert first, then do the sum: `.page | tonumber | . + 1`.
