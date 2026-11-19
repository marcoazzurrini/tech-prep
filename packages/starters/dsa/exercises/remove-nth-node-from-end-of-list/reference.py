from ds import ListNode


def remove_nth_from_end(head: ListNode | None, n: int) -> ListNode | None:
    dummy = ListNode(0, head)
    # Keep `fast` exactly n + 1 nodes ahead of `slow`.
    slow = fast = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        slow, fast = slow.next, fast.next
    slow.next = slow.next.next
    return dummy.next
