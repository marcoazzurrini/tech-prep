# Fill the Template (medium)

Write `fillTemplate(template, data)`. It replaces each `{{name}}` in the string `template` with the value of `name` in the object `data`.

A name can hold dots, as in `{{user.city}}`, to read nested objects. Spaces around the name are ignored. Only own keys count. A name that does not lead to a value, or leads to `null` or `undefined`, gives an empty string.

Example 1: fillTemplate("Hi {{name}}!", { name: "Ada" })  ->  "Hi Ada!"
Example 2: fillTemplate("{{user.city}}", { user: { city: "Rome" } })  ->  "Rome"
Example 3: fillTemplate("[{{constructor}}]", {})  ->  "[]"

Note: templates come from users. Nothing in them may run as code.
