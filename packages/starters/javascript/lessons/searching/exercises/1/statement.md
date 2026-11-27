`isWaiting(tickets, id)` should return `true` when a ticket in `tickets` has that `id`, and `false` otherwise.

The code below fails when the matching ticket is first in the list, and when no ticket matches. Fix it.

Example 1: isWaiting([{ id: 10 }, { id: 20 }], 10)  ->  true
Example 2: isWaiting([{ id: 10 }, { id: 20 }], 99)  ->  false
Example 3: isWaiting([], 10)  ->  false
