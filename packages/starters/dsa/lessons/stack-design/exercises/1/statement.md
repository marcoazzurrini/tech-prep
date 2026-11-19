# Stack in Order (easy)

The array `ops` describes operations on a stack that starts empty. A positive number means: push that number. A `0` means: pop the top value. A pop never happens on an empty stack.

The stack is **in order** when no value is smaller than the value below it. An empty stack is in order. A stack with one value is in order.

Return one boolean for each operation: `true` if the stack is in order after that operation, and `false` if not. Each operation must take O(1) time.

Example 1: ops = [3, 5, 4] -> [true, true, false] 4 sits on 5, so the stack is not in order. Example 2: ops = [3, 5, 4, 0] -> [true, true, false, true] The pop removes 4. The stack [3, 5] is in order again.

Constraints: 0 <= len(ops) <= 1000, 0 <= ops[i] <= 1000.
