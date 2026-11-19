# Min Stack (medium)

Implement a class `MinStack`. It is a stack that can also report its smallest value. Every method must run in O(1) time.
- `MinStack()`: creates an empty stack.
- `push(val)`: puts `val` on top of the stack.
- `pop()`: removes the top value.
- `top()`: returns the top value.
- `getMin()`: returns the smallest value in the stack.

Example:
  ops  = ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"]
  args = [[], [-2], [0], [-3], [], [], [], []]
  ->     [null, null, null, null, -3, null, 0, -2]

Constraints: -2^31 <= val <= 2^31 - 1, `pop`, `top` and `getMin` are only called on a stack that is not empty, at most 3 * 10^4 calls.
