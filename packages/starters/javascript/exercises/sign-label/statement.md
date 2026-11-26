# Sign Label (medium)

Write `signLabel(x)`. It takes a number and returns one of five strings:

- `"positive"` or `"negative"` for a number above or below zero, however large
- `"zero"` for `0`
- `"negative zero"` for `-0`
- `"not a number"` for `NaN`

Example 1: signLabel(5)  ->  "positive"
Example 2: signLabel(-Infinity)  ->  "negative"
Example 3: signLabel(0 * -1)  ->  "negative zero"
Example 4: signLabel(0 / 0)  ->  "not a number"
