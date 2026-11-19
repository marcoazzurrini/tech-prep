# Every Item with .[]

`.[]` gives every item of an array as its own output. It does not give an array back. What follows the pipe then runs once for each item.

## Worked example

Give the city of every weather report.

**Input**

```json
[
  {"city": "Oslo", "temp": 4},
  {"city": "Rome", "temp": 18},
  {"city": "Cairo", "temp": 31}
]
```

**Filter**

```jq
.[] | .city
```

**Output**

```json
"Oslo"
"Rome"
"Cairo"
```

## Why it works

- `.[]` opens the array. It gives three outputs, one for each report.
- `.city` runs three times, once on each report.
- When the array sits in a field, write `.reports[]`. On an object, `.[]` gives every value.

## When to use it

- The task says "every", "each" or "all", or it asks for each value "as its own output".
- You get the error `Cannot index array with string "city"`: you asked the array for a field. Put `.[]` before it.
- An empty array gives no output at all. That is correct.
