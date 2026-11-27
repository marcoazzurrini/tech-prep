`Ticket(film)` makes a ticket when it is called with `new`, but throws when it is called without it.

Change `Ticket` so that a call without `new` gives a new ticket too, linked to `Ticket.prototype` like the others.

Example 1: new Ticket("Dune").film  ->  "Dune"
Example 2: Ticket("Up").film  ->  "Up"
