from ds import ListNode


def insert_sorted(head: ListNode | None, val: int) -> ListNode | None:
    dummy = ListNode(0, head)
    # Stop at the node that the new node comes after. It may be the dummy.
    node = dummy
    while node.next and node.next.val < val:
        node = node.next
    node.next = ListNode(val, node.next)
    return dummy.next
