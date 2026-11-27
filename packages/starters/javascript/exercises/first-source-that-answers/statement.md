# First Source That Answers (medium)

Write `firstAnswer(sources)`. Each source is a function that returns a promise.

Call the sources one at a time, in order. If a source's promise fulfils, that value is the answer, and no later source is called. If it rejects, try the next one. Return a promise of the answer.

If every source rejects, reject with the last source's error. If the list is empty, reject with `new Error("no sources")`.

The starting code has `wait(ms, value)`, which fulfils with `value` after `ms` milliseconds, and `failAfter(ms, message)`, which rejects. The tests use them.

Example 1: firstAnswer([() => failAfter(10, "down"), () => wait(10, "b")])  ->  a promise of "b"
Example 2: firstAnswer([() => failAfter(5, "x"), () => failAfter(5, "y")])  ->  rejects with the "y" error
