Write `codePointLabels(text)`. It returns an array with one label for each code point of the text.

A label is `U+` and the code point in hexadecimal, in capital letters, with at least four digits.

Example 1: codePointLabels("hi")  ->  ["U+0068", "U+0069"]
Example 2: codePointLabels("a😀")  ->  ["U+0061", "U+1F600"]
Example 3: codePointLabels("")  ->  []
