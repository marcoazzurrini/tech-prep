# Group with group_by

`group_by(.field)` splits an array into groups. Items with the same value of the field go into the same group. The result is an array of arrays. Then use `map` to turn each group into a summary.

## Worked example

Count the people in each department.

**Input**

```json
[
  {"name": "Ana", "dept": "ops"},
  {"name": "Ben", "dept": "dev"},
  {"name": "Cho", "dept": "ops"}
]
```

**Filter**

```jq
group_by(.dept) | map({dept: .[0].dept, count: length})
```

**Output**

```json
[
  {
    "dept": "dev",
    "count": 1
  },
  {
    "dept": "ops",
    "count": 2
  }
]
```

## Why it works

- `group_by(.dept)` gives two groups: one array with Ben, and one array with Ana and Cho. The groups are sorted by `dept`. Inside a group, the items keep their input order.
- `map(...)` runs once for each group. Inside it, `.` is one group: an array of people.
- `.[0].dept` reads the department from the first person of the group. `length` counts the people in the group.

## When to use it

- The task says "for each", "per" or "by": one result for each team, day or status.
- You get the error `Cannot index array with string "dept"`: inside `map`, `.` is a group, not one item. Write `.[0].dept`.
