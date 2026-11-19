# Choose with if

Real data needs different handling in different cases. A product with stock gets one label, a product without stock gets another. A test gives you `true` or `false`. Now you want jq to print something else for each answer.

## One test, two results

Write the test between `if` and `then`. Then give one result for each answer:

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

It has four words, always in this order:

- `if` comes before the test.
- `then` comes before the result for `true`.
- `else` comes before the result for `false`.
- `end` closes it. Do not forget it.

Read it as "if `stock` is above 0, then give `"in stock"`, or else give `"sold out"`".

The two results are filters. A result can be a fixed value, as here. It can also be a path, such as `.price`, or `.` for the whole input.

<!-- task -->

## More than two cases

Sometimes two results are not enough. Add a second test with `elif`. It is short for "else if":

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

jq goes from left to right and stops at the first test that is `true`:

- Is `used` 95 or more? No, it is 85. Go on.
- Is `used` 80 or more? Yes. Give `"nearly full"` and stop.
- `else` is for the values that pass no test.

The order matters. Put the strictest test first. If `.used >= 80` came first, a disk at 99 would also get `"nearly full"`.

You can add as many `elif` parts as you need. There is still only one `end`.

<!-- task -->

## A choice for every item

Put an `if` inside `map`, and jq makes the choice once for each item. Inside `map`, `.` is one item.

Here some readings are above 100. No reading should be:

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

- `120` is above 100, so it becomes `100`.
- `80` and `100` are not. `else .` gives the item back unchanged.

When the items are objects, use their keys in the test and in the results: `map(if .age >= 18 then "adult" else "minor" end)`.

A common mistake is to leave out `end`. Then jq stops with this:

```text
jq: error: syntax error, unexpected end of file (Unix shell quoting issues?) at <top-level>, line 1:
jq: error: Possibly unterminated 'if' statement at <top-level>, line 1:
```

"Unterminated" means "not closed". Add `end` after the last result. Inside `map`, the `end` comes before the closing `)`.

<!-- task -->

## Remember

- `if test then a else b end` gives `a` when the test is `true`, and `b` when it is `false`.
- The results are filters: a fixed value, a path, or `.` to keep the input.
- `elif` adds another test. jq stops at the first test that is `true`, so put the strictest test first.
- Every `if` needs one `end`.
- Inside `map`, the choice is made once for each item.
