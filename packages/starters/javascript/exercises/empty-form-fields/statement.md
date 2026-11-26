# Empty Form Fields (medium)

`emptyFields(form)` should return the names of the fields that were left empty, in the order of the form.

A field is empty when its value is `""`, `null` or `undefined`. Every other value is an answer, including `0` and `false`.

The code below gets some forms wrong. Fix it.

Example 1: emptyFields({ name: "", age: 0 })  ->  ["name"]
Example 2: emptyFields({ name: "Ada", email: null })  ->  ["email"]
