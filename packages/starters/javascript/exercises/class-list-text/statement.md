# Class List (easy)

Write `classList`. It takes any number of arguments. Each one is a class name, or a value that means "no class here": `false`, `null`, `undefined` or `""`.

It returns the class names in the order they were passed, joined by one space.

Example 1: classList("button", "large")  ->  "button large"
Example 2: classList("button", false, "active", null)  ->  "button active"
Example 3: classList()  ->  ""
