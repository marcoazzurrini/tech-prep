# Display Name (easy)

Write `displayName(user)`. A user has a `first` name, and may have a `middle` and a `last` name. A missing name is `null`, or is not on the object at all.

Return the names that are present, with one space between them.

Example 1: displayName({ first: "Ada", last: "Lovelace" })  ->  "Ada Lovelace"
Example 2: displayName({ first: "Mary", middle: "Ann", last: "Evans" })  ->  "Mary Ann Evans"
Example 3: displayName({ first: "Cher", middle: null })  ->  "Cher"
