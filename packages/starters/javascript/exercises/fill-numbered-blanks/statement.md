# Fill the Blanks (medium)

Write `fillBlanks`. Its first argument is a text that holds numbered blanks, such as `{0}` and `{1}`. After the text, it takes any number of values.

It returns the text with each blank `{n}` replaced by the value at position `n`, counting from 0. The same blank may come several times. A blank that has no value stays as it is.

Example 1: fillBlanks("Hi {0}, you owe {1}", "Ada", 20)  ->  "Hi Ada, you owe 20"
Example 2: fillBlanks("{0} and {0}", "tea")  ->  "tea and tea"
Example 3: fillBlanks("{0}, {1}", "x")  ->  "x, {1}"

Constraints: a value is a string, a number, a boolean or `null`, and it never holds a blank itself.
