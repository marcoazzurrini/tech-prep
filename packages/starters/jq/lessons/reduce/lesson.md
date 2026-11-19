# Carry a Result Along

Sometimes you want one result from a whole list, such as the total of its numbers. You must look at every item, and remember a result while you go. `reduce` does that.

## One result, changed by each item

First a small tool: `+` adds two numbers, and `-` subtracts. `2 + 3` gives `5`.

Think how you add up `[4, 10, 3]` by hand. You start at 0. You take one number at a time and add it to the result you have so far:

- Start: the result is `0`.
- Item `4`: `0 + 4` gives `4`.
- Item `10`: `4 + 10` gives `14`.
- Item `3`: `14 + 3` gives `17`.

`reduce` works in the same way.

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

- `.[]` gives the items, one at a time.
- `as $n` calls the item of this turn `$n`.
- `0` is the **start**: the result before the first item.
- `. + $n` is the **update**. It runs once for each item. Here the dot is **the result so far**. What the update gives is the new result.

After the last item, jq prints the result.

<!-- task -->

## Items that are objects

Often the items are objects, and the number is inside. A variable can start a path: `$item.price` takes `price` from the item.

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

- Start: `0`.
- The pen: `0 + 2` gives `2`.
- The book: `2 + 12` gives `14`.
- The bag: `14 + 30` gives `44`.

A common mistake is to write `.price` in the update:

```jq
reduce .items[] as $item (0; . + .price)
```

```text
jq: error: Cannot index number with string "price"
```

In the update, the dot is the result so far. That is a number, and a number has no `price`. The item is in the variable, so write `$item.price`.

<!-- task -->

## The start can come from the input

The start does not have to be `0`. It is a filter, and it runs on the input. So the result can begin with a value from the data.

A game has a score. Each round changes it. A round with `-2` takes two points away.

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

- Start: `.score` gives `10`.
- Round `5`: `10 + 5` gives `15`.
- Round `-2`: `15 + -2` gives `13`.
- Round `8`: `13 + 8` gives `21`.

To write a `reduce`, answer three questions in order. Which items do I walk over? What is the result before the first item? How does one item change the result?

When the list is empty, the update never runs. The output is the start.

<!-- task -->

## Remember

- `reduce items as $x (start; update)` walks over the items and carries one result along.
- The start is the result before the first item.
- The update runs once for each item. In it, `.` is the result so far and `$x` is the item.
- For a value inside the item, write `$x.key`, not `.key`.
- An empty list gives the start.
