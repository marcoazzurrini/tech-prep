# Serial Tickets (medium)

Write a class `Ticket` that issues numbered tickets across the whole class.

- `new Ticket(holder)` gives the ticket an `id` starting at `1` and rising by `1` for each ticket made, stores `holder`, and starts with `cancelled` as `false`.
- `Ticket.issued()` returns how many tickets have been made since the start or last reset.
- `Ticket.reset()` sets the count back to `0`.
- `Ticket.fromBatch(holders)` returns an array of new `Ticket` instances, one for each name in `holders`.
- `cancel()` sets `cancelled` to `true` and must keep working even when passed as a callback without its ticket.

Example 1:
  Ticket.reset();
  const list = Ticket.fromBatch(["Ada", "Leo"]);
  list.map((t) => `${t.id}:${t.holder}`)  ->  ["1:Ada", "2:Leo"]
  Ticket.issued()  ->  2
  const { cancel } = list[0];
  cancel();
  list[0].cancelled  ->  true
