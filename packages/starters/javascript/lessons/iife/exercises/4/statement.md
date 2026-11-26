Finish the module `tally`. It counts votes. It must be an object with three functions:

- `add(name)` adds one vote for `name`.
- `votes(name)` returns the votes for `name`. A name with no votes gives 0.
- `reset()` removes all the votes.

The object has no other properties.

Example 1:
  tally.add("ann");
  tally.add("ann");
  tally.votes("ann")  ->  2
  tally.votes("bo")  ->  0
