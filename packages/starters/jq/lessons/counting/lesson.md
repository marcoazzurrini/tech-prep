# Count Things

How many builds failed? How many users are active? jq has no special tool for such questions. You already know `length`, which counts the items of an array. So counting always has two steps: make an array of the things you want, then take its `length`.

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

- `map(select(.active))` gives an array with two users: Ada and Cy.
- `length` counts the items of that array.

Build it in the same two steps. First write the step that makes the array. Read the output, and check that it holds the right items. Then add `| length`.

<!-- task -->

## One array, not separate outputs

A common mistake is to count after `.[]`. The input is the same as above:

```jq
.[] | select(.active) | length
```

```json
3
3
```

Two numbers come out, and neither is the count. Here is why. `.[]` takes the array apart. `select` passes on Ada's object, then Cy's object. `length` runs once for each. It counts the keys of each object, and each has three keys.

`length` counts what is inside one value. Several outputs are not one value. Collect them first:

```jq
[.[] | select(.active)] | length
```

```json
2
```

`map(select(.active)) | length` means the same, because `map` does the collecting.

<!-- task -->

## Count inside a test

A count can also be part of the test. Say you want to know how many teams have more than two members:

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

- Inside `select`, `.members | length > 2` runs on one team. It is true when that team has more than two members.
- `map` keeps the teams that pass: `core` and `ops`.
- The last `length` counts those teams.

The two `length` steps do different jobs. The first counts the members of one team. The second counts the teams that are left.

<!-- task -->

## Remember

- To count, make an array of what you want, then take its `length`.
- `map(select(test)) | length` counts the items that pass a test.
- Build it in two steps: check the array first, then add `| length`.
- `.[] | ... | length` is the mistake: `length` runs once for each output.
- A count can sit inside the test: `select(.members | length > 2)`.
