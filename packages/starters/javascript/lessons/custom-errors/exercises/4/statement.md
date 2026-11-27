Write `handle(task)`. It calls `task()` and returns its result.

Two kinds of failure are known. For a `NetworkError`, including its child `OfflineError`, return `"retry later"`. For an `AuthError`, return `"denied"`. Anything else that the task throws must reach the caller unchanged.

Example 1: handle(() => 42)  ->  42
Example 2: handle(() => { throw new OfflineError("no wifi"); })  ->  "retry later"
Example 3: handle(() => { throw new AuthError("no token"); })  ->  "denied"
Example 4: handle(() => { throw new TypeError("bug"); })  ->  throws the TypeError
