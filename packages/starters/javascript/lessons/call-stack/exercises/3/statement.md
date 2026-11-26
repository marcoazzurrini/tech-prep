`events` lists what a program did, in order. A name such as `"serve"` means that a call to that function starts. `"return"` means that the call on top of the stack returns.

Write `stackTrace(events)`. It returns the stack trace after the last event: the names of the calls that are still on the stack, newest first.

Example 1: stackTrace(["serve", "cook", "return", "wash"])  ->  ["wash", "serve"]
Example 2: stackTrace(["main", "return"])  ->  []
