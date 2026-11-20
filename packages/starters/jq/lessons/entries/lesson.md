# Objects as Lists of Pairs

## From an object to pairs

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

**Rule:** `to_entries` turns an object into an array of entries. An **entry** is a key together with its value.

`to_entries` always names the two parts `key` and `value`. The entries come in the order of the object.

<!-- task -->

## Work on the pairs

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

```steps
to_entries => [{"key": "ada", "value": 12}, {"key": "bo", "value": 7}]
to_entries «| map({user: .key, commits: .value})» => [{"user": "ada", "commits": 12}, {"user": "bo", "commits": 7}]
```

**Rule:** After `to_entries` you have an array, so `map` works. Inside `map`, `.key` is the old key and `.value` is the old value.

`.value.cpu` reads the `cpu` of a value that is an object.

**Common mistake:** `to_entries` is left out.

**Wrong**

```jq
map({user: .key, commits: .value})
```

**Error**

```text
jq: error: Cannot index number with string "key"
```

**Fix**

```jq
«to_entries | »map({user: .key, commits: .value})
```

Without `to_entries`, `map` runs on the values alone: `12` and `7`. The word after `index` is the kind of the values. For string values the error says `Cannot index string with string "key"`.

<!-- task -->

## From pairs back to an object

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

```steps
map({key: .name, value: .port}) => [{"key": "web", "value": 8080}, {"key": "db", "value": 5432}]
map({key: .name, value: .port}) «| from_entries» => {"web": 8080, "db": 5432}
```

**Rule:** `from_entries` turns an array of entries into one object. Each entry becomes one key.

`map({key: .name, value: .port})` makes an entry from each item. The names must be `key` and `value`.

<!-- task -->

## Remember

- `to_entries` turns an object into an array of entries. Each entry is `{"key": ..., "value": ...}`.
- After `to_entries` you can use `map` on the entries, with `.key` and `.value`.
- To build an object from a list: `map({key: ..., value: ...}) | from_entries`.
- `Cannot index number with string "key"` means `to_entries` is missing. For string values it says `Cannot index string`.
