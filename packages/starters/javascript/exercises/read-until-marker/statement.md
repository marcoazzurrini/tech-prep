# Read Until a Marker (medium)

Write `readUntil(iterator, marker)`. It takes an iterator and reads values from it until it meets `marker`. It returns an array of the values that came before the marker.

The marker itself is used up. The iterator is left just after it, so the caller can keep reading. If the marker never comes, `readUntil` returns every value.

Example 1:
  const it = [1, 2, 0, 3, 4].values();
  readUntil(it, 0)  ->  [1, 2]
  [...it]  ->  [3, 4]
Example 2: readUntil([5, 6].values(), 0)  ->  [5, 6]
