from ds import ListNode


def reverse_first_k(head: ListNode | None, k: int) -> ListNode | None:
    prev, current = None, head
    for _ in range(k):
        # Turn one link around, then move forward.
        current.next, prev, current = prev, current, current.next
    # The old head is now the last reversed node. Join it to the rest.
    head.next = current
    return prev
