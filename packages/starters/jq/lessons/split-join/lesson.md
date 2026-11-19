# Split and Join Text

Some strings hold several values at once, such as `"ts,go,rust"`. A path cannot reach inside a string. To work on the parts, you first cut the string into an array.

## Cut a string into parts

`split` cuts a string. You tell it where to cut:

**Input**

```json
{"user": "ada", "langs": "ts,go,rust"}
```

**Filter**

```jq
.langs | split(",")
```

**Output**

```json
["ts", "go", "rust"]
```

- `.langs` takes the string.
- `split(",")` cuts it at every comma. The commas are thrown away.
- The output is an array of the parts.

The text in the parentheses is the **separator**: the text that stands between two parts. Write it in double quotes. Read `split(",")` as "cut at every comma".

The separator must match exactly. A common mistake is to forget a space. On `"ts, go, rust"`, the filter `split(",")` gives this:

```json
["ts", " go", " rust"]
```

Two parts start with a space. The fix is to cut at a comma and a space: `split(", ")`.

<!-- task -->

## Glue an array into one string

`join` does the opposite. It takes an array of strings and makes one string. You tell it what to put between the parts:

**Input**

```json
{"user": "ada", "langs": ["ts", "go", "rust"]}
```

**Filter**

```jq
.langs | join(" and ")
```

**Output**

```json
"ts and go and rust"
```

Read `join(" and ")` as "glue the parts with `" and "` between them".

The separator goes only between two parts. There is none at the start and none at the end. So an array with one item gives that item alone.

To glue with nothing between the parts, give an empty string: `join("")`.

<!-- task -->

## Split, then work on the parts

After `split` you have an array. So all you know about arrays works: `.[0]`, `.[-1]`, `length` and `map`.

Say the input is `{"id": "eu-west-1"}`. Build the chain step by step:

- `.id` gives `"eu-west-1"`.
- `.id | split("-")` gives `["eu", "west", "1"]`.
- `.id | split("-") | .[0]` gives `"eu"`.

You can also split and then join with another separator. This swaps one separator for another:

- `.id | split("-") | join(" ")` gives `"eu west 1"`.

Keep in mind which one takes what. `split` needs a string. `join` needs an array. Use `join` on a string, and jq stops:

```text
jq: error: Cannot iterate over string ("eu-west-1")
```

Read it as "this is a string, and I cannot go through its items". Split the string first.

<!-- task -->

## Remember

- `split(",")` cuts a string at every comma and gives an array of the parts.
- `join(", ")` glues an array of strings into one string, with the separator between the parts.
- The separator must match exactly, spaces included.
- After `split` you have an array: use `.[0]`, `.[-1]`, `length` or `map` on it.
- `split` then `join` swaps one separator for another.
