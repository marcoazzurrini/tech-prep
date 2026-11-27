# Send Until Delivered (medium)

A radio sends messages over a weak link. `send(message, callback)` calls `callback(error)` when the send fails, and `callback(null, receipt)` when it works.

Write `deliver(send, message, tries)`. It returns a promise of the receipt. When a send fails, send the message again, up to `tries` sends in all. After the last failure, reject with its error. A `send` that throws counts as a failed send.

Example 1: a `send` that fails twice and then calls back with "hi sent", with tries = 3  ->  "hi sent"
Example 2: a `send` that always fails with "no signal", with tries = 2  ->  rejects with the error "no signal"
