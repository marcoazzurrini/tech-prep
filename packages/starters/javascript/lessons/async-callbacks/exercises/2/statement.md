Write `parseLater(text, callback)`. It parses `text` as JSON, later, in a timer of 0 ms. It uses an error-first callback:

- When `text` is valid JSON, it calls `callback(null, value)`.
- When `JSON.parse` throws, it calls `callback(error)` with that error.

The callback is always called later, never during the call to `parseLater`, even when the text is invalid.

Example 1: parseLater('{"tea": 2}', callback)  ->  later, callback(null, { tea: 2 })
Example 2: parseLater("{tea", callback)  ->  later, callback(error), where error.name is "SyntaxError"
