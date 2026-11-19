# Waiting Line (easy)

Implement a class `WaitingLine` for people who wait in a line. Each person is a number.

- `WaitingLine()`: creates an empty line.
- `join(person)`: adds `person` at the back of the line.
- `leave(person)`: removes `person` from the line, from any place. Does nothing if the person is not in the line.
- `serve()`: removes the person at the front and returns their number. Returns `-1` if the line is empty.

Every method must run in O(1) time. The starting code already builds an empty doubly linked list with a dummy node at each end, and an empty map.

Example:
ops  = ["WaitingLine", "join", "join", "join", "leave", "serve", "serve", "serve"]
args = [[], [4], [7], [9], [7], [], [], []]
->     [null, null, null, null, null, 4, 9, -1]

Constraints: 0 <= person <= 1000, `join` is never called for a person who is in the line, at most 1000 calls.
