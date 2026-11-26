# Contact Line (easy)

Write `contactLine(person)`. It returns the person's `phone`. When there is no phone, it returns the `email`. When there is neither, it returns `"no contact"`.

A phone or an email that is `null`, empty or not on the object counts as missing. The `person` itself may be `null`.

Example 1: contactLine({ phone: "555 0100", email: "ada@example.com" })  ->  "555 0100"
Example 2: contactLine({ phone: "", email: "bo@example.com" })  ->  "bo@example.com"
Example 3: contactLine({ phone: null })  ->  "no contact"
Example 4: contactLine(null)  ->  "no contact"
