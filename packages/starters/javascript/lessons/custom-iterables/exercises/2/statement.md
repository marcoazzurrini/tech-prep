`makeQueue(people)` returns an object you can loop over. It gives the people in order.

Two loops in a row work. But a loop inside a loop over the same queue stops too soon. Fix it, so that every loop gets its own position.

Example 1: a loop inside a loop over makeQueue([1, 2])  ->  visits 1-1, 1-2, 2-1, 2-2
