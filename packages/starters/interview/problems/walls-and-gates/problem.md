# Walls and Gates (medium)

`rooms` is a grid. Each cell holds one of three values:

- `-1` is a wall.
- `0` is a gate.
- `2147483647` is an empty room.

Fill each empty room with the number of steps to its nearest gate. A step moves up, down, left or right, and cannot pass a wall. A room that cannot reach a gate keeps `2147483647`.

Do it in place: change `rooms` directly. The function returns nothing; the grid itself is checked.

Example 1: rooms = [[0, 2147483647, 2147483647, 2147483647]]  ->  [[0, 1, 2, 3]]
Example 2: rooms = [[2147483647, -1, 0]]  ->  [[2147483647, -1, 0]]  (the wall blocks the room)
Example 3: rooms = [[0, -1], [2147483647, 2147483647]]  ->  [[0, -1], [1, 2]]

Constraints: 1 <= rows, cols <= 100.
