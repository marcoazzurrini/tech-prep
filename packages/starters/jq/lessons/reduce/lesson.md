# Carry a Result Along

## One result, changed by each item

**Input**

```json
[4, 10, 3]
```

**Filter**

```jq
reduce .[] as $n (0; . + $n)
```

**Output**

```json
17
```

```steps
0 «+ 4» => 4
4 «+ 10» => 14
14 «+ 3» => 17
```

**Rule:** `reduce items as $x (start; update)` walks over the items and carries one result along. After the last item, jq prints the result.

`0` is the **start**: the result before the first item.

`. + $n` is the **update**. It runs once for each item. In it, `.` is the result so far and `$n` is the item.

<!-- task -->

## Items that are objects

**Input**

```json
{"items": [{"name": "pen", "price": 2}, {"name": "book", "price": 12}, {"name": "bag", "price": 30}]}
```

**Filter**

```jq
reduce .items[] as $item (0; . + $item.price)
```

**Output**

```json
44
```

```steps
0 «+ 2» => 2
2 «+ 12» => 14
14 «+ 30» => 44
```

**Rule:** A variable can start a path. `$item.price` takes `price` from the item.

`reduce .items[] as $item (0; . + $item.price + 1)` gives `47`. The update can add more than one value in each turn.

**Common mistake:** `.price` in the update.

**Wrong**

```jq
reduce .items[] as $item (0; . + «.price»)
```

**Error**

```text
jq: error: Cannot index number with string "price"
```

**Fix**

```jq
reduce .items[] as $item (0; . + «$item.price»)
```

In the update, the dot is the result so far. That is a number, and a number has no `price`. The item is in the variable.

<!-- task -->

## The start can come from the input

**Input**

```json
{"score": 10, "rounds": [5, -2, 8]}
```

**Filter**

```jq
reduce .rounds[] as $r (.score; . + $r)
```

**Output**

```json
21
```

```steps
.score => 10
10 «+ 5» => 15
15 «+ -2» => 13
13 «+ 8» => 21
```

**Rule:** The start is a filter, and it runs on the input. So the result can begin with a value from the data.

`.score` is also the output when `rounds` is empty. The update never runs then.

`reduce .rounds[] as $r (.score; . - $r)` gives `-1`. `-` subtracts each item from the result so far.

<!-- task -->

## Remember

- `reduce items as $x (start; update)` walks over the items and carries one result along.
- The start is the result before the first item. An empty list gives the start.
- The update runs once for each item. In it, `.` is the result so far and `$x` is the item.
- For a value inside the item, write `$x.key`, not `.key`.
