`describeSlots(list)` should return a new array of strings, one for each index of `list`. An item becomes its text, as `String` gives it. A hole becomes `"-"`.

The code below leaves holes in its result, and writes `"-"` for a real `undefined` too. Fix it.

Example 1: describeSlots([1, , 3])  ->  ["1", "-", "3"]
Example 2: describeSlots([undefined, null])  ->  ["undefined", "null"]
Example 3: describeSlots(new Array(2))  ->  ["-", "-"]
