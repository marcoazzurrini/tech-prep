# Remove Repeats

A list often holds the same value many times: the same tag, the same city, the same status code. Often you want to see each value only once.

## Each value once

`unique` is a named filter. Give it an array. It gives back a new array where every value appears once.

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

`.browsers` takes the array. Then `unique` removes the repeats.

Look at the order. `unique` also sorts the array, as `sort` does. In the input `firefox` came first. In the output `chrome` comes first. The order of the input is lost.

<!-- task -->

## The different values of a field

With objects, the question is often about one field. Which cities do the users live in? First take the field from every object with `map`. Then remove the repeats.

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

- `map(.city)` gives `["Oslo", "Rome", "Oslo"]`.
- `unique` removes the second `"Oslo"`.

To know how many different values there are, add `length` at the end. `map(.city) | unique | length` gives `2`.

<!-- task -->

## One object for each value

Sometimes you want whole objects, but only one for each value of a field. Use `unique_by` and put the field in round brackets, as with `sort_by`.

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

Read `unique_by(.city)` as "unique by city".

- For each city, jq keeps the first object it finds. Cy is dropped, because Ada already stands for Oslo.
- The result is ordered by the field, here by city.

<!-- task -->

## Remember

- `unique` gives an array where every value appears once.
- `unique` also sorts. The order of the input is lost.
- For the different values of a field: `map(.field) | unique`.
- Add `length` to count the different values.
- `unique_by(.field)` keeps the first object for each value of the field.
