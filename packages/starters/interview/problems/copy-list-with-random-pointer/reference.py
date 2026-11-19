from ds import RandomNode


def copy_random_list(head: RandomNode | None) -> RandomNode | None:
    # First pass: one copy per node, found again through a map.
    copies: dict[RandomNode, RandomNode] = {}
    node = head
    while node:
        copies[node] = RandomNode(node.val)
        node = node.next

    # Second pass: wire the copies to each other.
    node = head
    while node:
        copies[node].next = copies[node.next] if node.next else None
        copies[node].random = copies[node.random] if node.random else None
        node = node.next

    return copies[head] if head else None
