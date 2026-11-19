# Maths and + on Each Type

`+` works on four types. It adds numbers, joins strings, joins arrays and merges objects. `-`, `*`, `/` and `%` do maths on numbers. `%` gives the rest of a division.

Both sides of `+` must have the same type. jq never turns a number into a string by itself.

## Worked example

Give the full name of a person and the age they reached.

**Input**

```json
{
  "first": "Ada",
  "last": "Lovelace",
  "born": 1815,
  "died": 1852
}
```

**Filter**

```jq
{name: (.first + " " + .last), age: (.died - .born)}
```

**Output**

```json
{
  "name": "Ada Lovelace",
  "age": 37
}
```

## Why it works

- `.first + " " + .last` joins three strings into one.
- `.died - .born` takes one number from the other.
- The round brackets keep each sum together inside `{ }`.

The same `+` joins arrays: `[1, 2] + [3]` gives `[1, 2, 3]`. It also merges objects: `{"a": 1} + {"b": 2}` gives `{"a": 1, "b": 2}`. When both objects have the same key, the right side wins.

## When to use it

- The task asks for a total, a difference, a share, or two values joined into one.
- You get the error `string ("a") and number (1) cannot be added`: the two sides have different types. Use `"\(.a)"` to put a number in a string.
- A result is wrong, or the error names `null`: check the field names. A missing field is `null`.
