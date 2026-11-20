# Choose with if

## One test, two results

**Input**

```json
{"item": "lamp", "stock": 0, "price": 30}
```

**Filter**

```jq
if .stock > 0 then "in stock" else "sold out" end
```

**Output**

```json
"sold out"
```

**Rule:** `if test then a else b end` gives `a` when the test is `true`, and `b` when it is `false`.

`if`, `then`, `else` and `end` always come in this order. `end` closes the `if`. Do not forget it.

`"in stock"` and `"sold out"` are filters. A result can also be a path, such as `.price`, or `.` for the whole input.

<!-- task -->

## More than two cases

**Input**

```json
{"disk": "sda", "used": 85}
```

**Filter**

```jq
if .used >= 95 then "full" elif .used >= 80 then "nearly full" else "fine" end
```

**Output**

```json
"nearly full"
```

**Rule:** `elif` adds a second test. jq goes from left to right and stops at the first test that is `true`.

`elif` is short for "else if". You can add as many `elif` parts as you need, and there is still only one `end`. `else` is for the values that pass no test.

`.used >= 95` comes first because it is the strictest test. With `.used >= 80` first, a disk at 99 would also get `"nearly full"`.

<!-- task -->

## A choice for every item

**Input**

```json
[120, 80, 100]
```

**Filter**

```jq
map(if . > 100 then 100 else . end)
```

**Output**

```json
[100, 80, 100]
```

**Rule:** Inside `map`, jq makes the choice once for each item, and `.` is one item.

`else .` gives the item back unchanged. So `80` and `100` stay as they are.

`map(if .age >= 18 then "adult" else "minor" end)` works on objects. Use their keys in the test and in the results.

**Common mistake:** No `end`.

**Wrong**

```jq
map(if . > 100 then 100 else .)
```

**Error**

```text
jq: error: syntax error, unexpected ')' (Unix shell quoting issues?) at <top-level>, line 1:
jq: error: Possibly unterminated 'if' statement at <top-level>, line 1:
```

**Fix**

```jq
map(if . > 100 then 100 else . «end»)
```

Look for the line with `Possibly unterminated 'if' statement`. "Unterminated" means "not closed". The first line can differ: inside `map` it says `unexpected ')'`, and without `map` it says `unexpected end of file`. Ignore the note about shell quoting. Inside `map`, the `end` comes before the closing `)`.

<!-- task -->

## Remember

- `if test then a else b end` gives `a` when the test is `true`, and `b` when it is `false`.
- The results are filters: a fixed value, a path, or `.` to keep the input.
- `elif` adds another test. jq stops at the first test that is `true`, so put the strictest test first.
- Every `if` needs one `end`. Inside `map`, the choice is made once for each item.
