`toText(promise)` should return a promise of a text. The text is `"ok: "` and the value when `promise` is fulfilled. It is `"error: "` and the error's message when `promise` is rejected.

The code below handles only the value. Make it handle a rejection too.

Example 1: toText(a promise fulfilled with 5)  ->  a promise fulfilled with "ok: 5"
Example 2: toText(a promise rejected with Error("late"))  ->  a promise fulfilled with "error: late"
