Write `countdown(from)`. It returns an object that `for await...of` can loop over. The loop gets the numbers from `from` down to 1.

Loop over the same object twice, and both loops get every number. The object is not iterable with a plain `for...of`.

Example 1: for await (const n of countdown(3))  ->  3, then 2, then 1
Example 2: for await (const n of countdown(0))  ->  no numbers
