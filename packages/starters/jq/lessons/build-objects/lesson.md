# Build a New Object

An API reply often has dozens of keys. You want three of them, maybe under better names. So far you can take values out. Now you build a new object to put them in.

## Curly braces, a key and a filter

Write curly braces. Inside, write a key, a colon, and a filter that gives the value:

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

- `name:` is a key of the new object. You choose it.
- `.login` is a filter. It runs on the input and gives the value.
- A comma separates one pair from the next.

Read it as "an object where `name` is the input's `login`, and `id` is the input's `id`".

The value needs its dot. Write `{name: login}` and jq looks for a named filter called `login`. There is none, so jq stops:

```text
jq: error: login/0 is not defined at <top-level>, line 1:
```

When you see "is not defined", check for a missing dot.

<!-- task -->

## The short form

Often the new key has the same name as the old one: `{id: .id}`. You may write that as `{id}`. It means the same.

You can mix short pairs and full pairs. The value of a full pair can be a path:

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

- `id` is short for `id: .id`.
- `login` is short for `login: .login`.
- `city: .address.city` walks into `address` and stores the city under the key `city`.

The short form works only for a key at the top of the input. For a value deeper down, write the key and a path.

<!-- task -->

## One object for each item

Most of the time the input is an array of big objects, and you want a small object for each one. You know the tools:

- `.[]` gives every item as its own output.
- What follows the pipe runs once for each item.
- Square brackets around the whole filter collect the outputs into one array.

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

Inside the curly braces, the dot is one item, not the whole array. So `.login` is the login of that item.

Without the outer square brackets you get the two objects as two separate outputs.

<!-- task -->

## Remember

- `{name: .login}` builds an object. The key is yours, and the value comes from a filter.
- Separate the pairs with commas.
- `{id}` is short for `{id: .id}`.
- "is not defined" often means a value lost its dot.
- `[.[] | {id, name: .login}]` builds a small object for each item and collects them into one array.
