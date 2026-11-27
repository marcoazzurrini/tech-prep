Write `thrownText(task)`. It calls `task()` and says what was thrown.

- If the task throws an `Error` object, return its `message`.
- If it throws any other value, return that value turned into a string.
- If it throws nothing, return `"no error"`.

Example 1: thrownText(() => { throw new Error("no stock"); })  ->  "no stock"
Example 2: thrownText(() => { throw 404; })  ->  "404"
Example 3: thrownText(() => 5)  ->  "no error"
