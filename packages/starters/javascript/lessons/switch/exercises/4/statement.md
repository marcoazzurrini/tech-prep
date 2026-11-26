`contactLine(user)` should say how to reach a user. It prefers the phone, then the email. A missing or empty value does not count.

The code below always returns `"no contact"`. Fix it.

Example 1: contactLine({ phone: "555 0101", email: "ada@example.com" })  ->  "call 555 0101"
Example 2: contactLine({ email: "ada@example.com" })  ->  "write to ada@example.com"
Example 3: contactLine({})  ->  "no contact"
