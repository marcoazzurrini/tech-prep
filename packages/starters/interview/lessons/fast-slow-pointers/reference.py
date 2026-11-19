from ds import ListNode


def sum_first_half(head: ListNode | None) -> int:
    total = 0
    slow = fast = head
    # Each double step of fast pays for one node of the first half.
    while fast and fast.next:
        total += slow.val
        slow = slow.next
        fast = fast.next.next
    return total
