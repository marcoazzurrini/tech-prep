# Remove Repeats

## Each value once

**Input**

```json
{"page": "/home", "browsers": ["firefox", "chrome", "firefox", "safari", "chrome"]}
```

**Filter**

```jq
.browsers | unique
```

**Output**

```json
["chrome", "firefox", "safari"]
```

```steps
.browsers => ["firefox", "chrome", "firefox", "safari", "chrome"]
.browsers «| unique» => ["chrome", "firefox", "safari"]
```

**Rule:** `unique` gives a new array where every value appears once.

`unique` also sorts the array, as `sort` does. The order of the input is lost: `firefox` came first, and now `chrome` does.

<!-- task -->

## The different values of a field

**Input**

```json
[
  {"name": "Ada", "city": "Oslo"},
  {"name": "Bo", "city": "Rome"},
  {"name": "Cy", "city": "Oslo"}
]
```

**Filter**

```jq
map(.city) | unique
```

**Output**

```json
["Oslo", "Rome"]
```

```steps
map(.city) => ["Oslo", "Rome", "Oslo"]
map(.city) «| unique» => ["Oslo", "Rome"]
```

**Rule:** For the different values of a field, take the field with `map`. Then remove the repeats.

`map(.city) | unique | length` gives `2`. Add `length` to count the different values.

<!-- task -->

## One object for each value

**Input**

```json
[
  {"name": "Ada", "city": "Oslo"},
  {"name": "Bo", "city": "Rome"},
  {"name": "Cy", "city": "Oslo"}
]
```

**Filter**

```jq
unique_by(.city)
```

**Output**

```json
[
  {"name": "Ada", "city": "Oslo"},
  {"name": "Bo", "city": "Rome"}
]
```

**Rule:** `unique_by(.city)` keeps whole objects: the first one it finds for each city.

`unique_by(.city)` drops Cy, because Ada already stands for Oslo. The result is ordered by the field, here by city.

<!-- task -->

## Remember

- `unique` gives an array where every value appears once. It also sorts, so the order of the input is lost.
- For the different values of a field: `map(.field) | unique`.
- Add `length` to count the different values.
- `unique_by(.field)` keeps the first object for each value of the field.
