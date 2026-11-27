# Friendly Text (easy)

Write a tag `text`. It gives the same string as a plain template literal, with two changes:

- `null` and `undefined` are written as `-`.
- An array is written as its items joined with `", "`.

Example 1: text`Hi ${"Ada"}!`  ->  "Hi Ada!"
Example 2: text`Nick: ${undefined}`  ->  "Nick: -"
Example 3: text`Tags: ${["js", "css"]}`  ->  "Tags: js, css"
