# Search Suggestions (medium)

A search box asks for suggestions as the user types. Asking the server at every key is wasteful.

Write `suggest(search, ms)`. It returns a function `ask(text)`, which returns a promise. Do not call `search` at once. Wait until `ask` has not been called for `ms` milliseconds. Then call `search` once, with the text of the last call. Every promise from that round fulfils with what `search` returned. If `search` returns a promise, they fulfil with its value.

The next call of `ask` after that starts a new round.

The file also exports `wait` and `within`, for the tests. `within(promise)` gives the value of the promise, or `"too slow"` after 50 ms.

Example 1:
  const ask = suggest((text) => text.length, 20);
  ask("c"); ask("ca")
  20 ms later, calls search("ca"), and both promises fulfil with 2
