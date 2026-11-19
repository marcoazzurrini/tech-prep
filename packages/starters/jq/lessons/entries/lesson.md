# Objects as Lists of Pairs

Some objects use their keys as data. In `{"ada": 12, "bo": 7}` the keys are user names. With `.ada` you can read one value, but only when you know the key. To work on every key and its value, you first turn the object into an array.

## From an object to pairs

`to_entries` is a named filter. Give it an object. It gives back an array with one item for each key. An **entry** is a key together with its value.

**Input**

```json
{"ada": 12, "bo": 7}
```

**Filter**

```jq
to_entries
```

**Output**

```json
[
  {"key": "ada", "value": 12},
  {"key": "bo", "value": 7}
]
```

Each entry is a small object with two keys. They are always named `key` and `value`.

- `key` holds the old key, as a string.
- `value` holds what was stored under it.

The entries come in the order of the object.

<!-- task -->

## Work on the pairs

Now you have an array, so `map` can work on each entry. Inside `map`, `.key` is the old key and `.value` is the old value. You can build a clearer object from them:

**Input**

```json
{"ada": 12, "bo": 7}
```

**Filter**

```jq
to_entries | map({user: .key, commits: .value})
```

**Output**

```json
[
  {"user": "ada", "commits": 12},
  {"user": "bo", "commits": 7}
]
```

A common mistake is to leave out `to_entries`. Then jq stops with an error:

```text
jq: error: Cannot index number with string "key"
```

Without `to_entries`, `map` runs on the values alone: `12` and `7`. A number has no `key` inside it. Put `to_entries` before `map`.

<!-- task -->

## From pairs back to an object

`from_entries` goes the other way. Give it an array of entries. It gives back one object.

This lets you build an object from a list. First make an entry from each item, with the names `key` and `value`. Then join the entries.

**Input**

```json
[
  {"name": "web", "port": 8080},
  {"name": "db", "port": 5432}
]
```

**Filter**

```jq
map({key: .name, value: .port}) | from_entries
```

**Output**

```json
{"web": 8080, "db": 5432}
```

- `map({key: .name, value: .port})` gives `[{"key": "web", "value": 8080}, {"key": "db", "value": 5432}]`.
- `from_entries` turns each entry into one key of the new object.

Now `.web` gives the port of the web service.

<!-- task -->

## Remember

- `to_entries` turns an object into an array of entries. Each entry is `{"key": ..., "value": ...}`.
- After `to_entries` you can use `map` on the entries, with `.key` and `.value`.
- `from_entries` turns an array of entries back into one object.
- To build an object from a list: `map({key: ..., value: ...}) | from_entries`.
- `Cannot index number with string "key"` means `to_entries` is missing.
