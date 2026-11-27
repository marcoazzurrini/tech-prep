# Load the Port Setting (medium)

Write `loadPort(text)`. `text` is JSON for a settings object, such as `{"port": 8080}`. Return its `port`.

- If the text is not valid JSON, throw `new Error("settings are not valid JSON")`. Keep the parse error as its `cause`.
- If `port` is missing or is not a number, throw a `TypeError`.
- If `port` is not a whole number from 1 to 65535, throw a `RangeError`.

Example 1: loadPort('{"port": 8080}')  ->  8080
Example 2: loadPort("{port: 80}")  ->  throws an Error whose cause is a SyntaxError
Example 3: loadPort('{"port": "80"}')  ->  throws a TypeError
Example 4: loadPort('{"port": 70000}')  ->  throws a RangeError
