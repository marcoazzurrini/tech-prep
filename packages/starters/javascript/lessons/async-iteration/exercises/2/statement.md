Write `fromList(values)`. It returns an object that `for await` can loop over. The loop gets each value of the array, in order.

The object needs a `[Symbol.asyncIterator]()` method. The `next()` of the iterator it returns must give a promise of `{ value, done }`.

Example 1: for await (const v of fromList([1, 2]))  ->  the loop gets 1, then 2
Example 2: fromList([])[Symbol.asyncIterator]().next()  ->  fulfils with { value: undefined, done: true }
