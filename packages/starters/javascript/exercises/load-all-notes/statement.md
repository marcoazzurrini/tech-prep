# Load All Notes (medium)

Write `loadNotes(names, read)`. `read(name, callback)` reads one note. Later it calls `callback(error)` or `callback(null, text)`.

Start every read at once. Return a promise of the texts, in the order of `names`. If a read fails, reject with its error.

Some `read` functions are buggy and call the callback more than once. Only the first call counts.

Example 1: loadNotes(["a", "b"], read)  ->  fulfils with the two texts, the text of "a" first
Example 2: loadNotes([], read)  ->  fulfils with []
