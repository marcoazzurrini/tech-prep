class MinStack:
    def __init__(self):
        # Each entry is (value, smallest value from here down).
        self.stack = []

    def push(self, val: int) -> None:
        smallest = min(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, smallest))

    def pop(self) -> None:
        # The entry below still holds the right minimum for what is left.
        self.stack.pop()

    def top(self) -> int:
        return self.stack[-1][0]

    def getMin(self) -> int:
        return self.stack[-1][1]
