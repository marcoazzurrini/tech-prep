`cloneGraph(value)` should return a deep clone of `value`. The values are primitives, arrays and plain objects. An object may lead back to itself, and one object may be reached from two places.

The code below overflows the stack on a cycle. Fix it.

Example 1:
  const room = { name: "Lobby" };
  room.exit = room;
  const copy = cloneGraph(room);
  copy.exit === copy  ->  true
  copy === room  ->  false
