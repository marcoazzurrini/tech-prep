# Waiting Line (easy)

Export one object named `line`. It is the waiting line of a shop, and there is only one. It has four functions:

- `join(name)` adds a person at the end and returns their position, counted from 1.
- `serve()` removes the first person and returns their name. With nobody waiting, it returns `null`.
- `size()` returns how many people are waiting.
- `reset()` empties the line.

The object has no other properties.

Example 1:
  line.join("ann")  ->  1
  line.join("bo")  ->  2
  line.serve()  ->  "ann"
  line.size()  ->  1
