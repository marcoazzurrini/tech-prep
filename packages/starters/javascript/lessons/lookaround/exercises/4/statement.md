`addSeparators(text)` should put a comma between each group of three digits, counted from the right, in every number of the text. Every number is a whole number.

It works on a number alone, but not on numbers inside a sentence. Fix it.

Example 1: addSeparators("1234567")  ->  "1,234,567"
Example 2: addSeparators("Pop: 8000000 people")  ->  "Pop: 8,000,000 people"
Example 3: addSeparators("12000 cars, 950 bikes")  ->  "12,000 cars, 950 bikes"
