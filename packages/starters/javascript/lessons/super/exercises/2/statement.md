Write `class Ticket` and `class VipTicket extends Ticket`.

`Ticket` takes `(event, price)` in its constructor, has `summary()` returning `"<event>: $<price>"`, and has static `prefix()` returning `"TICKET"`.

`VipTicket` takes `(event, price, lounge)` in its constructor, calls the parent constructor, and sets `this.lounge`. Its `summary()` calls the parent `summary()` and appends `" [VIP: <lounge>]"`. Its static `prefix()` calls the parent `prefix()` and appends `"-VIP"`.

Example 1:
  const t = new VipTicket("Jazz", 80, "Gold");
  t.summary()  ->  "Jazz: $80 [VIP: Gold]"

Example 2: VipTicket.prefix()  ->  "TICKET-VIP"
