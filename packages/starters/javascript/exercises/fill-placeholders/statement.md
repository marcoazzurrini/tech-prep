# Fill the Placeholders (medium)

Write `fillPlaceholders(template, data)`. A placeholder is a name in curly braces, such as `{name}`. A name is made of letters, digits and `_`.

Return the template with each placeholder replaced by the value of that key in `data`, turned into a string. A placeholder whose key is not one of `data`'s own keys stays as it is.

Example 1: fillPlaceholders("Hi {name}!", { name: "Ada" })  ->  "Hi Ada!"
Example 2: fillPlaceholders("{a}{b}{a}", { a: "x", b: "y" })  ->  "xyx"
Example 3: fillPlaceholders("Dear {title} {name}", { name: "Lin" })  ->  "Dear {title} Lin"
Example 4: fillPlaceholders("{count} items", { count: 0 })  ->  "0 items"
