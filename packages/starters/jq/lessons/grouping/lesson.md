# Group Items

## Split an array into groups

**Input**

```json
[
  {"name": "Ada", "team": "core"},
  {"name": "Bo", "team": "web"},
  {"name": "Cy", "team": "core"}
]
```

**Filter**

```jq
group_by(.team)
```

**Output**

```json
[
  [
    {"name": "Ada", "team": "core"},
    {"name": "Cy", "team": "core"}
  ],
  [
    {"name": "Bo", "team": "web"}
  ]
]
```

**Rule:** `group_by(.team)` gives an array of arrays. Each inner array is one **group**: all items with the same team.

`group_by(.team)` orders the groups by the field: `core` comes before `web`. No item is lost.

<!-- task -->

## Work on each group

**Input**

```json
[
  {"name": "Ada", "team": "core"},
  {"name": "Bo", "team": "web"},
  {"name": "Cy", "team": "core"}
]
```

**Filter**

```jq
group_by(.team) | map(length)
```

**Output**

```json
[2, 1]
```

```steps
group_by(.team) => [[{"name": "Ada", "team": "core"}, {"name": "Cy", "team": "core"}], [{"name": "Bo", "team": "web"}]]
group_by(.team) «| map(length)» => [2, 1]
```

**Rule:** `map` runs a filter on each group. Inside `map`, the dot is one group: an array of items.

`map(length)` replaces each group by its size. The numbers come in the order of the groups: `core`, then `web`.

<!-- task -->

## A summary for each group

**Input**

```json
[
  {"name": "Ada", "team": "core"},
  {"name": "Bo", "team": "web"},
  {"name": "Cy", "team": "core"}
]
```

**Filter**

```jq
group_by(.team) | map({team: .[0].team, count: length})
```

**Output**

```json
[
  {"team": "core", "count": 2},
  {"team": "web", "count": 1}
]
```

**Filter**

```jq
group_by(.team) | map({team: .[0].team, names: map(.name)})
```

**Output**

```json
[
  {"team": "core", "names": ["Ada", "Cy"]},
  {"team": "web", "names": ["Bo"]}
]
```

**Rule:** Build one object for each group. Inside the braces, the dot is still one group.

`.[0].team` takes the team from the first item of the group. All items of a group have the same team.

**Common mistake:** A key is read from the group itself.

**Wrong**

```jq
group_by(.team) | map({team: «.team», count: length})
```

**Error**

```text
jq: error: Cannot index array with string "team"
```

**Fix**

```jq
group_by(.team) | map({team: «.[0].team», count: length})
```

A group is an array, and an array has no keys. Go to the first item first.

<!-- task -->

## Remember

- `group_by(.field)` gives an array of groups, ordered by the value of the field.
- `map` runs a filter on each group. `map(length)` gives the size of each group.
- For a summary, build an object for each group: `map({team: .[0].team, count: length})`.
- `.[0].field` reads the shared value from the first item of a group.
