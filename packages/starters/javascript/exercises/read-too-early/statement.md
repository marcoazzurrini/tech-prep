# Read Too Early (hard)

A program is made of files that import other files. `imports` maps each file to the list of files it imports, in the order of its import lines.

Usually a file runs after every file it imports. When files import each other, that cannot be true for all of them.

Write `tooEarly(imports, entry)`. The program starts from `entry`. Return every pair `[file, imported]` where `file` runs before the file it imports has run. The pairs can be in any order.

Example 1: tooEarly({ "main.js": ["a.js"], "a.js": [] }, "main.js")  ->  []
Example 2:
  tooEarly({ "main.js": ["a.js"], "a.js": ["b.js"], "b.js": ["a.js"] }, "main.js")
  ->  [["b.js", "a.js"]]

Constraints: every file is a key of `imports`, and no file lists itself.
