# First Replies (medium)

A search asks several servers at once and shows the first answers that come back. Write `firstReplies(requests, n)`. `requests` is an array of promises, and `n` is between 1 and its length.

Return a promise of the values of the first `n` requests to fulfil, in the order they fulfilled. Skip the requests that reject. If so many reject that `n` values can no longer arrive, reject at once with an `AggregateError` of the reasons so far.

Example 1: firstReplies([later(60, "a"), later(5, "b"), later(30, "c")], 2)  ->  ["b", "c"]
Example 2: firstReplies([failLater(5, "x"), later(30, "c"), "now"], 2)  ->  ["now", "c"]
Example 3: firstReplies([failLater(5, "x"), failLater(30, "y"), "ok"], 2)  ->  rejects with an AggregateError

Note: `later` and `failLater` are helpers for the tests, at the top of the file.
