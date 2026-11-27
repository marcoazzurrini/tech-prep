`importUsers(text)` parses a JSON file of users. When the JSON is broken, it throws an `ImportError` with the message `"bad file"`.

The original parse error is lost, so nobody can see what was wrong with the file. Fix the code. The `ImportError` must keep the parse error as its `cause`, and `new ImportError(message, { cause })` must store any cause it is given.

Example 1: importUsers('[{"name": "Ada"}]')  ->  [{ name: "Ada" }]
Example 2: importUsers("[oops")  ->  throws an ImportError whose cause is a SyntaxError
Example 3: new ImportError("x", { cause: 5 }).cause  ->  5
