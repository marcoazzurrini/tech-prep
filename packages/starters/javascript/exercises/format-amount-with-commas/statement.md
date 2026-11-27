# Format an Amount (medium)

Write `formatAmount(amount)`. It takes a number written as a string. The number may start with `-` and may have a decimal part after a `.`.

Return it with a comma between each group of three digits of the whole part, counted from the right. Leave the decimal part as it is.

Example 1: formatAmount("1234567.891")  ->  "1,234,567.891"
Example 2: formatAmount("-1234")  ->  "-1,234"
Example 3: formatAmount("0.123456")  ->  "0.123456"
Example 4: formatAmount("999")  ->  "999"
