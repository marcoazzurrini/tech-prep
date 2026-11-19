from ds import ListNode


def has_cycle(head: ListNode | None) -> bool:
    # Floyd: the fast pointer laps the slow one only if there is a loop.
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            return True
    return False
