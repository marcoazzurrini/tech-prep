Write `withBusyFlag(state, task)`. It sets `state.busy` to `true`, calls `task()` and waits for its promise. It returns a promise of the task's value.

When it is done, `state.busy` must be `false` again, also when the task fails. A failure still reaches the caller.

Example 1: withBusyFlag(state, async () => 5)  ->  5, and state.busy is false
Example 2: withBusyFlag(state, async () => { throw new Error("x"); })  ->  rejects with "x", and state.busy is false
