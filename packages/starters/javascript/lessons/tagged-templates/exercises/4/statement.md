Write a tag `pieces`. It returns an array of every piece of the template, in order: the fixed strings and the values. Leave out the empty strings.

Each value stays as it is. A number stays a number.

Example 1: pieces`a${1}b${2}`  ->  ["a", 1, "b", 2]
Example 2: pieces`${"x"}`  ->  ["x"]
Example 3: pieces``  ->  []
