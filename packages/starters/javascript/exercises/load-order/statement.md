# Load Order (medium)

A program is made of files that import other files. `imports` maps each file to the list of files it imports, in the order of its import lines.

Write `loadOrder(imports, entry)`. It returns the file names in the order in which their code runs when the program starts from `entry`.

Example 1: loadOrder({ "main.js": ["a.js"], "a.js": [] }, "main.js")  ->  ["a.js", "main.js"]
Example 2:
  loadOrder({ "main.js": ["a.js", "b.js"], "a.js": ["b.js"], "b.js": [] }, "main.js")
  ->  ["b.js", "a.js", "main.js"]

Constraints: every file is a key of `imports`, and no file imports itself, directly or through other files.
