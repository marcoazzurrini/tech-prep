class Node:
    def __init__(self, person: int = 0):
        self.person = person
        self.prev = None
        self.next = None


class WaitingLine:
    def __init__(self):
        self.nodes = {}  # person -> node
        # Dummy nodes at both ends: the front is after head, the back is before tail.
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def join(self, person: int) -> None:
        node = Node(person)
        last = self.tail.prev
        last.next = node
        node.prev = last
        node.next = self.tail
        self.tail.prev = node
        self.nodes[person] = node

    def leave(self, person: int) -> None:
        # The map finds the node. The list cuts it out. Both are O(1).
        node = self.nodes.pop(person, None)
        if node:
            node.prev.next = node.next
            node.next.prev = node.prev

    def serve(self) -> int:
        first = self.head.next
        if first is self.tail:
            return -1
        self.leave(first.person)
        return first.person
