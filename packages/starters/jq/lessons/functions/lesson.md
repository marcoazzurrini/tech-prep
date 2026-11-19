# Your Own Filters with def

`def name: body;` gives a filter a name. Write it at the start, then use the name like any builtin. A long program then reads in small steps, and a step you need twice is written once.

## Worked example

Turn the title and every tag into lower case with dashes for spaces.

**Input**

```json
{
  "title": "Getting Started",
  "tags": ["How To", "Quick Tips"]
}
```

**Filter**

```jq
def slug: ascii_downcase | gsub(" "; "-");
{title: (.title | slug), tags: (.tags | map(slug))}
```

**Output**

```json
{
  "title": "getting-started",
  "tags": [
    "how-to",
    "quick-tips"
  ]
}
```

## Why it works

- `def slug: ...;` names the two steps. The `;` ends the definition.
- `slug` runs on its input, like `length` does. So `.title | slug` and `map(slug)` both work.
- A definition can take a filter as an argument. With `def total(f): map(f) | add;`, the call `total(.price)` runs `map(.price) | add`.

## When to use it

- The same step is needed in two or more places.
- A filter is long and hard to read: name its parts.
- You get `slug/0 is not defined`: the `def` is missing or comes after its use. A syntax error right after the `def` means the `;` is missing.
