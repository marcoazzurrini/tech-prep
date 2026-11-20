# Count Things

## Make the array, then take its length

**Input**

```json
[
  {"name": "Ada", "role": "dev", "active": true},
  {"name": "Bo", "role": "ops", "active": false},
  {"name": "Cy", "role": "dev", "active": true}
]
```

**Filter**

```jq
map(select(.active)) | length
```

**Output**

```json
2
```

```steps
map(select(.active)) => [{"name": "Ada", "role": "dev", "active": true}, {"name": "Cy", "role": "dev", "active": true}]
map(select(.active)) «| length» => 2
```

**Rule:** To count, make an array of what you want, then take its `length`.

`map(select(.active))` alone shows the array. Check that it holds the right items, then add `| length`.

<!-- task -->

## One array, not separate outputs

**Input**

```json
[
  {"name": "Ada", "role": "dev", "active": true},
  {"name": "Bo", "role": "ops", "active": false},
  {"name": "Cy", "role": "dev", "active": true}
]
```

**Filter**

```jq
[.[] | select(.active)] | length
```

**Output**

```json
2
```

```steps
[.[] | select(.active)] => [{"name": "Ada", "role": "dev", "active": true}, {"name": "Cy", "role": "dev", "active": true}]
[.[] | select(.active)] «| length» => 2
```

**Rule:** `length` counts what is inside one value. Collect the outputs into one array first.

`map(select(.active)) | length` gives the same result. `map` does the collecting.

**Common mistake:** Counting after `.[]`, with no array.

**Wrong**

```jq
.[] | select(.active) | length
```

**Output**

```json
3
3
```

**Fix**

```jq
«[».[] | select(.active)«]» | length
```

Neither number is the count. `length` ran once for each active user, and counted the three keys of that object.

<!-- task -->

## Count inside a test

**Input**

```json
[
  {"team": "core", "members": ["ada", "bo", "cy"]},
  {"team": "web", "members": ["dee"]},
  {"team": "ops", "members": ["eli", "fay", "gus", "hal"]}
]
```

**Filter**

```jq
map(select(.members | length > 2)) | length
```

**Output**

```json
2
```

```steps
map(select(.members | length > 2)) => [{"team": "core", "members": ["ada", "bo", "cy"]}, {"team": "ops", "members": ["eli", "fay", "gus", "hal"]}]
map(select(.members | length > 2)) «| length» => 2
```

**Rule:** A count can be part of the test.

`.members | length > 2` runs on one team. It is true when that team has more than two members.

`length` is used twice. The first counts the members of one team. The last counts the teams that are left.

<!-- task -->

## Remember

- To count, make an array of what you want, then take its `length`.
- `map(select(test)) | length` counts the items that pass a test.
- `.[] | ... | length` is the mistake: `length` runs once for each output.
- A count can sit inside the test: `select(.members | length > 2)`.
