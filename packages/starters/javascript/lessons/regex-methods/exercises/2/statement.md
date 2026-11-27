Write `readSettings(text)`. The text holds settings such as `width=10`, with `;` and spaces between them. A name and a value are each made of letters and digits.

Return an object with each name and its value, as a string. When a name comes twice, the last value wins.

Example 1: readSettings("width=10; height=20")  ->  { width: "10", height: "20" }
Example 2: readSettings("size=12; size=14")  ->  { size: "14" }
Example 3: readSettings("")  ->  {}
