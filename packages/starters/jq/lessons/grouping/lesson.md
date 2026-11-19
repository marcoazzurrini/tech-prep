# Group Items

You have a list of people, and each one has a team. You want to know something about each team, such as how many people it has. For that, you first put the people of the same team together.

## Split an array into groups

Use `group_by` and put the field in round brackets, as with `sort_by`.

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

Read `group_by(.team)` as "group by team". Look at the shape of the output. It is an array of arrays.

- Each inner array is one **group**: all items with the same team.
- There are two teams, so there are two groups.
- The groups are ordered by the field: `core` comes before `web`.

No item is lost. The items only moved into groups.

<!-- task -->

## Work on each group

The groups alone are rarely the answer. The next step turns each group into something smaller.

The output of `group_by` is an array. So `map` can run a filter on each of its items. Here each item is one group. Inside `map`, the dot is one group: an array of people.

**Filter**

```jq
group_by(.team) | map(length)
```

**Output**

```json
[2, 1]
```

- `group_by(.team)` gives the two groups you saw above.
- `map(length)` replaces each group by its size.

The `core` group has 2 people and the `web` group has 1. The numbers come in the order of the groups.

<!-- task -->

## A summary for each group

`[2, 1]` does not say which team each number belongs to. So build an object for each group, with the team and the count:

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

Inside the curly braces `{ }`, the dot is still one group.

- `.[0].team` takes the team from the first person of the group. All people in a group have the same team, so the first one will do.
- `length` counts the people of the group.

A group is an array, and an array has no keys. `team: .team` stops with `Cannot index array with string "team"`. Go to the first item first.

Any filter that works on an array fits inside the braces. `names: map(.name)` gives the names of the people in the group.

<!-- task -->

## Remember

- `group_by(.field)` gives an array of groups. Each group is an array of the items with the same value.
- The groups are ordered by the value of the field.
- `map` runs a filter on each group. `map(length)` gives the size of each group.
- For a summary, build an object for each group: `map({team: .[0].team, count: length})`.
- `.[0].field` reads the shared value from the first item of a group.
