# Build Objects with { }

`{ }` builds a new object. For each key, write the key, then `:`, then a filter that gives the value. `{id}` is short for `{id: .id}`.

## Worked example

Keep three facts about a code repo. Give two of them a new name.

**Input**

```json
{
  "full_name": "acme/api",
  "stargazers": 120,
  "language": "Go",
  "private": false
}
```

**Filter**

```jq
{repo: .full_name, stars: .stargazers, language}
```

**Output**

```json
{
  "repo": "acme/api",
  "stars": 120,
  "language": "Go"
}
```

## Why it works

- `repo: .full_name` makes the key `repo`. Its value is the `full_name` field of the input.
- `stars: .stargazers` gives a new name in the same way.
- `language` alone is short for `language: .language`. The key keeps its name.

## When to use it

- The task says "an object with the keys", "only the fields" or "rename".
- You have many items. Build one object for each item: `[.[] | {id, name}]`.
- A key shows `null`. The input has no field with that name. Check the spelling, or write `key: .other_name`.
