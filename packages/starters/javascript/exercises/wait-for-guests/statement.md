# Wait for Guests (medium)

Write `waitForGuests(names)`. It returns an object with two parts:

- `arrived`: a promise that fulfils once every guest in `names` has arrived. Its value is the list of names, in the order the guests arrived.
- `arrive(name)`: a function that marks a guest as arrived.

A name that is not on the list does not count, and neither does a second arrival of the same guest. With an empty list, `arrived` fulfils with `[]` at once.

Example 1:
  const party = waitForGuests(["ana", "bo"]);
  party.arrive("bo");
  party.arrive("ana");
  party.arrived is a promise of ["bo", "ana"].
