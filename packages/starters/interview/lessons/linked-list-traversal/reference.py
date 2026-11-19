from ds import ListNode


def last_even_value(head: ListNode | None) -> int:
    last_even = -1
    node = head
    while node:
        # A later even value replaces the one saved before.
        if node.val % 2 == 0:
            last_even = node.val
        node = node.next
    return last_even
