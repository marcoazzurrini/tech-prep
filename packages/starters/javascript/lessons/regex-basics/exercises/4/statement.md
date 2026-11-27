Write `containsTerm(text, term)`. It returns `true` when `text` contains `term`, in any mix of capital and small letters, and `false` otherwise.

Solve it with a regex built from `term`. The term may hold any character, such as `+`, `.` or `(`.

Example 1: containsTerm("I write C++", "c++")  ->  true
Example 2: containsTerm("Version 100", "1.0")  ->  false
Example 3: containsTerm("App (Beta)", "(beta)")  ->  true
