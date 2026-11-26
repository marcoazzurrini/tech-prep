Write `removeGuest(guests, name)`. `guests` maps a guest's name to a table number.

Remove the guest from the object. Return `true` if the guest was in it, and `false` if not.

A guest can be in the object with no table yet. The value is then `undefined`.

Example 1:
  const guests = { ada: 4, bo: 2 };
  removeGuest(guests, "ada")  ->  true
  "ada" in guests  ->  false
  removeGuest(guests, "kai")  ->  false
