Write the class `TimeoutError`, an error for a task that took too long.

`new TimeoutError(ms)` makes an error whose message is `Timed out after <ms> ms`. Its `name` is `"TimeoutError"`, and its `ms` field holds the number it was given. It must be an instance of `Error`.

Example 1: String(new TimeoutError(500))  ->  "TimeoutError: Timed out after 500 ms"
Example 2: new TimeoutError(500).ms  ->  500
Example 3: new TimeoutError(500) instanceof Error  ->  true
