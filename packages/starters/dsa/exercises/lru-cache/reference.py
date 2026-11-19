class Node:
    def __init__(self, key: int = 0, value: int = 0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.nodes = {}  # key -> node
        # Dummy nodes at both ends: the oldest key is after head, the newest before tail.
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _unlink(self, node: Node) -> None:
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_newest(self, node: Node) -> None:
        last = self.tail.prev
        last.next = node
        node.prev = last
        node.next = self.tail
        self.tail.prev = node

    def get(self, key: int) -> int:
        if key not in self.nodes:
            return -1
        # A read is a use: move the node to the newest end.
        node = self.nodes[key]
        self._unlink(node)
        self._add_newest(node)
        return node.value

    def put(self, key: int, value: int) -> None:
        if key in self.nodes:
            self._unlink(self.nodes[key])
        node = Node(key, value)
        self.nodes[key] = node
        self._add_newest(node)
        if len(self.nodes) > self.capacity:
            # The node after head is the least recently used.
            oldest = self.head.next
            self._unlink(oldest)
            del self.nodes[oldest.key]
