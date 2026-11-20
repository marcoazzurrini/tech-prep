# Build a New Object

## Curly braces, a key and a filter

**Input**

```json
{"login": "ada", "id": 7, "bio": "Writes compilers", "followers": 120}
```

**Filter**

```jq
{name: .login, id: .id}
```

**Output**

```json
{"name": "ada", "id": 7}
```

**Rule:** `{key: filter}` builds an object. You choose the key, and the filter gives the value.

`{name: .login, id: .id}` has two pairs. A comma separates one pair from the next.

**Common mistake:** A value without its dot.

**Wrong**

```jq
{name: login}
```

**Error**

```text
jq: error: login/0 is not defined at <top-level>, line 1:
```

**Fix**

```jq
{name: «.»login}
```

Without the dot, jq looks for a named filter called `login`. When you see `is not defined`, check for a missing dot.

<!-- task -->

## The short form

**Input**

```json
{"id": 7, "login": "ada", "address": {"city": "Oslo", "zip": "0150"}}
```

**Filter**

```jq
{id, login, city: .address.city}
```

**Output**

```json
{"id": 7, "login": "ada", "city": "Oslo"}
```

**Rule:** `{id}` is short for `{id: .id}`. You can mix short pairs and full pairs.

`city: .address.city` is a full pair. Its value can be a path.

`{city}` gives `{"city": null}` here. The short form works only for a key at the top of the input.

<!-- task -->

## One object for each item

**Input**

```json
[
  {"id": 1, "login": "ada", "admin": true},
  {"id": 2, "login": "bo", "admin": false}
]
```

**Filter**

```jq
[.[] | {id, name: .login}]
```

**Output**

```json
[{"id": 1, "name": "ada"}, {"id": 2, "name": "bo"}]
```

```steps
.[] => {"id": 1, "login": "ada", "admin": true} ;; {"id": 2, "login": "bo", "admin": false}
.[] «| {id, name: .login}» => {"id": 1, "name": "ada"} ;; {"id": 2, "name": "bo"}
«[».[] | {id, name: .login}«]» => [{"id": 1, "name": "ada"}, {"id": 2, "name": "bo"}]
```

**Rule:** After `.[]`, the curly braces run once for each item. Inside them, `.` is one item.

`map({id, name: .login})` gives the same array.

<!-- task -->

## Remember

- `{name: .login}` builds an object. The key is yours, and the value comes from a filter.
- `{id}` is short for `{id: .id}`. Commas separate the pairs.
- `is not defined` often means a value lost its dot.
- `[.[] | {id, name: .login}]` builds a small object for each item and collects them into one array.
