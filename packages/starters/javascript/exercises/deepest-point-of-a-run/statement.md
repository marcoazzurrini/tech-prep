# Deepest Point (easy)

`events` lists what a program did, in order. A name such as `"load"` means that a call to that function starts. `"return"` means that the call on top of the call stack returns.

Write `deepestPoint(events)`. It returns the largest number of calls that were on the call stack at the same moment.

Example 1: deepestPoint(["main", "load", "return", "save", "return", "return"])  ->  2
Example 2: deepestPoint(["main", "load", "parse", "return"])  ->  3
Example 3: deepestPoint([])  ->  0
