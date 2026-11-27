`readCount(text)` reads JSON such as `{"count": 3}` and returns the count. It returns `null` when the text is not valid JSON.

The code below returns `null` for every error. So a negative count, or JSON that is not an object, looks like bad JSON too.

Fix it. Return `null` only for a `SyntaxError`. Every other error must reach the caller.

Example 1: readCount('{"count": 3}')  ->  3
Example 2: readCount("{count: 3}")  ->  null
Example 3: readCount('{"count": -1}')  ->  throws a RangeError
Example 4: readCount("null")  ->  throws a TypeError
